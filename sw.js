const CACHE_NAME='interview-v9';
const ASSETS=['./','./index.html','./styles.css','./data.js','./app.js','./manifest.webmanifest','./logo.png','https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(c=>{if(c)return c;return fetch(e.request).then(r=>{if(!r||r.status!==200||r.type==='opaque')return r;const clone=r.clone();caches.open(CACHE_NAME).then(cc=>cc.put(e.request,clone));return r;}).catch(()=>caches.match('./index.html'));}));});
