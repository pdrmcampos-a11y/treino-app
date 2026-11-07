// Cache-first para funcionar offline. Ao mudar qualquer arquivo, aumente a versão abaixo.
const V = "treino-v1";
const FILES = ["./", "index.html", "logic.js", "manifest.webmanifest", "icon-180.png", "icon-512.png"];
self.addEventListener("install", (e) => e.waitUntil(caches.open(V).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request))));
