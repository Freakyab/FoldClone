import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useGoogleSignIn } from '@/hooks/use-google-sign-in';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginExistingUser, loginUser } from '@/store/slices/userSlice';

export function LoginScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.user.status);
  const error = useAppSelector((state) => state.user.error);

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('test@gmail.com');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Test@123');

  const { signInWithGoogle, isReady: isGoogleReady, isConfigured: isGoogleConfigured } = useGoogleSignIn();
  const isLoading = status === 'loading';

  const handleSubmit = useCallback(() => {
    if (mode === 'signup') {
      dispatch(
        loginUser({
          name: name.trim(),
          username: (email || username).trim(),
          password,
        }),
      );
      return;
    }

    dispatch(
      loginExistingUser({
        name: name.trim(),
        username: (email || username).trim(),
        password,
      }),
    );
  }, [dispatch, mode, name, email, username, password]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + Spacing.five,
              paddingBottom: insets.bottom + Spacing.four,
              paddingHorizontal: insets.left + Spacing.four,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ThemedText type="title" style={styles.title}>
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </ThemedText>
          <ThemedText type="small" themeColor="textMuted" style={styles.subtitle}>
            {mode === 'login'
              ? 'Enter your email and password to continue'
              : 'Fill in your details to get started'}
          </ThemedText>

          <View style={styles.modeToggleRow}>
            <Pressable
              onPress={() => setMode('login')}
              style={({ pressed }) => [
                styles.modeToggleButton,
                {
                  backgroundColor:
                    mode === 'login' ? theme.accentBlue : theme.backgroundElement,
                  borderColor: theme.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}>
              <ThemedText
                type="smallBold"
                style={[
                  styles.modeToggleText,
                  { color: mode === 'login' ? '#FFFFFF' : theme.text },
                ]}>
                Login
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => setMode('signup')}
              style={({ pressed }) => [
                styles.modeToggleButton,
                {
                  backgroundColor:
                    mode === 'signup' ? theme.accentBlue : theme.backgroundElement,
                  borderColor: theme.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}>
              <ThemedText
                type="smallBold"
                style={[
                  styles.modeToggleText,
                  { color: mode === 'signup' ? '#FFFFFF' : theme.text },
                ]}>
                Sign up
              </ThemedText>
            </Pressable>
          </View>

          {mode === 'signup' ? (
            <>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Name"
                placeholderTextColor={theme.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Email"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!isLoading}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Username"
                placeholderTextColor={theme.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Phone (optional)"
                placeholderTextColor={theme.textMuted}
                value={phone}
                onChangeText={setPhone}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </>
          ) : (
            <>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Email"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!isLoading}
              />
            </>
          )}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={theme.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          {error ? (
            <ThemedText themeColor="accentRed" type="small" style={styles.error}>
              {error}
            </ThemedText>
          ) : null}

          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: theme.accentBlue,
                opacity: isLoading ? 0.6 : pressed ? 0.9 : 1,
              },
            ]}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.buttonText}>
                {mode === 'login' ? 'Sign in' : 'Sign up'}
              </ThemedText>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <ThemedText type="small" themeColor="textMuted" style={styles.dividerText}>
              or
            </ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <Pressable
            onPress={signInWithGoogle}
            disabled={!isGoogleReady || isLoading || !isGoogleConfigured}
            style={({ pressed }) => [
              styles.button,
              styles.googleButton,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
                opacity: !isGoogleConfigured || !isGoogleReady || isLoading ? 0.6 : pressed ? 0.9 : 1,
              },
            ]}>
            <ThemedText type="smallBold" style={styles.googleButtonText}>
              Sign in with Google
            </ThemedText>
          </Pressable>

          {!isGoogleConfigured ? (
            <ThemedText type="small" themeColor="textMuted" style={styles.hint}>
              Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID and EXPO_PUBLIC_FIREBASE_* to enable Google Sign-In with Firebase.
            </ThemedText>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    gap: Spacing.three,
  },
  title: {
    marginBottom: Spacing.one,
  },
  subtitle: {
    marginBottom: Spacing.two,
  },
  modeToggleRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  modeToggleButton: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeToggleText: {
    fontSize: 14,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  error: {
    marginTop: Spacing.one,
  },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    textTransform: 'lowercase',
  },
  googleButton: {
    borderWidth: 1,
  },
  googleButtonText: {
    color: undefined,
  },
  hint: {
    marginTop: Spacing.one,
    textAlign: 'center',
  },
});
