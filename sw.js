'use strict';
// Increase VERSION whenever an app-shell file changes; publish all files together.
const VERSION='kobe-shell-1.0.1';
const PREFIX='kobe-shell-';
const CACHE=PREFIX+new URL(self.registration.scope).pathname+VERSION;
const FILES=['./','./index.html','./style.css','./fields.js','./app.js','./manifest.json','./guide.html','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));});
// Wait for older tabs to close before activating to avoid mixing application versions.
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const prefix=PREFIX+new URL(self.registration.scope).pathname;for(const k of await caches.keys())if(k.startsWith(prefix)&&k!==CACHE)await caches.delete(k);await self.clients.claim();})());});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const url=new URL(e.request.url);if(url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;e.respondWith((async()=>{const cache=await caches.open(CACHE);const hit=await cache.match(e.request,{ignoreSearch:true});if(hit)return hit;try{return await fetch(e.request);}catch(err){if(e.request.mode==='navigate')return await cache.match('./index.html');throw err;}})());});
