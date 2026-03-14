import { ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { LoginScreen } from '@/components/login-screen';
import { UploadStatementScreen } from '@/components/upload-statement-screen';
import { Colors, NavigationThemes, PaperThemes } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
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

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  if (shouldUploadStatement) {
    return <UploadStatementScreen />;
  }

  return (
    <>
      <AnimatedSplashOverlay />
      <AppTabs />
    </>
  );
}

export default function TabLayout() {
  const [appReady, setAppReady] = useState(false);
  const colorScheme = useColorScheme();
  const appTheme = Colors[colorScheme];
  const navigationTheme = NavigationThemes[colorScheme];
  const paperTheme = PaperThemes[colorScheme];

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
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <PaperProvider theme={paperTheme}>
            <ThemeProvider value={navigationTheme}>
              <View
                style={{ flex: 1, backgroundColor: appTheme.background }}
                onLayout={onLayoutRootView}>
                <StatusBar style="light" />
                <FirebaseAuthSync />
                <AppContent />
              </View>
            </ThemeProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
