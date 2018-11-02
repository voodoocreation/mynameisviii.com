import createServiceWorkerEnv from "service-worker-mock";

const g: any = global;
const s: any = self;

const createWorkboxMock = () => ({
  cacheableResponse: {
    Plugin: jest.fn()
  },
  clientsClaim: jest.fn(),
  core: {
    setCacheNameDetails: jest.fn()
  },
  expiration: {
    Plugin: jest.fn()
  },
  googleAnalytics: {
    initialize: jest.fn()
  },
  precaching: {
    precacheAndRoute: jest.fn()
  },
  routing: {
    registerRoute: jest.fn()
  },
  skipWaiting: jest.fn(),
  strategies: {
    cacheFirst: jest.fn(() => "cacheFirst"),
    networkFirst: jest.fn(() => "networkFirst"),
    networkOnly: jest.fn(() => "networkOnly")
  }
});

describe("[service] App service worker", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    g.importScripts = jest.fn();
    g.workbox = createWorkboxMock();
    g.serviceWorkerOption = {
      assets: ["/assets/file.jpg"],
      buildId: "production",
      staticFiles: ["/static/file.js"]
    };
    g.indexedDB = {
      deleteDatabase: jest.fn()
    };
    g.fetch = () => Promise.resolve("success");

    Object.assign(global, createServiceWorkerEnv());
    jest.resetModules();

    require("./appService");
  });

  describe("setup in development", () => {
    beforeEach(() => {
      jest.resetAllMocks();

      g.workbox = createWorkboxMock();
      g.serviceWorkerOption = {
        assets: ["/assets/file.jpg"],
        buildId: "development",
        staticFiles: ["/static/file.js"]
      };

      Object.assign(global, createServiceWorkerEnv());
      jest.resetModules();

      require("./appService");
    });

    it("doesn't set up precaching", () => {
      expect(g.workbox.routing.registerRoute.mock.calls[5]).toBeUndefined();
    });

    it("doesn't set up local cache-first handler", () => {
      expect(g.workbox.precaching.precacheAndRoute).not.toHaveBeenCalled();
    });
  });

  describe("setup in production", () => {
    it("imports workbox correctly", () => {
      expect(g.importScripts).toHaveBeenCalledWith(
        "https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js"
      );
    });

    it("claims the client instantly", () => {
      expect(g.workbox.clientsClaim).toHaveBeenCalled();
      expect(g.workbox.skipWaiting).toHaveBeenCalled();
    });

    it("defines cache name details correctly", () => {
      expect(g.workbox.core.setCacheNameDetails).toHaveBeenCalledWith({
        prefix: "mynameisviii.com",
        suffix: "production"
      });
    });

    it("sets up precaching correctly", () => {
      expect(g.workbox.precaching.precacheAndRoute).toHaveBeenCalledWith(
        g.precacheUrls.map((item: string) => ({
          revision: g.serviceWorkerOption.buildId,
          url: item
        })),
        { cleanUrls: false }
      );
    });

    it("sets up local cache-first handler correctly", () => {
      const mockCall = g.workbox.routing.registerRoute.mock.calls[0];

      expect(
        mockCall[0]({ url: { host: "localhost", pathname: "/test" } })
      ).toBe(true);
      expect(mockCall[1]).toBe("cacheFirst");
    });

    it("initialises Google Analytics handler correctly", () => {
      expect(g.workbox.googleAnalytics.initialize).toHaveBeenCalledWith({
        cacheName: "mynameisviii.com-googleApis"
      });
    });

    it("sets up Google API static content handler correctly", () => {
      const mockCall = g.workbox.routing.registerRoute.mock.calls[1];

      expect(mockCall[0].test("https://fonts.googleapis.com/test")).toBe(true);
      expect(mockCall[1]).toBe("cacheFirst");
    });

    it("sets up Google API dynamic content handler correctly", () => {
      const mockCall = g.workbox.routing.registerRoute.mock.calls[2];

      expect(mockCall[0].test("https://maps.googleapis.com/test")).toBe(true);
      expect(mockCall[1]).toBe("networkOnly");
    });

    it("sets up app CDN handler correctly", () => {
      const mockCall = g.workbox.routing.registerRoute.mock.calls[3];

      expect(
        mockCall[0].test("https://s3.amazonaws.com/mynameisviii-static/test")
      ).toBe(true);
      expect(mockCall[1]).toBe("cacheFirst");
    });

    it("sets up app API handler for listings correctly", () => {
      const mockCall = g.workbox.routing.registerRoute.mock.calls[4];

      expect(mockCall[0].test("https://api.mynameisviii.com/test/find")).toBe(
        true
      );
      expect(mockCall[1]).toBe("cacheFirst");
    });

    it("sets up app API handler for entities correctly", () => {
      const mockCall = g.workbox.routing.registerRoute.mock.calls[5];

      expect(mockCall[0].test("https://api.mynameisviii.com/test/slug-1")).toBe(
        true
      );
      expect(mockCall[1]).toBe("cacheFirst");
    });
  });

  describe("cache cleanup", () => {
    it("deletes redundant caches whilst leaving valid caches during activate phase", async () => {
      const staleCaches = [
        "mynameisviii.com-precache-stale",
        "mynameisviii.com-local-stale"
      ];
      const validCaches: string[] = Object.values(g.cacheNames);

      for (const cache of [...staleCaches, ...validCaches]) {
        await s.caches.open(cache);
        expect(s.snapshot().caches[cache]).toBeDefined();
      }

      await s.trigger("activate");

      for (const cache of staleCaches) {
        expect(s.snapshot().caches[cache]).toBeUndefined();
      }

      for (const cache of validCaches) {
        expect(s.snapshot().caches[cache]).toBeDefined();
      }
    });
  });

  describe("sending messages to the application", () => {
    it("notifies the application when a new version is available and an old version exists", async () => {
      const staleCaches = [
        "mynameisviii.com-precache-stale",
        "mynameisviii.com-local-stale"
      ];
      const validCaches: string[] = Object.values(g.cacheNames);
      for (const cache of [...staleCaches, ...validCaches]) {
        await s.caches.open(cache);
      }

      const client = await s.clients.openWindow("/");
      client.postMessage = jest.fn();
      await s.trigger("activate");

      expect(client.postMessage).toHaveBeenCalledWith({
        type: "serviceWorker.activate"
      });
    });

    it("doesn't notify the application when a new version is available and an old version doesn't exist", async () => {
      const validCaches: string[] = Object.values(g.cacheNames);
      for (const cache of validCaches) {
        await s.caches.open(cache);
      }

      const client = await s.clients.openWindow("/");
      client.postMessage = jest.fn();
      await s.trigger("activate");

      expect(client.postMessage).not.toHaveBeenCalled();
    });
  });

  describe("receiving messages from the application", () => {
    it("handles routeChange message correctly", async () => {
      const payload = "/test";

      await s.onmessage(
        new MessageEvent("worker", {
          data: { type: "changeRoute", payload }
        } as any)
      );

      const cache = s.snapshot().caches[g.cacheNames.local];
      expect(cache).toBeDefined();
      expect(cache[payload]).toBe("success");
    });
  });
});
