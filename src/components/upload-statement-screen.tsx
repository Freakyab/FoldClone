import * as DocumentPicker from "expo-document-picker";
import * as LegacyFileSystem from "expo-file-system/legacy";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { completeStatementSetup } from "@/store/slices/userSlice";

import { API_BASE_URL } from "@/lib/apibase";

export function UploadStatementScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const handlePickAndUpload = useCallback(async () => {
    // Capture password before opening picker; component may remount while picker is open
    const passwordToUse = password;

    try {
      setError(null);

      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];

      setIsUploading(true);
      const presignResponse = await fetch(
        `${API_BASE_URL}/api/storage/s3-upload-url`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: asset.name ?? "statement.pdf",
            password:
              passwordToUse.trim() !== "" ? passwordToUse.trim() : undefined,
            contentType: "application/pdf",
          }),
        },
      );

      const presignData = await presignResponse.json();

      if (!presignResponse.ok || !presignData.success) {
        setError(presignData.message || "Failed to prepare upload");
        setIsUploading(false);
        return;
      }

      const { uploadUrl, key } = presignData.data;

      const uploadResult = await LegacyFileSystem.uploadAsync(
        uploadUrl,
        asset.uri,
        {
          httpMethod: "PUT",
          uploadType: LegacyFileSystem.FileSystemUploadType.BINARY_CONTENT,
          headers: {
            "Content-Type": "application/pdf",
          },
        },
      );

      if (uploadResult.status !== 200 && uploadResult.status !== 201) {
        setError("Failed to upload statement to storage");
        setIsUploading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/banks/upload-statement-from-s3`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key,
            password: passwordToUse.trim() || undefined,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to process statement");
        setIsUploading(false);
        return;
      }

      dispatch(completeStatementSetup());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      setIsUploading(false);
    }
  }, [dispatch, token, password]);

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Upload your bank statement
        </ThemedText>
        <ThemedText type="small" themeColor="textMuted" style={styles.subtitle}>
          Upload a PDF bank statement to automatically import your account and
          recent transactions.
        </ThemedText>

        <ThemedText type="small" themeColor="textMuted">
          If your PDF is password protected, enter the password below. Leave it
          blank if not.
        </ThemedText>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="PDF password (optional)"
          placeholderTextColor={theme.textMuted}
          value={password}
          onChangeText={setPassword}
          // secureTextEntry={true}
        />

        {error ? (
          <ThemedText type="small" themeColor="accentRed" style={styles.error}>
            {error}
          </ThemedText>
        ) : null}

        <Pressable
          onPress={handlePickAndUpload}
          disabled={isUploading}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: theme.accentBlue,
              opacity: isUploading ? 0.6 : pressed ? 0.9 : 1,
            },
          ]}>
          {isUploading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.buttonText}>
              Choose PDF and upload
            </ThemedText>
          )}
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    marginBottom: Spacing.one,
  },
  subtitle: {
    marginBottom: Spacing.two,
  },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.two,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    marginTop: Spacing.one,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
});
