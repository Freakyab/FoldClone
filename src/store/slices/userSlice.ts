import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
    GoogleAuthProvider,
    signInWithCredential,
    type User as FirebaseUser,
} from 'firebase/auth';

import { API_BASE_URL } from '@/lib/apibase';

import {
    GOOGLE_DISCOVERY,
    GOOGLE_WEB_CLIENT_ID,
    GOOGLE_WEB_CLIENT_SECRET,
} from '@/constants/google-auth';
import { getFirebaseAuth } from '@/lib/firebase';

export interface UserState {
  /** Profile.specificId from backend (5-char uppercase identifier) */
  specificId: string;
  name: string;
  token: string | null;
  username: string;
  password: string;
  isLoggedIn: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  shouldUploadStatement: boolean;
}

const initialState: UserState = {
  specificId: '',
  name: '',
  token: null,
  username: '',
  password: '',
  isLoggedIn: false,
  status: 'idle',
  error: null,
  shouldUploadStatement: false,
};

export interface LoginCredentials {
  name: string;
  username: string;
  password: string;
}

export interface GoogleCodeExchangeParams {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

function firebaseUserToCredentials(user: FirebaseUser): LoginCredentials {
  const name = user.displayName ?? user.email ?? 'User';
  const username = user.email ?? user.uid ?? '';
  return { name, username, password: '' };
}


/** Login/signup against backend and store returned user + token */
export const loginUser = createAsyncThunk<
  { specificId: string; name: string; username: string; token: string },
  LoginCredentials,
  { rejectValue: string }
>(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    const trimmedName = credentials.name.trim();
    const trimmedUsername = credentials.username.trim();

    if (!trimmedUsername || !credentials.password.trim()) {
      return rejectWithValue('Username and password are required.');
    }
    if (!trimmedName) {
      return rejectWithValue('Name is required.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedUsername,
          username: trimmedUsername,
          password: credentials.password,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message: string;
        data?: {
          user: { name?: string; email?: string; username?: string; specificId?: string };
          token: string;
        };
      };

      if (!response.ok || !data.success || !data.data) {
        return rejectWithValue(data.message || 'Login failed');
      }

      const user = data.data.user;
      return {
        specificId: user.specificId ?? '',
        name: user.name ?? trimmedName,
        username: user.username ?? user.email ?? trimmedUsername,
        token: data.data.token,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      return rejectWithValue(message);
    }
  },
);

/** Login against backend using email + password */
export const loginExistingUser = createAsyncThunk<
  { specificId: string; name: string; username: string; token: string },
  LoginCredentials,
  { rejectValue: string }
>(
  'user/loginExistingUser',
  async (credentials, { rejectWithValue }) => {
    const trimmedUsername = credentials.username.trim();

    if (!trimmedUsername || !credentials.password.trim()) {
      return rejectWithValue('Email and password are required.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedUsername,
          password: credentials.password,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message: string;
        data?: {
          user: { name?: string; email?: string; username?: string; specificId?: string };
          token: string;
        };
      };

      if (!response.ok || !data.success || !data.data) {
        return rejectWithValue(data.message || 'Login failed');
      }

      const user = data.data.user;
      const fallbackName = credentials.name.trim() || trimmedUsername;
      return {
        specificId: user.specificId ?? '',
        name: user.name ?? user.email ?? fallbackName,
        username: user.username ?? user.email ?? trimmedUsername,
        token: data.data.token,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      return rejectWithValue(message);
    }
  },
);

/** Exchange Google OAuth code for id_token, sign in with Firebase, then return user for Redux */
export const loginWithGoogle = createAsyncThunk<
  LoginCredentials,
  GoogleCodeExchangeParams,
  { rejectValue: string }
>(
  'user/loginWithGoogle',
  async ({ code, codeVerifier, redirectUri }, { rejectWithValue }) => {
    if (!GOOGLE_WEB_CLIENT_ID) {
      return rejectWithValue(
        'Google Sign-In is not configured. Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in your environment.',
      );
    }

    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) {
      return rejectWithValue(
        'Firebase is not configured. Set EXPO_PUBLIC_FIREBASE_* env vars.',
      );
    }

    try {
      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        code_verifier: codeVerifier,
        client_id: GOOGLE_WEB_CLIENT_ID,
        redirect_uri: redirectUri,
      });
      if (GOOGLE_WEB_CLIENT_SECRET) {
        tokenParams.set('client_secret', GOOGLE_WEB_CLIENT_SECRET);
      }

      const tokenRes = await fetch(GOOGLE_DISCOVERY.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenParams.toString(),
      });

      if (!tokenRes.ok) {
        const errBody = await tokenRes.text();
        return rejectWithValue(
          `Google token exchange failed: ${tokenRes.status} ${errBody}`,
        );
      }

      const tokens = (await tokenRes.json()) as {
        access_token?: string;
        id_token?: string;
      };
      const idToken = tokens.id_token;
      if (!idToken) {
        return rejectWithValue('Google did not return an id_token.');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(firebaseAuth, credential);
      const user = userCredential.user;
      return firebaseUserToCredentials(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      return rejectWithValue(message);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        specificId?: string;
        name: string;
        username: string;
        password: string;
      }>,
    ) => {
      state.specificId = action.payload.specificId ?? '';
      state.name = action.payload.name;
      state.token = null;
      state.username = action.payload.username;
      state.password = action.payload.password;
      state.isLoggedIn = true;
      state.error = null;
      state.status = 'succeeded';
      state.shouldUploadStatement = false;
    },
    logoutUser: (state) => {
      state.specificId = '';
      state.name = '';
      state.token = null;
      state.username = '';
      state.password = '';
      state.isLoggedIn = false;
      state.status = 'idle';
      state.error = null;
      state.shouldUploadStatement = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    completeStatementSetup: (state) => {
      state.shouldUploadStatement = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.specificId = action.payload.specificId;
        state.name = action.payload.name;
        state.username = action.payload.username;
        state.password = '';
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.status = 'succeeded';
        state.error = null;
        state.shouldUploadStatement = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Login failed';
        state.isLoggedIn = false;
      })
      .addCase(loginExistingUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginExistingUser.fulfilled, (state, action) => {
        state.specificId = action.payload.specificId;
        state.name = action.payload.name;
        state.username = action.payload.username;
        state.password = '';
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.status = 'succeeded';
        state.error = null;
        state.shouldUploadStatement = false;
      })
      .addCase(loginExistingUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Login failed';
        state.isLoggedIn = false;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.username = action.payload.username;
        state.password = action.payload.password;
        state.isLoggedIn = true;
        state.status = 'succeeded';
        state.error = null;
        state.shouldUploadStatement = false;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Google sign-in failed';
        state.isLoggedIn = false;
      });
  },
});

export const { setUser, logoutUser, clearError, completeStatementSetup } = userSlice.actions;
export default userSlice.reducer;
