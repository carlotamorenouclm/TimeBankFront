// Centraliza las rutas base del backend para no repetir strings por el proyecto.
export const API_URL = import.meta.env.VITE_API_URL;
export const USERS_PATH = '/users';
export const ADMINS_PATH = '/admins';
export const UPDATE_ROLE_PATH ='/updateRole';
export const UPDATE_USER_INFO_PATH = '/update';
export const UPDATE_IS_ACTIVE_PATH = '/update/is-active';
export const UPDATE_WALLET_BALANCE_PATH = '/wallet/balance';
export const WALLET_HISTORY_PATH = '/wallet/history';
export const DELETE_USER_PATH = '/delete';
