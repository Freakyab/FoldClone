import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { useEffect } from 'react';

import { GOOGLE_DISCOVERY, GOOGLE_WEB_CLIENT_ID } from '@/constants/google-auth';
import { isFirebaseConfigured } from '@/lib/firebase';
import { useAppDispatch } from '@/store/hooks';
import { loginWithGoogle } from '@/store/slices/userSlice';

/** Call once so the auth session can be completed (e.g. close the browser). */
WebBrowser.maybeCompleteAuthSession();

export function useGoogleSignIn() {
  const dispatch = useAppDispatch();

  const redirectUri = makeRedirectUri({
    scheme: 'foldclone',
    path: 'redirect',
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GOOGLE_WEB_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      usePKCE: true,
    },
    GOOGLE_DISCOVERY,
  );

  useEffect(() => {
    if (response?.type !== 'success' || !request) return;

    const { code } = response.params;
    const codeVerifier = request.codeVerifier;
    const redirectUriUsed = request.redirectUri;

    if (!code || !codeVerifier || !redirectUriUsed) return;

    dispatch(
      loginWithGoogle({
        code,
        codeVerifier,
        redirectUri: redirectUriUsed,
      }),
    );
  }, [response, request, dispatch]);

  const signInWithGoogle = () => {
    promptAsync();
  };

  const isConfigured = Boolean(
    GOOGLE_WEB_CLIENT_ID && isFirebaseConfigured(),
  );
  const isReady = Boolean(request);

  return { signInWithGoogle, isReady, isConfigured };
}
