/**
 * Google OAuth configuration.
 * Create a project in Google Cloud Console, enable the Google+ API / People API,
 * and create OAuth 2.0 credentials (Web application) to get the Client ID.
 * Add your redirect URI (e.g. https://auth.expo.io/@your-username/fold-clone for Expo,
 * or your custom scheme foldclone:// for dev builds) in the consent screen.
 */
export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

/** Optional: required by Google for some client types when exchanging code for tokens. Prefer using a backend for production. */
export const GOOGLE_WEB_CLIENT_SECRET =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_SECRET ?? '';

/** Discovery document for expo-auth-session (camelCase endpoints) */
export const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
} as const;
