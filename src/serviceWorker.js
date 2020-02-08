
export function register() {
	if ('serviceWorker' in navigator) {
		console.log('[ServiceWorker] Supported');

		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/service-worker-custom.js')
				.then(registration => {
					console.log('[ServiceWorker] Registered', registration);
				});
		});
	}
}

export function unregister() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready.then(registration => {
			registration.unregister();
		});
	}
}
