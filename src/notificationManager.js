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

const applicationServerPublicKey = 'BKRr_m39E5bkof21ZAqH9gV3WzTMgou5k3hByQIdFsMICt3SztRKvXjYIO6BNtgl5aVwaWYM3Gi1pszqEIbRmLw';

let isSubscribed = false;
let swRegistration = null;

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

function initializeSubscription() {
	console.log('[NotificationManager] Inicializando UI...');

	subscribeUser();

	// Get the subscription object
	swRegistration.pushManager.getSubscription().then(subscription => {
		console.log('[NotificationManager] getSubscription pushManager', subscription);
		isSubscribed = (subscription !== null);

		updateSubscriptionOnServer(subscription);
		
		if (isSubscribed) {
			console.log('[NotificationManager] User IS subscribed.');
		} else {
			console.log('[NotificationManager] User is NOT subscribed.');
		}
	});

}

function subscribeUser() {
	console.log('[NotificationManager - subscribeUser] Inscrevendo usuário no PushManager');

	const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

	// subscribe to the push service
	swRegistration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: applicationServerKey,
	}).then(subscription => {
		console.log('[NotificationManager - subscribeUser] Usuário inscrito:', subscription);
		updateSubscriptionOnServer(subscription);
		isSubscribed = true;

	}).catch(err => {
		if (Notification.permission === 'denied') {
			console.warn('[NotificationManager - subscribeUser] Permissão para apresentar notificações foi negada');
		} else {
			console.error('[NotificationManager - subscribeUser] Erro ao inscrever usuário. Motivo:', err);
		}
	});

}

function unsubscribeUser() {
	console.log('[NotificationManager - unsubscribeUser] Desinscrevendo usuário do PushManager');

	// Unsubscribe from the push service
	swRegistration.pushManager.getSubscription()
		.then(subscription => {
			if (subscription) {
				return subscription.unsubscribe();
			}
		})
		.catch(err => {
			console.error('[NotificationManager - unsubscribeUser] Erro ao desinscrever usuário. Motivo:', err);
		})
		.then(() => {
			updateSubscriptionOnServer(null);
			console.log('[NotificationManager - unsubscribeUser] Usuário desinscrito');
			isSubscribed = false;
		});
}

function updateSubscriptionOnServer(subscription) {
	console.log('[NotificationManager] Atualizando inscrição do Push Manager no servidor', subscription);

	// Here's where you would send the subscription to the application server
	if (subscription) {
		const subscriptionJson = JSON.stringify(subscription);
		console.log('subscriptionJson', subscriptionJson);

		const endpointURL = subscription.endpoint;
		console.log('endpointURL', endpointURL);
	}
}


function displayNotification(notifMessage) {
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

export async function init() {
	console.log('[NotificationManager] Inicializando...');

	if (!('Notification' in window)) {
		console.log('[NotificationManager] Este navegador não suporta notificações!');
		return;
	}

	Notification.requestPermission(status => {
		console.log('[NotificationManager] Status da permissão de notificação:', status);
	});

	navigator.serviceWorker.ready.then(registration => {
		console.log('[NotificationManager] ServiceWorker está pronto e ativo!');
		swRegistration = registration;
	
		const notifMessage = 'Seja bem vindo ao Bee Monitor App!';
		displayNotification(notifMessage);

		initializeSubscription();
	});
}