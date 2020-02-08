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

import { SERVER_URL, SERVER_VAPID_PUBLIC_KEY, BEE_NOTIFICATION_SERVICE } from "../constants";


let isSubscribed = false;
let swRegistration = null;

async function initializeSubscription() {
	console.log('[notificationService] Inicializando inscrições...');

	// Get the subscription object
	if(swRegistration) {
		swRegistration.pushManager.getSubscription().then(subscription => {
			isSubscribed = (subscription !== null);
			if (isSubscribed) {
				console.log('[notificationService] Usuário está inscrito.');
			} else {
				console.log('[notificationService] Usuário não está inscrito.');
				subscribeUser();
			}
		});
	}
}

function subscribeUser() {
	console.log('[notificationService - subscribeUser] Inscrevendo usuário no PushManager');
	const applicationServerKey = urlB64ToUint8Array(SERVER_VAPID_PUBLIC_KEY);

	// subscribe to the push service
	swRegistration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey,
	}).then(subscription => {
		console.log('[notificationService - subscribeUser] Usuário inscrito:', subscription);
		subscribeOnServer(subscription);
		isSubscribed = true;

	}).catch(err => {
		if (Notification.permission !== 'granted') {
			console.warn('[notificationService - subscribeUser] Permissão para apresentar notificações foi negada');
		} else {
			console.error('[notificationService - subscribeUser] Erro ao inscrever usuário. Motivo:', err);
		}
	});

}

function unsubscribeUser() {
	console.log('[notificationService - unsubscribeUser] Desinscrevendo usuário do PushManager');
	let subscription = null;

	// Unsubscribe from the push service
	if(swRegistration) {
		swRegistration.pushManager.getSubscription().then(sub => {
			if (sub) {
				subscription = sub;
				return sub.unsubscribe();
			}
		}).catch(err => {
			console.error('[notificationService - unsubscribeUser] Erro ao desinscrever usuário. Motivo:', err);
		}).then(() => {
			unsubscribeOnServer(subscription);
			console.log('[notificationService - unsubscribeUser] Usuário desinscrito');
			isSubscribed = false;
		});
	}
}

function unsubscribeOnServer(subscription) {
	console.log('[notificationService] Atualizando desinscrição do Push Manager no servidor.');

	if (subscription) {
		return fetch(`${SERVER_URL}${BEE_NOTIFICATION_SERVICE}/v1/notifications/unsubscribe`, {
			method: 'POST',
			body: JSON.stringify({ subscription }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}
}

function subscribeOnServer(subscription) {
	console.log('[notificationService] Atualizando inscrição do Push Manager no servidor.');

	// Here's where you would send the subscription to the application server
	if (subscription) {
		return fetch(`${SERVER_URL}${BEE_NOTIFICATION_SERVICE}/v1/notifications/subscribe`, {
			method: 'POST',
			body: JSON.stringify({ subscription }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}
}

/*function displayNotification(notifMessage) {
	console.log('[notificationService] Apresentando notificação com seguinte mensagem:', notifMessage);

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
	console.log('[notificationService] Inicializando...');

	const doesBrowserSupportsNotifications = 'Notification' in window;
	if (!doesBrowserSupportsNotifications) {
		console.log('[notificationService] Este navegador não suporta notificações!');
		return;
	}

	try {
		const notifPermission = await Notification.requestPermission();
		console.log('[notificationService] Status da permissão de notificação:', notifPermission);

		swRegistration = await navigator.serviceWorker.ready;
		console.log('[notificationService] ServiceWorker está pronto e ativo!', swRegistration);
		initializeSubscription();

	} catch (error) {
		console.log('[notificationService] Falha ao inicializar gerenciador de notificações. Motivo:', error);
	}
}

export async function terminate() {
	console.log('[notificationService] Finalizando...');
	unsubscribeUser();
}

// observeNotificationPermissions
(() => {
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
		//.replace(/\-/g, '+')
		.replace(/-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}