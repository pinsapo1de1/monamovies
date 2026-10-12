// Copyright (C) 2017-2023 Smart code 203358507

require('spatial-navigation-polyfill');
const React = require('react');
const { useTranslation } = require('react-i18next');
const { createPath, useLocation, useNavigate } = require('react-router');
const { useCore } = require('stremio/core');
const { Routes, useGoBack } = require('stremio-router');
const { Chromecast, ServicesProvider, GamepadProvider } = require('stremio/services');
const { FullscreenProvider, ToastProvider, TooltipProvider, ShortcutsProvider, DiscordProvider, CONSTANTS, useBinaryState, useProfile, withCoreSuspender, usePlatform } = require('stremio/common');
const ServicesToaster = require('./ServicesToaster');
const SearchParamsHandler = require('./SearchParamsHandler');
const DeepLinkHandler = require('./DeepLinkHandler');
const { default: ShellOpenHandler } = require('./ShellOpenHandler');
const { default: UpdaterBanner } = require('./UpdaterBanner');
const { default: ShortcutsModal } = require('./ShortcutsModal');
const { default: GamepadModal } = require('./GamepadModal');
const { default: useInterfaceScale } = require('./useInterfaceScale');
const styles = require('./styles');

const ProtectedRoutes = withCoreSuspender(Routes);
const NAVIGATE_TABS_ROUTES = ['/', '/discover', '/library', '/calendar', '/addons', '/settings'];

