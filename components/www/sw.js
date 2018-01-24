/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/YYPcyY
 */


importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.0.0-alpha.3/workbox-sw.js");









/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "assets/icon/favicon.ico",
    "revision": "d2f619d796fbe8bed6200da2691aa5b6"
  },
  {
    "url": "assets/icon/icon.png",
    "revision": "b96ad6e1e0b755c8cd45e6aec40bca25"
  },
  {
    "url": "build/app.js",
    "revision": "3ab25f8547b614df17e2320159d9e497"
  },
  {
    "url": "build/app/app.core.js",
    "revision": "3182d9d99bb008b7b184d890a0d4fe16"
  },
  {
    "url": "build/app/app.registry.json",
    "revision": "4c17ca2d6e08602b73133be606eb247c"
  },
  {
    "url": "build/app/es5-build-disabled.js",
    "revision": "fea234cb3ef16f063c930dd30a4b14af"
  },
  {
    "url": "build/app/hab-app.js",
    "revision": "467febb6f9ae24eacf1f67cc28e7ac5b"
  },
  {
    "url": "build/app/hab-test.js",
    "revision": "75ff6e188c60b3379a3e669da738449e"
  },
  {
    "url": "host.config.json",
    "revision": "7402240e25fb21f3a2b717bbd27ac950"
  },
  {
    "url": "index.html",
    "revision": "c04aa2dc47a5d31d1cb6e83f2869dc3b"
  },
  {
    "url": "workbox-sw.prod.v2.1.2.js",
    "revision": "685d1ceb6b9a9f94aacf71d6aeef8b51"
  }
].concat(self.__precacheManifest || []);

if (Array.isArray(self.__precacheManifest)) {
  workbox.precaching.suppressWarnings();
  workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
}
