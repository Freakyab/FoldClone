import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { UploadStatementForm } from "@/components/upload-statement-form";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export function UploadStatementScreen() {
  const theme = useTheme();

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
        <UploadStatementForm completeSetupOnSuccess />
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
});
