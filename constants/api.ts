// constants/api.ts
// -----------------------------------------------------------------------------
// Centralised API endpoint configuration.
// Reads values injected by Expo (`extra` in app.config/app.json) or `.env`.
// -----------------------------------------------------------------------------
import Constants from 'expo-constants';

// Expo SDK 49+ provides static config in `expoConfig`. That is the recommended
// source. We no longer reference the deprecated `manifest` property.
const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;

// Prefer `extra`, then environment variables (EXPO_PUBLIC_*, etc.), then defaults.
export const API_HOST: string =
  (extra.API_HOST as string) ||
  (process.env.EXPO_PUBLIC_API_HOST as string) ||
  (process.env.API_HOST as string) ||
  '192.168.0.65';

export const API_PORT: string =
  (extra.API_PORT as string) ||
  (process.env.EXPO_PUBLIC_API_PORT as string) ||
  (process.env.API_PORT as string) ||
  '8000';

export const API_BASE_URL = `http://${API_HOST}:${API_PORT}`;

export default {
  API_HOST,
  API_PORT,
  API_BASE_URL,
};
