/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const SERVER_URL = 'https://10.42.0.1';

// VAPID PUBLIC KEY:
const applicationServerPublicKey = 'BE09RQJgbuwgqVe5YRtIPogJC47yKW6-mk3bIODq_0ODAgN93gwllGu3v-OmIoAyPuxGqut76264W1A4C_k2NQg';

let isSubscribed = false;
let swRegistration = null;

async function initializeSubscription() {
	console.log('[NotificationManager] Inicializando inscrições...');

	// Get the subscription object
	if(swRegistration) {
		swRegistration.pushManager.getSubscription().then(subscription => {
			isSubscribed = (subscription !== null);
			if (isSubscribed) {
				console.log('[NotificationManager] Usuário está inscrito.');
			} else {
				console.log('[NotificationManager] Usuário não está inscrito.');
				subscribeUser();
			}
		});
	}
}

function subscribeUser() {
	console.log('[NotificationManager - subscribeUser] Inscrevendo usuário no PushManager');
	const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

	// subscribe to the push service
	swRegistration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey,
	}).then(subscription => {
		console.log('[NotificationManager - subscribeUser] Usuário inscrito:', subscription);
		subscribeOnServer(subscription);
		isSubscribed = true;

	}).catch(err => {
		if (Notification.permission !== 'granted') {
			console.warn('[NotificationManager - subscribeUser] Permissão para apresentar notificações foi negada');
		} else {
			console.error('[NotificationManager - subscribeUser] Erro ao inscrever usuário. Motivo:', err);
		}
	});

}

function unsubscribeUser() {
	console.log('[NotificationManager - unsubscribeUser] Desinscrevendo usuário do PushManager');
	let subscription = null;

	// Unsubscribe from the push service
	if(swRegistration) {
		swRegistration.pushManager.getSubscription().then(sub => {
			if (sub) {
				subscription = sub;
				return sub.unsubscribe();
			}
		}).catch(err => {
			console.error('[NotificationManager - unsubscribeUser] Erro ao desinscrever usuário. Motivo:', err);
		}).then(() => {
			unsubscribeOnServer(subscription);
			console.log('[NotificationManager - unsubscribeUser] Usuário desinscrito');
			isSubscribed = false;
		});
	}
}

function unsubscribeOnServer(subscription) {
	console.log('[NotificationManager] Atualizando desinscrição do Push Manager no servidor.');

	if (subscription) {
		return fetch(`${SERVER_URL}/bee-notification/api/v1/notifications/unsubscribe`, {
			method: 'POST',
			body: JSON.stringify({ subscription }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}
}

function subscribeOnServer(subscription) {
	console.log('[NotificationManager] Atualizando inscrição do Push Manager no servidor.');

	// Here's where you would send the subscription to the application server
	if (subscription) {
		return fetch(`${SERVER_URL}/bee-notification/api/v1/notifications/subscribe`, {
			method: 'POST',
			body: JSON.stringify({ subscription }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}
}

/*function displayNotification(notifMessage) {
	console.log('[NotificationManager] Apresentando notificação com seguinte mensagem:', notifMessage);

	// Display a Notification
	if (Notification.permission == 'granted') {

		// 'options' object to configure the notification
		const options = {
			body: notifMessage,
			badge: 'images/badge.png',
			vibrate: [100, 50, 100],
			data: {
				dateOfArrival: Date.now(),
				primaryKey: 1
			},
			
			// Actions to the notification
			actions: [
				//{action: 'explore', title: 'Abrir Bee Monitor'},
				{action: 'close', title: 'Fechar'}
			]
			// TODO 5.1 - add a tag to the notification
		};

		swRegistration.showNotification('Bee Monitor', options);
	}
}
*/

export async function init() {
	console.log('[NotificationManager] Inicializando...');

	const doesBrowserSupportsNotifications = 'Notification' in window;
	if (!doesBrowserSupportsNotifications) {
		console.log('[NotificationManager] Este navegador não suporta notificações!');
		return;
	}

	try {
		const notifPermission = await Notification.requestPermission();
		console.log('[NotificationManager] Status da permissão de notificação:', notifPermission);

		swRegistration = await navigator.serviceWorker.ready;
		console.log('[NotificationManager] ServiceWorker está pronto e ativo!', swRegistration);
		initializeSubscription();

	} catch (error) {
		console.log('[NotificationManager] Falha ao inicializar gerenciador de notificações. Motivo:', error);
	}
}

export async function terminate() {
	console.log('[NotificationManager] Finalizando...');
	unsubscribeUser();
}

const observeNotificationPermissions = (() => {
	if ('permissions' in navigator) {
		navigator.permissions.query({ name: 'notifications' }).then(notificationPerm => {
			notificationPerm.onchange = function () {
				// User decided to change his seettings rear.
				const notifPermissionStatus = notificationPerm.state;

				const shouldSubscribeUserNow = !isSubscribed && !!swRegistration && notifPermissionStatus === 'granted';
				if (shouldSubscribeUserNow) {
					initializeSubscription();
				}
			};
		});
	}
})();

// Utilitários
function urlB64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}