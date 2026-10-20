// Service worker: מאפשר פתיחה ללא רשת אחרי הביקור הראשון
const CACHE = 'omer-v4';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './src/shell.css', './src/logic.js', './src/app.js',
  './ds/components/bundle.css', './ds/components/bundle.js',
  './ds/components/lib/react.production.min.js', './ds/components/lib/react-dom.production.min.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // קבצי האפליקציה: רשת קודם (לעדכונים, בלי מטמון ה־HTTP של GitHub Pages), מטמון כגיבוי. גופנים: מטמון קודם.
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return res; })));
  }
});

// התראת תזכורת: "ספרתי" מסמן באפליקציה הפתוחה (או פותח אותה עם #done=שנה-יום); לחיצה רגילה פותחת את האפליקציה
self.addEventListener('notificationclick', e => {
  const d = e.notification.data || {}; e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const c = list[0];
    if (e.action === 'done') {
      if (c) { c.postMessage({ type: 'omer-done', n: d.n, year: d.year }); return; }
      return self.clients.openWindow('./#done=' + d.year + '-' + d.n);
    }
    if (c) return c.focus();
    return self.clients.openWindow('./');
  }));
});
