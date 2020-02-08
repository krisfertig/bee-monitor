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

import { SERVER_URL, BEE_SENSORS_SERVICE } from "../constants";

let deviceId = null;

async function setCurrentPosition( position ) {
	console.log('[geolocationService] Atualizando dados de localização no servidor.');

	const { latitude, longitude } = position.coords;
	const geolocation = {
		position: {
			latitude,
			longitude,
		},
		deviceId: deviceId || 'colmeia0001',
	};

	return fetch(`${SERVER_URL}${BEE_SENSORS_SERVICE}/v1/sensors/geolocation`, {
		method: 'POST',
		body: JSON.stringify({ geolocation: geolocation }),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(response => {
		if (response.ok) {
			return Promise.resolve();
		} else {
			return Promise.reject(response.status);
		}
	});
}

function positionError(error) {

    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.error("O usuário negou a solicitação de geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.error("As informações de localização não estão disponíveis.");
            break;
        case error.TIMEOUT:
            console.error("A solicitação para obter a localização do usuário expirou.");
            break;
        case error.UNKNOWN_ERROR:
            console.error("Ocorreu um erro desconhecido.");
			break;
		default:
			console.error("Ocorreu um erro ao solicitar a localização.");
			break;
    }
}

function getLocalCurrentLocation(options) {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, ({code, message}) =>
			reject(Object.assign(new Error(message), {name: "PositionError", code})),
			options);
	});
};

export async function getCurrentPosition(beehiveId) {
	deviceId = beehiveId;

	console.log('[geolocationService] Coletando dados de localização do usuário...');

	const geolocationOptions = {
		enableHighAccuracy: true,
		timeout: 15000,
		maximumAge: 0,
	};

	if ( navigator.geolocation ) {
		console.log('[geolocationService] Serviço de Geolocalização está disponível!');
		//return navigator.geolocation.getCurrentPosition( setCurrentPosition, positionError, geolocationOptions);
		/*try {
			const position = await getLocalCurrentLocation(geolocationOptions);
			console.log('getLocalCurrentPosition position', position);
			await setCurrentPosition(position);
		} catch (e) {
			console.log('getCurrentPosition', e);
		}*/
	
		const position = await getLocalCurrentLocation(geolocationOptions);
		console.log('getLocalCurrentPosition position', position);
		await setCurrentPosition(position);

	} else {
		console.log('[geolocationService] Serviço de Geolocalização não está habilitado ou é suportado no navegador');
	}
}