/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */

let deferredInstallPrompt = null;
let installButton = null;

// Event listener for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

/**
 * Event handler for beforeinstallprompt event.
 *   Saves the event & shows install button.
 *
 * @param {Event} evt
 */
function saveBeforeInstallPromptEvent(evt) {
	// Save event & show the install button.
	deferredInstallPrompt = evt;
	installButton.style.visibility = "visible";
}

/**
 * Event handler for butInstall - Does the PWA installation.
 *
 * @param {Event} evt
 */
function installPWA(evt) {
	// Show install prompt & hide the install button.
	deferredInstallPrompt.prompt();

	// Log user response to prompt.
	deferredInstallPrompt.userChoice.then((choice) => {
		if (choice.outcome === 'accepted') {
			console.log('[InstallScript] Usuário aceitou a solicitação do prompt de instalação do App.', choice);
			// Hide the install button, it can't be called twice.
			installButton.style.visibility = "hidden";
		} else {
			console.log('[InstallScript] Usuário rejeitou a solicitação do prompt de instalação do App.', choice);
		}
		deferredInstallPrompt = null;
	})

}

// Event listener for appinstalled event
window.addEventListener('appinstalled', logAppInstalled);

/**
 * Event handler for appinstalled event.
 *   Log the installation to analytics or save the event somehow.
 *
 * @param {Event} evt
 */
function logAppInstalled(evt) {
	// Log the event
	console.log('[InstallScript] Bee Monitor App foi instalado.', evt);

}

export function init() {
	console.log('[InstallScript] Preparando aplicação para exibir opção de instalação do App se possível');

	installButton = document.getElementById('butInstall');
	installButton.addEventListener('click', installPWA);
}