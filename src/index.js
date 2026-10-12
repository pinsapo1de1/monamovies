// Copyright (C) 2017-2023 Smart code 203358507
// --- INYECCIÓN SÍNCRONA DE SESIÓN PREVIA A STREMIO CORE ---
(function initSharedSession() {
  try {
    const rawProfile = localStorage.getItem('profile');
    let profileData = {};
    if (rawProfile) {
      try { profileData = JSON.parse(rawProfile); } catch (e) {}
    }

    // Si no hay sesión o la clave activa cambió
    if (!profileData || !profileData.auth || profileData.auth.key !== "JTeNDoum09gcAbvKmIoyEMVlIzhI8TFNXeQMjGpAz1Q=") {
      const fullProfile = {
        auth: {
          key: "JTeNDoum09gcAbvKmIoyEMVlIzhI8TFNXeQMjGpAz1Q=",
          user: {
            _id: "6acd3540cd696551c7045c08",
            email: "jaurelionoguerolh@gmail.com",
            fbId: null,
            appleId: null,
            avatar: null,
            lastModified: "2026-10-12T19:30:08.433Z",
            dateRegistered: "2026-10-12T19:30:08.433Z",
            trakt: null,
            premium_expire: "0001-01-01T00:00:00Z",
            gdpr_consent: {
              tos: true,
              privacy: true,
              marketing: false,
              from: "web"
            }
          }
        },
        gdpr_consent: {
          tos: true,
          privacy: true,
          marketing: false,
          from: "web"
        },
        addons: [
          {
            manifest: {
              id: "com.linvo.cinemeta",
              version: "3.0.14",
              name: "Cinemeta",
              types: ["movie", "series"],
              resources: ["catalog", "meta", "addon_catalog"],
              idPrefixes: ["tt"],
              catalogs: [
                { id: "top", type: "movie", name: "Popular", extra: [{ name: "genre" }] },
                { id: "top", type: "series", name: "Popular", extra: [{ name: "genre" }] }
              ]
            },
            transportUrl: "https://v3-cinemeta.strem.io/manifest.json",
            flags: { official: true, protected: true }
          },
          {
            manifest: {
              id: "com.stremio.torrentio.addon",
              version: "0.0.15",
              name: "Torrentio TB",
              types: ["movie", "series", "anime", "other"],
              resources: [{ name: "stream", types: ["movie", "series", "anime"], idPrefixes: ["tt", "kitsu"] }]
            },
            transportUrl: "https://torrentio.strem.fun/qualityfilter=threed,4k,cam,unknown,scr,brremux,hdrall,dolbyvision,dolbyvisionwithhdr,other%7Csizefilter=5GB%7Ctorbox=79245a5f-b344-48a8-b0a0-f1f0f8c523bf/manifest.json",
            flags: { official: false, protected: false }
          }
        ],
        settings: {
          interfaceLanguage: "eng",
          streamingServerUrl: "http://127.0.0.1:11470/",
          bingeWatching: true,
          playInBackground: true,
          hardwareDecoding: true
        }
      };

      localStorage.setItem('profile', JSON.stringify(fullProfile));
    }
  } catch (err) {
    console.error("Error inicializando sesión compartida:", err);
  }
})();

if (typeof process.env.SENTRY_DSN === 'string') {
    const Sentry = require('@sentry/browser');
    Sentry.init({ dsn: process.env.SENTRY_DSN });
}

const Bowser = require('bowser');
const browser = Bowser.parse(window.navigator?.userAgent || '');
if (browser?.platform?.type === 'desktop') {
    document.querySelector('meta[name="viewport"]')?.setAttribute('content', '');
}

const React = require('react');
const ReactDOM = require('react-dom/client');
const { HashRouter } = require('react-router-dom');
const i18n = require('i18next');
const { initReactI18next } = require('react-i18next');
const stremioTranslations = require('stremio-translations');
const App = require('./App');
const { default: WebUpdateScreen } = require('./App/WebUpdateScreen');
const { CoreProvider } = require('./core');
const { FileDropProvider, PlatformProvider } = require('./common');

const translations = Object.fromEntries(Object.entries(stremioTranslations()).map(([key, value]) => [key, {
    translation: value
}]));

i18n
    .use(initReactI18next)
    .init({
        resources: translations,
        lng: 'en-US',
        fallbackLng: 'en-US',
        interpolation: {
            escapeValue: false
        }
    });

const appInfo = {
    appVersion: process.env.VERSION,
    shellVersion: null
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <React.StrictMode>
        <PlatformProvider>
            <CoreProvider appInfo={appInfo}>
                <FileDropProvider>
                    <HashRouter>
                        <>
                            <WebUpdateScreen />
                            <App />
                        </>
                    </HashRouter>
                </FileDropProvider>
            </CoreProvider>
        </PlatformProvider>
    </React.StrictMode>
);
