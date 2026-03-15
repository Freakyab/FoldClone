import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon } from "@/components/ui/app-icon";
import { BaseCard } from "@/components/ui/home";
import { UploadStatementForm } from "@/components/upload-statement-form";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export interface UploadPdfWidgetProps {
  onPress?: () => void;
}

export function UploadPdfWidget({ onPress }: UploadPdfWidgetProps) {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  function openModal() {
    onPress?.();
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  function handleUploadSuccess() {
    closeModal();
  }

  return (
    <>
      <Pressable onPress={openModal} style={({ pressed }) => pressed && styles.pressed}>
        <BaseCard>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <AppIcon name="file-text" size={16} color={theme.textSecondary} />
              <ThemedText type="smallBold">Upload PDF</ThemedText>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.textMuted} />
          </View>
          <ThemedText type="small" themeColor="textMuted" style={styles.subtitle}>
            Upload a bank statement PDF to import accounts and transactions.
          </ThemedText>
        </BaseCard>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}>
        <View style={styles.modalBackdrop}>
          <ThemedView style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle">Upload bank statement</ThemedText>
              <Pressable onPress={closeModal} style={({ pressed }) => pressed && styles.pressed}>
                <AppIcon name="x" size={18} color={theme.text} />
              </Pressable>
            </View>
            <ThemedText type="small" themeColor="textMuted" style={styles.modalSubtitle}>
              Upload a PDF bank statement to automatically import your account and recent transactions.
            </ThemedText>
            <UploadStatementForm
              completeSetupOnSuccess
              onSuccess={handleUploadSuccess}
            />
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  subtitle: {
    marginTop: Spacing.one,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.two,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalSubtitle: {
    marginTop: -Spacing.one,
  },
});
