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
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { completeStatementSetup } from "@/store/slices/userSlice";

import { API_BASE_URL } from "@/lib/apibase";

export interface UploadStatementFormProps {
  onSuccess?: () => void;
  /** If true, dispatch completeStatementSetup on success (for full-screen flow). Default true. */
  completeSetupOnSuccess?: boolean;
}

export function UploadStatementForm({
  onSuccess,
  completeSetupOnSuccess = true,
}: UploadStatementFormProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const handlePickAndUpload = useCallback(async () => {
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

      if (completeSetupOnSuccess) {
        dispatch(completeStatementSetup());
      }
      setIsUploading(false);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      setIsUploading(false);
    }
  }, [dispatch, token, password, onSuccess, completeSetupOnSuccess]);

  return (
    <View style={styles.content}>
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
  );
}

const styles = StyleSheet.create({
  content: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
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
