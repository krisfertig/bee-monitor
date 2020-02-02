const CACHE_NAME = 'static-cache-v2.9';

const FILES_TO_CACHE = [
	'/offline.html',
];

self.addEventListener('install', (evt) => {
	console.log('[ServiceWorker] Install');

	// Precache static resources here.
	evt.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
		  console.log('[ServiceWorker] Pre-caching offline page');
		  return cache.addAll(FILES_TO_CACHE);
		})
	);

	self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
	console.log('[ServiceWorker] Activate');

	// Remove previous cached data from disk.
	evt.waitUntil(
		caches.keys().then((keyList) => {
		  return Promise.all(keyList.map((key) => {
			if (key !== CACHE_NAME) {
			  console.log('[ServiceWorker] Removing old cache', key);
			  return caches.delete(key);
			}
		  }));
		})
	);

	self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
	console.log('[ServiceWorker] Fetch', evt.request.url);

	// Fetch event handler here.
	if (evt.request.mode !== 'navigate') {
		// Not a page navigation, bail.
		return;
	}

	evt.respondWith(
		fetch(evt.request).catch(() => {
			return caches.open(CACHE_NAME).then((cache) => {
				return cache.match('offline.html');
			});
		})
	);

});

//Handle the notificationclose event
self.addEventListener('notificationclose', event => {

	const notification = event.notification;
	const primaryKey = notification.data.primaryKey;

	console.log('[ServiceWorker] Fechou a notificação: ' + primaryKey);
});

// Handle the notificationclick event
self.addEventListener('notificationclick', event => {

	// Code to open a custom page
	const notification = event.notification;
	const action = event.action;

	if (action === 'close') {
		notification.close();
	} else {
		//clients.openWindow('/');
		notification.close();
	}

	// TODO 5.3 - close all notifications when one is clicked
});

//Push event listener
self.addEventListener('push', function(event) {
	const notifMessage = event.data.text();
	console.log('[ServiceWorker] Recebeu Notificação Push:', notifMessage);

	const title = 'Bee Monitor';
	const options = {
		body: notifMessage,
		badge: 'images/badge.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1
		},
		actions: [
			{action: 'close', title: 'Fechar'}
		]
	};

	const notificationPromise = self.registration.showNotification(title, options);
	event.waitUntil(notificationPromise);
});
