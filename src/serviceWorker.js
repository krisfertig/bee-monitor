export function register() {
	if ('serviceWorker' in navigator) {
		console.log('Service worker is supported.');

		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/service-worker-custom.js')
				.then((reg) => {
					console.log('Service worker registered.', reg);
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
