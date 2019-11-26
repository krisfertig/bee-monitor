const TOKEN_KEY = "@beemonitor-Token";

function isAuthenticated() {
	const hasToken = localStorage.getItem(TOKEN_KEY) !== null;
	return hasToken;
}

function getToken() {
	const gotToken = localStorage.getItem(TOKEN_KEY);
	return gotToken;
}

function login(token) {
	localStorage.setItem(TOKEN_KEY, token);
}

function logout() {
	localStorage.removeItem(TOKEN_KEY);
}

module.exports = {
	logout,
	login,
	getToken,
	isAuthenticated,
	TOKEN_KEY,
};
