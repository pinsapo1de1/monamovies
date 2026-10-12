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

// --- CADENA OFICIAL RECIÉN GENERADA ---
const FRESH_PROFILE_RAW = '{\\"auth\\":{\\"key\\":\\"JTeNDoum09gcAbvKmIoyEMVlIzhI8TFNXeQMjGpAz1Q=\\",\\"user\\":{\\"_id\\":\\"6acd3540cd696551c7045c08\\",\\"email\\":\\"jaurelionoguerolh@gmail.com\\",\\"fbId\\":null,\\"appleId\\":null,\\"avatar\\":null,\\"lastModified\\":\\"2026-10-12T19:30:08.433Z\\",\\"dateRegistered\\":\\"2026-10-12T19:30:08.433Z\\",\\"trakt\\":null,\\"premium_expire\\":\\"0001-01-01T00:00:00Z\\",\\"premiumPrefs\\":null,\\"parent_id\\":null,\\"gdpr_consent\\":{\\"tos\\":true,\\"privacy\\":true,\\"marketing\\":false,\\"from\\":\\"web\\"}}},\\"addons\\":[{\\"manifest\\":{\\"id\\":\\"com.linvo.cinemeta\\",\\"version\\":\\"3.0.14\\",\\"name\\":\\"Cinemeta\\",\\"contactEmail\\":null,\\"description\\":\\"The official addon for movie and series catalogs\\",\\"logo\\":null,\\"background\\":null,\\"types\\":[\\"movie\\",\\"series\\"],\\"resources\\":[\\"catalog\\",\\"meta\\",\\"addon_catalog\\"],\\"idPrefixes\\":[\\"tt\\"],\\"catalogs\\":[{\\"id\\":\\"top\\",\\"type\\":\\"movie\\",\\"name\\":\\"Popular\\",\\"extra\\":[{\\"name\\":\\"genre\\",\\"isRequired\\":false,\\"options\\":[\\"Action\\",\\"Adventure\\",\\"Animation\\",\\"Biography\\",\\"Comedy\\",\\"Crime\\",\\"Documentary\\",\\"Drama\\",\\"Family\\",\\"Fantasy\\",\\"History\\",\\"Horror\\",\\"Mystery\\",\\"Romance\\",\\"Sci-Fi\\",\\"Sport\\",\\"Thriller\\",\\"War\\",\\"Western\\"],\\"optionsLimit\\":1},{\\"name\\":\\"search\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1},{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]},{\\"id\\":\\"top\\",\\"type\\":\\"series\\",\\"name\\":\\"Popular\\",\\"extra\\":[{\\"name\\":\\"genre\\",\\"isRequired\\":false,\\"options\\":[\\"Action\\",\\"Adventure\\",\\"Animation\\",\\"Biography\\",\\"Comedy\\",\\"Crime\\",\\"Documentary\\",\\"Drama\\",\\"Family\\",\\"Fantasy\\",\\"History\\",\\"Horror\\",\\"Mystery\\",\\"Romance\\",\\"Sci-Fi\\",\\"Sport\\",\\"Thriller\\",\\"War\\",\\"Western\\",\\"Reality-TV\\",\\"Talk-Show\\",\\"Game-Show\\"],\\"optionsLimit\\":1},{\\"name\\":\\"search\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1},{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]},{\\"id\\":\\"year\\",\\"type\\":\\"movie\\",\\"name\\":\\"New\\",\\"extra\\":[{\\"name\\":\\"genre\\",\\"isRequired\\":true,\\"options\\":[\\"2026\\",\\"2025\\",\\"2024\\",\\"2023\\",\\"2022\\",\\"2021\\",\\"2020\\",\\"2019\\",\\"2018\\",\\"2017\\",\\"2016\\",\\"2015\\",\\"2014\\",\\"2013\\",\\"2012\\",\\"2011\\",\\"2010\\",\\"2009\\",\\"2008\\",\\"2007\\",\\"2006\\",\\"2005\\",\\"2004\\",\\"2003\\",\\"2002\\",\\"2001\\",\\"2000\\",\\"1999\\",\\"1998\\",\\"1997\\",\\"1996\\",\\"1995\\",\\"1994\\",\\"1993\\",\\"1992\\",\\"1991\\",\\"1990\\",\\"1989\\",\\"1988\\",\\"1987\\",\\"1986\\",\\"1985\\",\\"1984\\",\\"1983\\",\\"1982\\",\\"1981\\",\\"1980\\",\\"1979\\",\\"1978\\",\\"1977\\",\\"1976\\",\\"1975\\",\\"1974\\",\\"1973\\",\\"1972\\",\\"1971\\",\\"1970\\",\\"1969\\",\\"1968\\",\\"1967\\",\\"1966\\",\\"1965\\",\\"1964\\",\\"1963\\",\\"1962\\",\\"1961\\",\\"1960\\",\\"1959\\",\\"1958\\",\\"1957\\",\\"1956\\",\\"1955\\",\\"1954\\",\\"1953\\",\\"1952\\",\\"1951\\",\\"1950\\",\\"1949\\",\\"1948\\",\\"1947\\",\\"1946\\",\\"1945\\",\\"1944\\",\\"1943\\",\\"1942\\",\\"1941\\",\\"1940\\",\\"1939\\",\\"1938\\",\\"1937\\",\\"1936\\",\\"1935\\",\\"1934\\",\\"1933\\",\\"1932\\",\\"1931\\",\\"1930\\",\\"1929\\",\\"1928\\",\\"1927\\",\\"1926\\",\\"1925\\",\\"1924\\",\\"1923\\",\\"1922\\",\\"1921\\",\\"1920\\"],\\"optionsLimit\\":1},{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]},{\\"id\\":\\"year\\",\\"type\\":\\"series\\",\\"name\\":\\"New\\",\\"extra\\":[{\\"name\\":\\"genre\\",\\"isRequired\\":true,\\"options\\":[\\"2026\\",\\"2025\\",\\"2024\\",\\"2023\\",\\"2022\\",\\"2021\\",\\"2020\\",\\"2019\\",\\"2018\\",\\"2017\\",\\"2016\\",\\"2015\\",\\"2014\\",\\"2013\\",\\"2012\\",\\"2011\\",\\"2010\\",\\"2009\\",\\"2008\\",\\"2007\\",\\"2006\\",\\"2005\\",\\"2004\\",\\"2003\\",\\"2002\\",\\"2001\\",\\"2000\\",\\"1999\\",\\"1998\\",\\"1997\\",\\"1996\\",\\"1995\\",\\"1994\\",\\"1993\\",\\"1992\\",\\"1991\\",\\"1990\\",\\"1989\\",\\"1988\\",\\"1987\\",\\"1986\\",\\"1985\\",\\"1984\\",\\"1983\\",\\"1982\\",\\"1981\\",\\"1980\\",\\"1979\\",\\"1978\\",\\"1977\\",\\"1976\\",\\"1975\\",\\"1974\\",\\"1973\\",\\"1972\\",\\"1971\\",\\"1970\\",\\"1969\\",\\"1968\\",\\"1967\\",\\"1966\\",\\"1965\\",\\"1964\\",\\"1963\\",\\"1962\\",\\"1961\\",\\"1960\\"],\\"optionsLimit\\":1},{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]},{\\"id\\":\\"imdbRating\\",\\"type\\":\\"movie\\",\\"name\\":\\"Featured\\",\\"extra\\":[{\\"name\\":\\"genre\\",\\"isRequired\\":false,\\"options\\":[\\"Action\\",\\"Adventure\\",\\"Animation\\",\\"Biography\\",\\"Comedy\\",\\"Crime\\",\\"Documentary\\",\\"Drama\\",\\"Family\\",\\"Fantasy\\",\\"History\\",\\"Horror\\",\\"Mystery\\",\\"Romance\\",\\"Sci-Fi\\",\\"Sport\\",\\"Thriller\\",\\"War\\",\\"Western\\"],\\"optionsLimit\\":1},{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]},{\\"id\\":\\"imdbRating\\",\\"type\\":\\"series\\",\\"name\\":\\"Featured\\",\\"extra\\":[{\\"name\\":\\"genre\\",\\"isRequired\\":false,\\"options\\":[\\"Action\\",\\"Adventure\\",\\"Animation\\",\\"Biography\\",\\"Comedy\\",\\"Crime\\",\\"Documentary\\",\\"Drama\\",\\"Family\\",\\"Fantasy\\",\\"History\\",\\"Horror\\",\\"Mystery\\",\\"Romance\\",\\"Sci-Fi\\",\\"Sport\\",\\"Thriller\\",\\"War\\",\\"Western\\",\\"Reality-TV\\",\\"Talk-Show\\",\\"Game-Show\\"],\\"optionsLimit\\":1},{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]},{\\"id\\":\\"last-videos\\",\\"type\\":\\"series\\",\\"name\\":\\"Last videos\\",\\"extra\\":[{\\"name\\":\\"lastVideosIds\\",\\"isRequired\\":true,\\"options\\":[],\\"optionsLimit\\":100}]},{\\"id\\":\\"calendar-videos\\",\\"type\\":\\"series\\",\\"name\\":\\"Calendar videos\\",\\"extra\\":[{\\"name\\":\\"calendarVideosIds\\",\\"isRequired\\":true,\\"options\\":[],\\"optionsLimit\\":100}]}],\\"addonCatalogs\\":[{\\"id\\":\\"official\\",\\"type\\":\\"all\\",\\"name\\":\\"Official\\",\\"extraRequired\\":[],\\"extraSupported\\":[]},{\\"id\\":\\"official\\",\\"type\\":\\"movie\\",\\"name\\":\\"Official\\",\\"extraRequired\\":[],\\"extraSupported\\":[]},{\\"id\\":\\"official\\",\\"type\\":\\"series\\",\\"name\\":\\"Official\\",\\"extraRequired\\":[],\\"extraSupported\\":[]},{\\"id\\":\\"official\\",\\"type\\":\\"channel\\",\\"name\\":\\"Official\\",\\"extraRequired\\":[],\\"extraSupported\\":[]},{\\"id\\":\\"community\\",\\"type\\":\\"all\\",\\"name\\":\\"Community\\",\\"extraRequired\\":[],\\"extraSupported\\":[]},{\\"id\\":\\"community\\",\\"type\\":\\"movie\\",\\"name\\":\\"Community\\",\\"extraRequired\\":[],\\"extraSupported\\":[]},{\\"id\\":\\"community\\",\\"type\\":\\"series\\",\\"name\\":\\"Community\\",\\"extraRequired\\":[],\\"extraSupported\\":[]},{\\"id\\":\\"community\\",\\"type\\":\\"channel\\",\\"name\\":\\"Community\\",\\"extraRequired\\":[],\\"extraSupported\\":[]},{\\"id\\":\\"community\\",\\"type\\":\\"tv\\",\\"name\\":\\"Community\\",\\"extraRequired\\":[],\\"extraSupported\\":[]},{\\"id\\":\\"community\\",\\"type\\":\\"Podcasts\\",\\"name\\":\\"Community\\",\\"extraRequired\\":[],\\"extraSupported\\":[]},{\\"id\\":\\"community\\",\\"type\\":\\"other\\",\\"name\\":\\"Community\\",\\"extraRequired\\":[],\\"extraSupported\\":[]}],\\"behaviorHints\\":{\\"adult\\":false,\\"p2p\\":false,\\"configurable\\":false,\\"configurationRequired\\":false,\\"epgProvider\\":false}},\\"transportUrl\\":\\"https://v3-cinemeta.strem.io/manifest.json\\",\\"flags\\":{\\"official\\":true,\\"protected\\":true}},{\\"manifest\\":{\\"id\\":\\"com.linvo.stremiochannels\\",\\"version\\":\\"1.30.7\\",\\"name\\":\\"YouTube\\",\\"contactEmail\\":null,\\"description\\":\\"Watch your favourite YouTube channels ad-free and get notified when they upload new videos.\\",\\"logo\\":null,\\"background\\":null,\\"types\\":[\\"channel\\"],\\"resources\\":[\\"catalog\\",\\"meta\\"],\\"idPrefixes\\":[\\"yt_id:\\"],\\"catalogs\\":[{\\"id\\":\\"top\\",\\"type\\":\\"channel\\",\\"name\\":null,\\"extra\\":[{\\"name\\":\\"search\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1},{\\"name\\":\\"genre\\",\\"isRequired\\":false,\\"options\\":[\\"Animation\\",\\"Automotive\\",\\"Beauty & Fashion\\",\\"Causes & Non-profits\\",\\"Comedy\\",\\"Cooking & Health\\",\\"Film & Entertainment\\",\\"From TV\\",\\"Gaming\\",\\"Lifestyle\\",\\"Music\\",\\"News & Politics\\",\\"Sports\\"],\\"optionsLimit\\":1},{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]},{\\"id\\":\\"videos\\",\\"type\\":\\"channel\\",\\"name\\":null,\\"extra\\":[{\\"name\\":\\"search\\",\\"isRequired\\":true,\\"options\\":[],\\"optionsLimit\\":1}]}],\\"addonCatalogs\\":[],\\"behaviorHints\\":{\\"adult\\":false,\\"p2p\\":false,\\"configurable\\":false,\\"configurationRequired\\":false,\\"epgProvider\\":false}},\\"transportUrl\\":\\"https://v3-channels.strem.io/manifest.json\\",\\"flags\\":{\\"official\\":true,\\"protected\\":false}},{\\"manifest\\":{\\"id\\":\\"org.stremio.watchhub\\",\\"version\\":\\"1.15.0\\",\\"name\\":\\"WatchHub\\",\\"contactEmail\\":null,\\"description\\":\\"Find where to stream your favorite movies and shows amongst Netflix, iTunes, Hulu, Amazon, HBO GO and many others. Supports many countries.\\",\\"logo\\":\\"https://www.strem.io/images/watchhub-logo.png\\",\\"background\\":null,\\"types\\":[\\"movie\\",\\"series\\"],\\"resources\\":[\\"stream\\"],\\"idPrefixes\\":[\\"tt\\"],\\"catalogs\\":[],\\"addonCatalogs\\":[],\\"behaviorHints\\":{\\"adult\\":false,\\"p2p\\":false,\\"configurable\\":false,\\"configurationRequired\\":false,\\"epgProvider\\":false}},\\"transportUrl\\":\\"https://watchhub.strem.io/manifest.json\\",\\"flags\\":{\\"official\\":true,\\"protected\\":false}},{\\"manifest\\":{\\"id\\":\\"org.stremio.pubdomainmovies\\",\\"version\\":\\"1.0.0\\",\\"name\\":\\"Public Domain Movies\\",\\"contactEmail\\":null,\\"description\\":\\"Torrents for public domain movies. Includes a collection of more then 500 public domain movies.\\",\\"logo\\":\\"https://johnserv531.github.io/gh-images/1586344884.jpg\\",\\"background\\":null,\\"types\\":[\\"movie\\"],\\"resources\\":[\\"catalog\\",\\"stream\\"],\\"idPrefixes\\":[\\"tt\\"],\\"catalogs\\":[{\\"id\\":\\"publicdomainmovies\\",\\"type\\":\\"movie\\",\\"name\\":null,\\"extra\\":[{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1},{\\"name\\":\\"search\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]}],\\"addonCatalogs\\":[],\\"behaviorHints\\":{\\"adult\\":false,\\"p2p\\":false,\\"configurable\\":false,\\"configurationRequired\\":false,\\"epgProvider\\":false}},\\"transportUrl\\":\\"https://caching.stremio.net/publicdomainmovies.now.sh/manifest.json\\",\\"flags\\":{\\"official\\":true,\\"protected\\":false}},{\\"manifest\\":{\\"id\\":\\"org.stremio.opensubtitlesv3\\",\\"version\\":\\"1.0.0\\",\\"name\\":\\"OpenSubtitles v3\\",\\"contactEmail\\":null,\\"description\\":\\"OpenSubtitles v3 Addon for Stremio\\",\\"logo\\":\\"http://www.strem.io/images/addons/opensubtitles-logo.png\\",\\"background\\":null,\\"types\\":[\\"movie\\",\\"series\\"],\\"resources\\":[\\"subtitles\\"],\\"idPrefixes\\":[\\"tt\\"],\\"catalogs\\":[],\\"addonCatalogs\\":[],\\"behaviorHints\\":{\\"adult\\":false,\\"p2p\\":false,\\"configurable\\":false,\\"configurationRequired\\":false,\\"epgProvider\\":false}},\\"transportUrl\\":\\"https://opensubtitles-v3.strem.io/manifest.json\\",\\"flags\\":{\\"official\\":true,\\"protected\\":false}},{\\"manifest\\":{\\"id\\":\\"org.stremio.opensubtitles\\",\\"version\\":\\"0.24.0\\",\\"name\\":\\"OpenSubtitles\\",\\"contactEmail\\":null,\\"description\\":\\"The official add-on for subtitles from OpenSubtitles\\",\\"logo\\":\\"http://www.strem.io/images/addons/opensubtitles-logo.png\\",\\"background\\":null,\\"types\\":[\\"series\\",\\"movie\\",\\"other\\"],\\"resources\\":[\\"subtitles\\"],\\"idPrefixes\\":null,\\"catalogs\\":[],\\"addonCatalogs\\":[],\\"behaviorHints\\":{\\"adult\\":false,\\"p2p\\":false,\\"configurable\\":false,\\"configurationRequired\\":false,\\"epgProvider\\":false}},\\"transportUrl\\":\\"https://opensubtitles.strem.io/stremio/v1\\",\\"flags\\":{\\"official\\":true,\\"protected\\":false}},{\\"manifest\\":{\\"id\\":\\"org.stremio.local\\",\\"version\\":\\"1.10.0\\",\\"name\\":\\"Local Files (without catalog support)\\",\\"contactEmail\\":null,\\"description\\":\\"Local add-on to find playable files: .torrent, .mp4, .mkv and .avi\\",\\"logo\\":null,\\"background\\":null,\\"types\\":[\\"movie\\",\\"series\\",\\"other\\"],\\"resources\\":[{\\"name\\":\\"meta\\",\\"types\\":[\\"other\\"],\\"idPrefixes\\":[\\"local:\\",\\"bt:\\"]},{\\"name\\":\\"stream\\",\\"types\\":[\\"movie\\",\\"series\\"],\\"idPrefixes\\":[\\"tt\\"]}],\\"idPrefixes\\":null,\\"catalogs\\":[],\\"addonCatalogs\\":[],\\"behaviorHints\\":{\\"adult\\":false,\\"p2p\\":false,\\"configurable\\":false,\\"configurationRequired\\":false,\\"epgProvider\\":false}},\\"transportUrl\\":\\"http://127.0.0.1:11470/local-addon/manifest.json\\",\\"flags\\":{\\"official\\":true,\\"protected\\":true}},{\\"manifest\\":{\\"id\\":\\"com.stremio.torrentio.addon\\",\\"version\\":\\"0.0.15\\",\\"name\\":\\"Torrentio TB\\",\\"contactEmail\\":null,\\"description\\":\\"Provides torrent streams from scraped torrent providers. Currently supports YTS(+), EZTV(+), RARBG(+), 1337x(+), EXT(+), ThePirateBay(+), KickassTorrents(+), TorrentGalaxy(+), MagnetDL(+), HorribleSubs(+), NyaaSi(+), TokyoTosho(+), AniDex(+), nekoBT(+), Rutor(+), Rutracker(+), Comando(+), BluDV(+), MicoLeaoDublado(+), Torrent9(+), ilCorSaRoNeRo(+), MejorTorrent(+), Wolfmax4k(+), Cinecalidad(+), BestTorrents(+) and TorBox enabled. To configure providers, RealDebrid/Premiumize/AllDebrid/DebridLink/EasyDebrid/Offcloud/TorBox/Put.io/HighWay support and other settings visit https://torrentio.strem.fun\\",\\"logo\\":\\"https://torrentio.strem.fun/images/logo_v1.png\\",\\"background\\":\\"https://torrentio.strem.fun/images/background_v1.jpg\\",\\"types\\":[\\"movie\\",\\"series\\",\\"anime\\",\\"other\\"],\\"resources\\":[{\\"name\\":\\"stream\\",\\"types\\":[\\"movie\\",\\"series\\",\\"anime\\"],\\"idPrefixes\\":[\\"tt\\",\\"kitsu\\"]},{\\"name\\":\\"meta\\",\\"types\\":[\\"other\\"],\\"idPrefixes\\":[\\"torbox\\"]}],\\"idPrefixes\\":null,\\"catalogs\\":[{\\"id\\":\\"torrentio-torbox-torrents\\",\\"type\\":\\"other\\",\\"name\\":\\"TorBox Torrents\\",\\"extra\\":[{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]},{\\"id\\":\\"torrentio-torbox-usenet\\",\\"type\\":\\"other\\",\\"name\\":\\"TorBox Usenet\\",\\"extra\\":[{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]},{\\"id\\":\\"torrentio-torbox-webdl\\",\\"type\\":\\"other\\",\\"name\\":\\"TorBox WebDL\\",\\"extra\\":[{\\"name\\":\\"skip\\",\\"isRequired\\":false,\\"options\\":[],\\"optionsLimit\\":1}]}],\\"addonCatalogs\\":[],\\"behaviorHints\\":{\\"adult\\":false,\\"p2p\\":false,\\"configurable\\":true,\\"configurationRequired\\":false,\\"epgProvider\\":false}},\\"transportUrl\\":\\"https://torrentio.strem.fun/qualityfilter=threed,4k,cam,unknown,scr,brremux,hdrall,dolbyvision,dolbyvisionwithhdr,other%7Csizefilter=5GB%7Ctorbox=79245a5f-b344-48a8-b0a0-f1f0f8c523bf/manifest.json\\",\\"flags\\":{\\"official\\":false,\\"protected\\":false}}],\\"addonsLocked\\":false,\\"settings\\":{\\"interfaceLanguage\\":\\"eng\\",\\"interfaceScale\\":100,\\"interfaceTheme\\":null,\\"hideSpoilers\\":false,\\"gamepadSupport\\":false,\\"streamingServerUrl\\":\\"http://127.0.0.1:11470/\\",\\"playerType\\":null,\\"bingeWatching\\":true,\\"playInBackground\\":true,\\"hardwareDecoding\\":true,\\"gpuVideoProcessing\\":false,\\"videoMode\\":null,\\"frameRateMatchingStrategy\\":\\"Disabled\\",\\"nextVideoNotificationDuration\\":35000,\\"audioPassthrough\\":false,\\"audioLanguage\\":\\"eng\\",\\"secondaryAudioLanguage\\":null,\\"subtitlesLanguage\\":\\"eng\\",\\"secondarySubtitlesLanguage\\":null,\\"subtitlesAutoSelect\\":true,\\"subtitlesSize\\":100,\\"subtitlesFont\\":\\"Roboto\\",\\"subtitlesBold\\":false,\\"subtitlesOffset\\":5,\\"subtitlesTextColor\\":\\"#FFFFFFFF\\",\\"subtitlesBackgroundColor\\":\\"#00000000\\",\\"subtitlesOutlineColor\\":\\"#000000\\",\\"subtitlesOpacity\\":100,\\"assSubtitlesStyling\\":false,\\"escExitFullscreen\\":true,\\"seekTimeDuration\\":10000,\\"seekShortTimeDuration\\":3000,\\"pauseOnMinimize\\":false,\\"quitOnClose\\":true,\\"surroundSound\\":false,\\"streamingServerWarningDismissed\\":null,\\"serverInForeground\\":false,\\"sendCrashReports\\":true,\\"supportersWelcomeDismissed\\":null,\\"appearance\\":{\\"navigationStyle\\":\\"standard\\",\\"continueWatchingStyle\\":\\"standard\\"},\\"discordRpcEnabled\\":false,\\"profileLockTimeout\\":0,\\"profileLockLastActivity\\":\\"2026-10-12T19:59:04.252Z\\"}}';

// --- INYECCIÓN SÍNCRONA COMPLETA ---
(() => {
    try {
        const rawProfile = localStorage.getItem('profile');
        let profileData = {};
        if (rawProfile) {
            try { profileData = JSON.parse(rawProfile); } catch(e) {}
        }

        // Si la sesión no existe o si la authKey es distinta a la activa recién generada
        if (!profileData || !profileData.auth || !profileData.auth.key || profileData.auth.key !== "JTeNDoum09gcAbvKmIoyEMVlIzhI8TFNXeQMjGpAz1Q=") {
            let parsedObj = JSON.parse(FRESH_PROFILE_RAW);
            if (typeof parsedObj === 'string') {
                parsedObj = JSON.parse(parsedObj);
            }
            
            // Asegurar gdpr_consent en la raíz para compatibilidad con WASM/Rust
            parsedObj.gdpr_consent = parsedObj.gdpr_consent || {
                tos: true,
                privacy: true,
                marketing: false,
                from: "web"
            };

            localStorage.setItem('profile', JSON.stringify(parsedObj));
        }
    } catch (e) {
        console.error('Error inyectando el perfil inicial:', e);
    }
})();

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
