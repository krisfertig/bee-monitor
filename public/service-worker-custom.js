const CACHE_NAME = 'static-cache-v3.0';

//TODO: Adicionar mais arquivos para cachear
const FILES_TO_CACHE = [
	'/offline.html',
];

const BEE_MONITOR_DEFAULT_NOTIF_TITLE = 'Bee Monitor';

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
	console.log('[ServiceWorker] Fetch');

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

// Notificações:

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
		//TODO: Tratar outras actions das notificações aqui
		// Por padrão, deve abrir o dashboard da aplicação e fechar notificação ao clicar em cima dela
		clients.openWindow('/app/dashboard');
		notification.close();
	}

	// TODO: close all notifications when one is clicked ?
});

//Push event listener
self.addEventListener('push', function(event) {
	const notif = JSON.parse(event.data.text());
	console.log('[ServiceWorker] Recebeu Notificação Push:', notif);

	//TODO: Poderia utilizar um utilitário ou método do notificationService, como 'displayNotification()'
	const title = notif.title || BEE_MONITOR_DEFAULT_NOTIF_TITLE;
	const options = {
		body: notif.body || '',
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
