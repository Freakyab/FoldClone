import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { LoginScreen } from '@/components/login-screen';
import { UploadStatementScreen } from '@/components/upload-statement-screen';
import { getFirebaseAuth } from '@/lib/firebase';
import { persistor, store } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { logoutUser, setUser } from '@/store/slices/userSlice';

SplashScreen.preventAutoHideAsync();

/** Sync Firebase auth state to Redux so persisted login is restored on app load */
function FirebaseAuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const name = user.displayName ?? user.email ?? 'User';
        const username = user.email ?? user.uid ?? '';
        dispatch(setUser({ name, username, password: '' }));
      } else {
        dispatch(logoutUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
}

function AppContent() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const shouldUploadStatement = useAppSelector(
    (state) => state.user.shouldUploadStatement,
  );
  const colorScheme = useColorScheme();

  if (!isLoggedIn) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <LoginScreen />
      </ThemeProvider>
    );
  }

  if (shouldUploadStatement) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <UploadStatementScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default function TabLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setAppReady(true);
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={{ flex: 1, backgroundColor: '#000000' }} onLayout={onLayoutRootView}>
          <FirebaseAuthSync />
          <AppContent />
        </View>
      </PersistGate>
    </Provider>
  );
}
