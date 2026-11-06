// かなつなぎ Service Worker — シェルをまるごとキャッシュしてオフラインでも遊べるように
const VERSION = 'bd25d4e617';
const CACHE = 'kanatsunagi-' + VERSION;
const SHELL = ['./', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './icon-180.png', './favicon.svg'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.allSettled(SHELL.map(u => c.add(new Request(u, { cache: 'reload' }))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE && k !== 'kanatsunagi-fonts' && k.startsWith('kanatsunagi-')) await caches.delete(k);
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com') {
    e.respondWith((async () => {                            // Webフォントはオフラインでも効くように別枠で保存
      const c = await caches.open('kanatsunagi-fonts');
      const hit = await c.match(req);
      if (hit) return hit;
      try { const r = await fetch(req); if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }
      catch (_) { return Response.error(); }
    })());
    return;
  }
  if (url.origin !== location.origin) return;              // Firebase などはそのまま通す

  if (req.mode === 'navigate') {                            // 画面の読み込み：キャッシュ優先＋裏で更新
    e.respondWith((async () => {
      const cached = await caches.match('./index.html');
      const net = (async () => {
        try {
          const r = (await e.preloadResponse) || await fetch(req);
          if (r && r.ok) (await caches.open(CACHE)).put('./index.html', r.clone());
          return r;
        } catch (_) { return null; }
      })();
      return cached || (await net) || new Response('オフラインです', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } });
    })());
    return;
  }

  e.respondWith((async () => {                              // そのほかの同一オリジンのファイル
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const r = await fetch(req);
      if (r && r.ok && r.type === 'basic') (await caches.open(CACHE)).put(req, r.clone());
      return r;
    } catch (_) {
      return cached || Response.error();
    }
  })());
});
