import * as DocumentPicker from "expo-document-picker";
import * as LegacyFileSystem from "expo-file-system/legacy";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveJob, selectIsStatementJobActive } from "@/store/slices/statementJobSlice";
import { completeStatementSetup } from "@/store/slices/userSlice";

import { API_BASE_URL } from "@/lib/apibase";

export interface UploadStatementFormProps {
  onSuccess?: () => void;
  /** If true, dispatch completeStatementSetup on success (for full-screen flow). Default true. */
  completeSetupOnSuccess?: boolean;
}

interface SavedStatementPassword {
  _id: string;
  bankName: string;
  accountNumber?: string | null;
  password: string;
}

function maskAccountNumber(accountNumber: string | null | undefined): string {
  if (!accountNumber || typeof accountNumber !== "string") return "••••";
  const trimmed = accountNumber.trim();
  if (trimmed.length <= 4) return "****";
  const last4 = trimmed.slice(-4);
  return "****" + last4;
}

export function UploadStatementForm({
  onSuccess,
  completeSetupOnSuccess = true,
}: UploadStatementFormProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);
  const isStatementJobActive = useAppSelector(selectIsStatementJobActive);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [savedPasswords, setSavedPasswords] = useState<SavedStatementPassword[]>([]);
  const [isLoadingSavedPasswords, setIsLoadingSavedPasswords] = useState(false);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    const loadSavedPasswords = async () => {
      try {
        setIsLoadingSavedPasswords(true);
        const res = await fetch(`${API_BASE_URL}/api/banks/saved-passwords`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.success && Array.isArray(data.data)) {
          setSavedPasswords(data.data);
        }
      } catch {
        // Keep silent; this is optional convenience data.
      } finally {
        if (!cancelled) setIsLoadingSavedPasswords(false);
      }
    };

    void loadSavedPasswords();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handlePickAndUpload = useCallback(async () => {
    const passwordToUse = password;

    try {
      setError(null);

      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        return;
      }

      if (isStatementJobActive) {
        setError("A statement is already being processed. Please wait.");
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

      if (response.status === 202 && data.data?.jobId) {
        dispatch(setActiveJob({ jobId: data.data.jobId, status: "pending" }));
        setIsUploading(false);
        onSuccess?.();
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
  }, [dispatch, token, password, onSuccess, completeSetupOnSuccess, isStatementJobActive]);

  const handleDeleteSavedPassword = useCallback(
    async (id: string) => {
      if (!token) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/banks/saved-passwords/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          setSavedPasswords((prev) => prev.filter((p) => p._id !== id));
        }
      } catch {
        // Keep silent; user can retry
      }
    },
    [token],
  );

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

      {isLoadingSavedPasswords ? (
        <ThemedText type="small" themeColor="textMuted">
          Loading saved passwords...
        </ThemedText>
      ) : null}

      {savedPasswords.length > 0 ? (
        <View style={styles.savedPasswordsWrap}>
          <ThemedText type="small" themeColor="textMuted">
            Saved passwords (tap to autofill):
          </ThemedText>
          <View style={styles.savedPasswordList}>
            {savedPasswords.map((item) => (
              <View key={item._id} style={styles.savedPasswordItemRow}>
                <Pressable
                  onPress={() => setPassword(item.password)}
                  style={({ pressed }) => [
                    styles.savedPasswordItem,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.backgroundElement,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}>
                  <View style={styles.savedPasswordItemInner}>
                    <AppIcon
                      name="building-2"
                      size={22}
                      color={theme.textSecondary}
                      style={styles.savedPasswordIcon}
                    />
                    <View style={styles.savedPasswordTextWrap}>
                      <ThemedText type="smallBold">{item.bankName}</ThemedText>
                      <ThemedText type="small" themeColor="textMuted">
                        {maskAccountNumber(item.accountNumber)}
                      </ThemedText>
                    </View>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => handleDeleteSavedPassword(item._id)}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.savedPasswordDeleteBtn,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                  accessibilityLabel="Remove saved password">
                  <AppIcon
                    name="x"
                    size={20}
                    color={theme.textMuted}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {error ? (
        <ThemedText type="small" themeColor="accentRed" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}

      <Pressable
        onPress={handlePickAndUpload}
        disabled={isUploading || isStatementJobActive}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.accentBlue,
            opacity: isUploading || isStatementJobActive ? 0.6 : pressed ? 0.9 : 1,
          },
        ]}>
        {isUploading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : isStatementJobActive ? (
          <ThemedText style={styles.buttonText}>
            Processing in progress…
          </ThemedText>
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
  savedPasswordsWrap: {
    gap: Spacing.one,
  },
  savedPasswordList: {
    gap: Spacing.one,
  },
  savedPasswordItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  savedPasswordItem: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  savedPasswordItemInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  savedPasswordIcon: {
    marginRight: Spacing.two,
  },
  savedPasswordTextWrap: {
    flex: 1,
    gap: 2,
  },
  savedPasswordDeleteBtn: {
    padding: Spacing.two,
    justifyContent: "center",
    alignItems: "center",
  },
});
