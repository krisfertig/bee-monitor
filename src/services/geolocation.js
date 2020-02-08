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

function setCurrentPosition( position ) {
	console.log('[geolocationService] Atualizando dados de localização no servidor.');
	console.log('GEO position', position.coords);

	const { latitude, longitude } = position.coords;
	const geolocation = {
		position: {
			latitude,
			longitude,
		},
		deviceId: 'colmeia0001',
	};
	console.log('geolocation api geolocation', geolocation);

	return fetch(`${SERVER_URL}/bee-sensors/api/v1/sensors/geolocation`, {
		method: 'POST',
		body: JSON.stringify({ geolocation: geolocation }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

function positionError( error ) {

    switch ( error.code ) {
        case error.PERMISSION_DENIED:
            console.error( "User denied the request for Geolocation." );
            break;
        case error.POSITION_UNAVAILABLE:
            console.error( "Location information is unavailable." );
            break;
        case error.TIMEOUT:
            console.error( "The request to get user location timed out." );
            break;
        case error.UNKNOWN_ERROR:
            console.error( "An unknown error occurred." );
            break;
    }
}

export async function getCurrentPosition() {
	console.log('[geolocationService] Coletando dados de localização do usuário...');

	if ( navigator.geolocation ) {
		/* geolocation is available */
		navigator.geolocation.getCurrentPosition( setCurrentPosition, positionError, {
			enableHighAccuracy: true,
			timeout: 15000,
			maximumAge: 0,
		});
	} else {
		console.log('[geolocationService] Serviço de Geolocalização não está habilitado ou é suportado no navegador');
	}
}