export const AUTH_KEY_STORAGE = 'authKey';
export const TOKEN_STORAGE = 'token';
const AUTH_CHANGE_EVENT = 'auth-change';

export function isAuthenticated() {
  if (typeof window === 'undefined') {
    return false;
  }

  return localStorage.getItem(AUTH_KEY_STORAGE) === 'true';
}

export function setAuth(token: string) {
  localStorage.setItem(TOKEN_STORAGE, token);
  localStorage.setItem(AUTH_KEY_STORAGE, 'true');
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_STORAGE);
  localStorage.removeItem(AUTH_KEY_STORAGE);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function subscribeToAuthChange(callback: () => void) {
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
