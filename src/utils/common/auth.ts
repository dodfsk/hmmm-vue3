export const TOKEN_KEY = 'access_token';
export const TOKEN_PREFIX = 'Bearer ';
export const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};
export const delToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
 
