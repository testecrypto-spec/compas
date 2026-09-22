/* Compás hors connexion : tout est mis en cache à l'installation.
   La page passe par le réseau quand il y en a (pour recevoir les mises à jour), sinon par le cache. */
const VERSION = "compas-v9";
const FICHIERS = ["./", "index.html", "manifest.webmanifest", "icone-180.png", "icone-192.png", "icone-512.png",
  "icone-masquable-512.png", "pdfjs/pdf.min.js", "pdfjs/pdf.worker.min.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith("compas-") && k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
function delai(ms){ return new Promise((_, ko) => setTimeout(() => ko(new Error("délai")), ms)); }
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    const page = new URL("index.html", self.registration.scope).href;
    e.respondWith(
      Promise.race([fetch(req), delai(4000)])
        .then(r => { if (r && r.ok) { const c = r.clone(); caches.open(VERSION).then(k => k.put(page, c)); } return r; })
        .catch(() => caches.match(page, {ignoreSearch: true}))
    );
    return;
  }
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(r => r || fetch(req).then(res => {
    if (res && res.ok) { const c = res.clone(); caches.open(VERSION).then(k => k.put(req, c)); }
    return res;
  })));
});