const App = () => {
    const core = useCore();
    const profile = useProfile();
    const changeInterfaceScale = useInterfaceScale(profile);
    const { i18n } = useTranslation();
    const { shell } = usePlatform();
    const location = useLocation();
    const navigate = useNavigate();
    const goBack = useGoBack();
    const locationPath = createPath(location);
    const previousPathRef = React.useRef(locationPath);
    const [gamepadSupportEnabled, setGamepadSupportEnabled] = React.useState(false);
    const services = React.useMemo(() => {
        return {
            chromecast: new Chromecast(),
        };
    }, []);
    const [shortcutModalOpen,, closeShortcutsModal, toggleShortcutModal] = useBinaryState(false);
    const [gamepadModalOpen,, closeGamepadModal, toggleGamepadModal] = useBinaryState(false);

    // --- Sincronización transparente con Upstash Redis ---
    React.useEffect(() => {
        const keysToSync = ['stremio_library', 'stremio_streaming', 'stremio_recent'];

        // Cargar datos de Upstash Redis de forma prioritaria
        fetch('/api/library')
            .then((res) => res.json())
            .then((data) => {
                if (data.storage) {
                    let updatedAny = false;
                    keysToSync.forEach((key) => {
                        if (data.storage[key]) {
                            const localVal = localStorage.getItem(key);
                            const remoteVal = JSON.stringify(data.storage[key]);
                            if (localVal !== remoteVal) {
                                localStorage.setItem(key, remoteVal);
                                updatedAny = true;
                            }
                        }
                    });

                    // Si actualizamos datos en un localStorage vacío (como Incógnito),
                    // notificamos al Core de Stremio o recargamos la vista para que cargue la lista
                    if (updatedAny) {
                        try {
                            core.transport.dispatch({
                                action: 'Ctx',
                                args: { action: 'SyncLibraryWithAPI' }
                            });
                        } catch (e) {
                            // Fallback si el Core no responde de inmediato
                            window.location.reload();
                        }
                    }
                }
            })
            .catch((err) => console.error('Error al sincronizar desde Redis:', err));

        // Guardar cambios locales en Redis cuando el usuario agregue/quite elementos
        const handleSyncToRedis = () => {
            const payload = {};
            keysToSync.forEach((key) => {
                payload[key] = JSON.parse(localStorage.getItem(key) || 'null');
            });

            fetch('/api/library', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storage: payload }),
            }).catch((err) => console.error('Error al subir a Redis:', err));
        };

        window.addEventListener('storage', handleSyncToRedis);
        return () => window.removeEventListener('storage', handleSyncToRedis);
    }, [core.transport]);

    const onShortcut = React.useCallback((name, combo, key) => {
        switch (name) {
            case 'interfaceScale':
                changeInterfaceScale(['decrease', 'increase', 'reset'][combo]);
                break;
            case 'shortcuts':
                toggleShortcutModal();
                break;
            case 'gamepadGuide':
                toggleGamepadModal();
                break;
            case 'navigateSearch':
                navigate('/search');
                break;
            case 'navigateTabs': {
                const index = Number(key) - 1;
                if (index >= 0 && index < NAVIGATE_TABS_ROUTES.length)
                    navigate(NAVIGATE_TABS_ROUTES[index]);
                break;
            }
            case 'navigateHistory':
                if (combo === 0) {
                    goBack();
                } else {
                    navigate(1);
                }
                break;
        }
    }, [toggleShortcutModal, toggleGamepadModal, changeInterfaceScale, navigate, goBack]);

    React.useEffect(() => {
        const prevPath = previousPathRef.current;
        previousPathRef.current = locationPath;
        if (prevPath !== locationPath) {
            core.transport.analytics({
                event: 'LocationPathChanged',
                args: { prevPath }
            });
        }
    }, [locationPath, core.transport]);

    React.useEffect(() => {
        const onChromecastStateChange = () => {
            if (services.chromecast.active) {
                services.chromecast.transport.setOptions({
                    receiverApplicationId: CONSTANTS.CHROMECAST_RECEIVER_APP_ID,
                    autoJoinPolicy: chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
                    resumeSavedSession: false,
                    language: null,
                    androidReceiverCompatible: true
                });
            }
        };
        services.chromecast.on('stateChanged', onChromecastStateChange);
        services.chromecast.start();

        window.services = services;
        return () => {
            services.chromecast.stop();
            services.chromecast.off('stateChanged', onChromecastStateChange);
        };
    }, [services]);

    React.useEffect(() => {
        if (typeof profile.settings?.interfaceLanguage === 'string') {
            i18n.changeLanguage(profile.settings.interfaceLanguage);
        }

        if (typeof profile.settings?.gamepadSupport === 'boolean') {
            setGamepadSupportEnabled(profile.settings.gamepadSupport);
        }

        if (profile.settings?.quitOnClose && shell.state.windowClosed) {
            shell.send('quit');
        }
    }, [profile.settings, i18n, shell]);

    React.useEffect(() => {
        const onWindowFocus = () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'PullAddonsFromAPI'
                }
            });
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'PullUserFromAPI',
                    args: {}
                }
            });
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'SyncLibraryWithAPI'
                }
            });
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'PullNotifications'
                }
            });
        };

        onWindowFocus();
        window.addEventListener('focus', onWindowFocus);

        return () => {
            window.removeEventListener('focus', onWindowFocus);
        };
    }, [core.transport]);

    return (
        <ServicesProvider services={services}>
            <ToastProvider className={styles['toasts-container']}>
                <TooltipProvider className={styles['tooltip-container']}>
                    <GamepadProvider enabled={gamepadSupportEnabled} onGuide={toggleGamepadModal}>
                        <ShortcutsProvider onShortcut={onShortcut}>
                            <FullscreenProvider>
                                <DiscordProvider>
                                    {
                                        shortcutModalOpen && <ShortcutsModal onClose={closeShortcutsModal}/>
                                    }
                                    {
                                        gamepadModalOpen && <GamepadModal onClose={closeGamepadModal}/>
                                    }
                                    <ServicesToaster />
                                    <SearchParamsHandler />
                                    <DeepLinkHandler />
                                    <ShellOpenHandler />
                                    <UpdaterBanner className={styles['updater-banner-container']} />
                                    <ProtectedRoutes />
                                </DiscordProvider>
                            </FullscreenProvider>
                        </ShortcutsProvider>
                    </GamepadProvider>
                </TooltipProvider>
            </ToastProvider>
        </ServicesProvider>
    );
};

module.exports = withCoreSuspender(App);
