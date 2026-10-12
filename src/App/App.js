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

const FRESH_PROFILE_RAW = '{\\"auth\\":{\\"key\\":\\"JTeNDoum09gcAbvKmIoyEMVlIzhI8TFNXeQMjGpAz1Q=\\",\\"user\\":{\\"_id\\":\\"6acd3540cd696551c7045c08\\",\\"email\\":\\"jaurelionoguerolh@gmail.com\\",\\"fbId\\":null,\\"appleId\\":null,\\"avatar\\":null,\\"lastModified\\":\\"2026-10-12T19:30:08.433Z\\",\\"dateRegistered\\":\\"2026-10-12T19:30:08.433Z\\",\\"trakt\\":null,\\"premium_expire\\":\\"0001-01-01T00:00:00Z\\",\\"premiumPrefs\\":null,\\"parent_id\\":null,\\"gdpr_consent\\":{\\"tos\\":true,\\"privacy\\":true,\\"marketing\\":false,\\"from\\":\\"web\\"}}},\\"addons\\":[{\\"manifest\\":{\\"id\\":\\"com.linvo.cinemeta\\",\\"version\\":\\"3.0.14\\",\\"name\\":\\"Cinemeta\\",\\"contactEmail\\":null,\\"description\\":\\"The official addon for movie and series catalogs\\",\\"logo\\":null,\\"background\\":null,\\"types\\":[\\"movie\\",\\"series\\"],\\"resources\\":[\\"catalog\\",\\"meta\\",\\"addon_catalog\\"],\\"idPrefixes\\":[\\"tt\\"],\\"catalogs\\":[{\\"id\\":\\"top\\",\\"type\\":\\"movie\\",\\"name\\":\\"Popular\\",\\"extra\\":[{\\"name\\":\\"genre\\",\\"isRequired\\":false,\\"options\\":[\\"Action\\",\\"Adventure\\",\\"Animation\\",\\"Biography\\",\\"Comedy\\",\\"Crime\\",\\"Documentary\\",\\"Drama\\",\\"Family\\",\\"Fantasy\\",\\"History\\",\\"Horror\\",\\"Mystery\\",\\"Romance\\",\\"Sci-Fi\\",\\"Sport\\",\\"Thriller\\",\\"War\\",\\"Western\\"],\\"optionsLimit\\":1},{\\"name\\":\\"search\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1},{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]},{\\"id\\":\\"top\\",\\"type\\":\\"series\\",\\"name\\":\\"Popular\\",\\"extra\\":[{\\"name\\":\\"genre\\",\\"isRequired\\":false,\\"options\\":[\\"Action\\",\\"Adventure\\",\\"Animation\\",\\"Biography\\",\\"Comedy\\",\\"Crime\\",\\"Documentary\\",\\"Drama\\",\\"Family\\",\\"Fantasy\\",\\"History\\",\\"Horror\\",\\"Mystery\\",\\"Romance\\",\\"Sci-Fi\\",\\"Sport\\",\\"Thriller\\",\\"War\\",\\"Western\\",\\"Reality-TV\\",\\"Talk-Show\\",\\"Game-Show\\"],\\"optionsLimit\\":1},{\\"name\\":\\"search\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1},{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]}],\\"addonCatalogs\\":[],\\"behaviorHints\\":{\\"adult\\":false,\\"p2p\\":false,\\"configurable\\":false,\\"configurationRequired\\":false,\\"epgProvider\\":false}},\\"transportUrl\\":\\"https://v3-cinemeta.strem.io/manifest.json\\",\\"flags\\":{\\"official\\":true,\\"protected\\":true}},{\\"manifest\\":{\\"id\\":\\"com.stremio.torrentio.addon\\",\\"version\\":\\"0.0.15\\",\\"name\\":\\"Torrentio TB\\",\\"contactEmail\\":null,\\"description\\":\\"Provides torrent streams\\",\\"types\\":[\\"movie\\",\\"series\\",\\"anime\\",\\"other\\"],\\"resources\\":[{\\"name\\":\\"stream\\",\\"types\\":[\\"movie\\",\\"series\\",\\"anime\\"],\\"idPrefixes\\":[\\"tt\\",\\"kitsu\\"]}],\\"catalogs\\":[],\\"addonCatalogs\\":[],\\"behaviorHints\\":{\\"adult\\":false,\\"p2p\\":false,\\"configurable\\":true,\\"configurationRequired\\":false,\\"epgProvider\\":false}},\\"transportUrl\\":\\"https://torrentio.strem.fun/qualityfilter=threed,4k,cam,unknown,scr,brremux,hdrall,dolbyvision,dolbyvisionwithhdr,other%7Csizefilter=5GB%7Ctorbox=79245a5f-b344-48a8-b0a0-f1f0f8c523bf/manifest.json\\",\\"flags\\":{\\"official\\":false,\\"protected\\":false}}],\\"addonsLocked\\":false,\\"settings\\":{\\"interfaceLanguage\\":\\"eng\\",\\"interfaceScale\\":100,\\"interfaceTheme\\":null,\\"hideSpoilers\\":false,\\"gamepadSupport\\":false,\\"streamingServerUrl\\":\\"http://127.0.0.1:11470/\\",\\"playerType\\":null,\\"bingeWatching\\":true,\\"playInBackground\\":true,\\"hardwareDecoding\\":true,\\"gpuVideoProcessing\\":false,\\"videoMode\\":null,\\"frameRateMatchingStrategy\\":\\"Disabled\\",\\"nextVideoNotificationDuration\\":35000,\\"audioPassthrough\\":false,\\"audioLanguage\\":\\"eng\\",\\"secondaryAudioLanguage\\":null,\\"subtitlesLanguage\\":\\"eng\\",\\"secondarySubtitlesLanguage\\":null,\\"subtitlesAutoSelect\\":true,\\"subtitlesSize\\":100,\\"subtitlesFont\\":\\"Roboto\\",\\"subtitlesBold\\":false,\\"subtitlesOffset\\":5,\\"subtitlesTextColor\\":\\"#FFFFFFFF\\",\\"subtitlesBackgroundColor\\":\\"#00000000\\",\\"subtitlesOutlineColor\\":\\"#000000\\",\\"subtitlesOpacity\\":100,\\"assSubtitlesStyling\\":false,\\"escExitFullscreen\\":true,\\"seekTimeDuration\\":10000,\\"seekShortTimeDuration\\":3000,\\"pauseOnMinimize\\":false,\\"quitOnClose\\":true,\\"surroundSound\\":false,\\"streamingServerWarningDismissed\\":null,\\"serverInForeground\\":false,\\"sendCrashReports\\":true,\\"supportersWelcomeDismissed\\":null,\\"appearance\\":{\\"navigationStyle\\":\\"standard\\",\\"continueWatchingStyle\\":\\"standard\\"},\\"discordRpcEnabled\\":false,\\"profileLockTimeout\\":0,\\"profileLockLastActivity\\":\\"2026-10-12T19:59:04.252Z\\"}}';

// Función para garantizar que la clave existe en localStorage
const ensureProfileInStorage = () => {
    try {
        let parsedObj = JSON.parse(FRESH_PROFILE_RAW);
        if (typeof parsedObj === 'string') {
            parsedObj = JSON.parse(parsedObj);
        }
        parsedObj.gdpr_consent = parsedObj.gdpr_consent || { tos: true, privacy: true, marketing: false, from: "web" };
        localStorage.setItem('profile', JSON.stringify(parsedObj));
        return parsedObj;
    } catch (e) {
        return null;
    }
};

// Inyección previa
ensureProfileInStorage();

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

    // FORZAR AUTENTICACIÓN AL MONTAR EL COMPONENTE
    React.useEffect(() => {
        if (!profile.auth || !profile.auth.key) {
            const injectedObj = ensureProfileInStorage();
            if (injectedObj && core.transport) {
                // Notificar al Core de Rust que lea el nuevo perfil
                core.transport.dispatch({
                    action: 'Ctx',
                    args: {
                        action: 'Authenticate',
                        args: {
                            authKey: injectedObj.auth.key
                        }
                    }
                });
                window.location.reload();
            }
        }
    }, [profile.auth, core.transport]);

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
