const g: any = global;
const s: any = self;
const { assets, buildId, staticFiles } = g.serviceWorkerOption;

g.CACHE_PREFIX = "mynameisviii.com";
g.cacheNames = {
  api: `${g.CACHE_PREFIX}-api`,
  cdn: `${g.CACHE_PREFIX}-cdn`,
  googleApis: `${g.CACHE_PREFIX}-googleApis`,
  local: `${g.CACHE_PREFIX}-local-${buildId}`,
  precache: `${g.CACHE_PREFIX}-precache-${buildId}`
};

g.precacheUrls = [
  ...assets,
  ...staticFiles
];

const isCacheValid = (key: string) => Object.values(g.cacheNames).includes(key);

g.importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js"
);

g.workbox.core.setCacheNameDetails({
  prefix: g.CACHE_PREFIX,
  suffix: buildId
});

g.workbox.skipWaiting();
g.workbox.clientsClaim();

if (buildId !== "development") {
  g.workbox.precaching.precacheAndRoute(
    g.precacheUrls.map((item: string) => ({
      revision: buildId,
      url: item
    })),
    {
      cleanUrls: false
    }
  );

  // Local cache-first requests
  g.workbox.routing.registerRoute(
    ({ url }: any) =>
      url.host === self.location.host && !g.precacheUrls.includes(url.pathname),
    g.workbox.strategies.cacheFirst({
      cacheName: g.cacheNames.local,
      plugins: [
        new g.workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new g.workbox.expiration.Plugin({
          maxAgeSeconds: 2 * 60 * 60
        })
      ]
    })
  );
}

g.workbox.googleAnalytics.initialize({
  cacheName: g.cacheNames.googleApis
});

// Static content requests from Google APIs
g.workbox.routing.registerRoute(
  new RegExp("https://(?:fonts).(?:googleapis|gstatic).com/(.*)"),
  g.workbox.strategies.cacheFirst({
    cacheName: g.cacheNames.googleApis,
    plugins: [
      new g.workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Dynamic content requests from Google APIs
g.workbox.routing.registerRoute(
  new RegExp("https://(?:maps).(?:googleapis|gstatic).com/(.*)"),
  g.workbox.strategies.networkOnly({
    cacheName: g.cacheNames.googleApis,
    plugins: [
      new g.workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

// App CDN requests
g.workbox.routing.registerRoute(
  new RegExp("https://s3.amazonaws.com/mynameisviii-static/(.*)"),
  g.workbox.strategies.cacheFirst({
    cacheName: g.cacheNames.cdn,
    plugins: [
      new g.workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

// App API requests
// Listings - cache for 2 hours
g.workbox.routing.registerRoute(
  new RegExp("https://api.mynameisviii.com/(.*)/find(.*)"),
  g.workbox.strategies.cacheFirst({
    cacheName: g.cacheNames.api,
    plugins: [
      new g.workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new g.workbox.expiration.Plugin({
        maxAgeSeconds: 2 * 60 * 60
      })
    ]
  })
);
// Entities - cache for a week
g.workbox.routing.registerRoute(
  new RegExp("https://api.mynameisviii.com/(.*)/[^find](.*)"),
  g.workbox.strategies.cacheFirst({
    cacheName: g.cacheNames.api,
    plugins: [
      new g.workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new g.workbox.expiration.Plugin({
        maxAgeSeconds: 7 * 24 * 60 * 60
      })
    ]
  })
);

self.addEventListener("activate", async (event: any) => {
  // Cleanup redundant caches
  event.waitUntil(
    caches.keys().then(async keys => {
      let hasDeletedCaches = false;
      keys.forEach(key => {
        if (!isCacheValid(key)) {
          caches.delete(key);
          indexedDB.deleteDatabase(key);
          hasDeletedCaches = true;
        }
      });

      // Notify client that a new version is available, when an old version exists
      if (hasDeletedCaches) {
        const clients = await s.clients.matchAll();
        clients.forEach((client: any) => {
          client.postMessage({
            type: "serviceWorker.activate"
          });
        });
      }
    })
  );
});

// Handle postMessage requests from the application
self.onmessage = message => {
  switch (message.data.type) {
    case "changeRoute":
      return caches
        .open(g.cacheNames.local)
        .then(cache => cache.add(message.data.payload));
  }
};
