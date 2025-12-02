
const CACHE_NAME = 'nul-flow-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/services/geminiService.ts',
  '/i18n/index.tsx',
  '/i18n/locales/en.ts',
  '/i18n/locales/nl.ts',
  '/i18n/locales/fr.ts',
  '/i18n/locales/de.ts',
  '/i18n/locales/da.ts',
  '/i18n/locales/es.ts',
  '/i18n/locales/ko.ts',
  '/i18n/locales/zh.ts',
  '/i18n/locales/pt.ts',
  '/components/icons.tsx',
  '/components/EditContactModal.tsx',
  '/components/pages/HomePage.tsx',
  '/components/pages/InboxPage.tsx',
  '/components/pages/HistoryPage.tsx',
  '/components/pages/ContactsPage.tsx',
  '/components/pages/SettingsPage.tsx',
  '/components/pages/DataExportPage.tsx',
  '/components/pages/RequestFlowPage.tsx',
  '/components/flow/NulFlowWizard.tsx',
  '/components/flow/SetLevelsStep.tsx',
  '/components/flow/AddDetailsStep.tsx',
  '/components/flow/ShareSaveStep.tsx'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
