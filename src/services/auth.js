export const TOKEN_KEY = "@airbnb-Token";

export const isAuthenticated = () => {
  const hasToken = localStorage.getItem(TOKEN_KEY) !== null;
  return hasToken;
};

export const getToken = () => {
  const gotToken = localStorage.getItem(TOKEN_KEY);
  return gotToken;
};

export const login = token => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};
