const CACHE = "micapitan-v1";
const FILES = ["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png",
  "img/cuartel.webp","img/ceremonia.webp"].concat(
  ["capitan","capitana"].flatMap(c=>["bienvenida","mision","diario","felicitacion","animo","ascenso"].map(p=>`img/${c}-${p}.webp`)));
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (res.ok && new URL(e.request.url).origin === location.origin) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
    return res;
  }).catch(() => caches.match("index.html"))));
});
