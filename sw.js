/* Compás hors connexion.
   - La page (index.html) passe par le réseau quand il y en a, pour recevoir les mises à jour, sinon par le cache.
   - Les gros fichiers (sons, polices, modèle d'écoute, exercices) ont un numéro dans leur nom : ils restent
     dans un cache à part d'une version à l'autre et ne se retéléchargent que lorsqu'ils changent de nom. */
const VERSION = "compas-v35";
const FIXES = "compas-fixes";
const PAGE = ["./", "index.html", "manifest.webmanifest", "icone-180.png", "icone-192.png", "icone-512.png",
  "icone-masquable-512.png", "pdfjs/pdf.min.js", "pdfjs/pdf.worker.min.js"];
const LOURDS = ["sons-1.js", "polices-1.css", "nunez-1.js", "notes-1.js"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(["./", "index.html"]);
    await Promise.all(PAGE.filter(f => f !== "./" && f !== "index.html")
      .map(f => c.add(f).catch(() => c.add(f.replace("pdfjs/", "")).catch(() => {}))));
    // un gros fichier déjà en cache n'est pas retéléchargé ; un fichier absent (nunez) n'empêche rien
    const f = await caches.open(FIXES);
    await Promise.all(LOURDS.map(async x => { if (!(await f.match(x))) await f.add(x).catch(() => {}); }));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k.startsWith("compas-") && k !== VERSION && k !== FIXES).map(k => caches.delete(k)));
    // les anciennes versions des gros fichiers s'en vont
    const f = await caches.open(FIXES);
    for (const r of await f.keys()) { if (!LOURDS.some(x => r.url.endsWith("/" + x))) await f.delete(r); }
    await self.clients.claim();
  })());
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
        .catch(() => caches.open(VERSION).then(k => k.match(page, {ignoreSearch: true})).then(r => r || caches.match(page, {ignoreSearch: true})))
    );
    return;
  }
  const lourd = LOURDS.some(x => url.pathname.endsWith("/" + x));
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(r => r || fetch(req).then(res => {
    if (res && res.ok) { const c = res.clone(); caches.open(lourd ? FIXES : VERSION).then(k => k.put(req, c)); }
    return res;
  })));
});
