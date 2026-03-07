import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { WidgetConfig } from '@/components/models/home-widget';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface WidgetCustomizationModalProps {
  isVisible: boolean;
  widgets: WidgetConfig[];
  onChangeWidgets: (widgets: WidgetConfig[]) => void;
  onClose: () => void;
  onReset: () => void;
  onSave: () => void;
}

export function WidgetCustomizationModal({
  isVisible,
  widgets,
  onChangeWidgets,
  onClose,
  onReset,
  onSave,
}: WidgetCustomizationModalProps) {
  const theme = useTheme();

  function setVisibility(id: WidgetConfig['id'], isVisibleValue: boolean) {
    onChangeWidgets(widgets.map(w => (w.id === id ? { ...w, isVisible: isVisibleValue } : w)));
  }

  const sortedWidgets = React.useMemo(
    () => [...widgets].sort((a, b) => a.order - b.order),
    [widgets],
  );

  function move(id: WidgetConfig['id'], direction: 'up' | 'down') {
    const sorted = [...sortedWidgets];
    const index = sorted.findIndex(w => w.id === id);
    if (index === -1) return;
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sorted.length) return;
    const reordered = [...sorted];
    const tmp = reordered[index];
    reordered[index] = reordered[nextIndex];
    reordered[nextIndex] = tmp;
    const withOrder = reordered.map((w, idx) => ({ ...w, order: idx }));
    onChangeWidgets(withOrder);
  }

  return (
    <Modal visible={isVisible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <ThemedView style={[styles.modalSheet, { backgroundColor: theme.background }]}>
          <View style={styles.modalTopRow}>
            <Pressable onPress={onClose} style={({ pressed }) => pressed && styles.pressed}>
              <ThemedText type="smallBold">✕</ThemedText>
            </Pressable>

            <View style={styles.modalTopActions}>
              <Pressable onPress={onReset} style={({ pressed }) => pressed && styles.pressed}>
                <ThemedText type="linkPrimary">Reset</ThemedText>
              </Pressable>
              <Pressable onPress={onSave} style={({ pressed }) => pressed && styles.pressed}>
                <ThemedView style={[styles.saveButton, { backgroundColor: theme.accentBlue }]}>
                  <ThemedText type="smallBold" style={styles.saveButtonText}>
                    Save
                  </ThemedText>
                </ThemedView>
              </Pressable>
            </View>
          </View>

          <ThemedText type="subtitle" style={styles.modalTitle}>
            Customize &amp; Reorder
          </ThemedText>
          <ThemedText type="small" themeColor="textMuted" style={styles.modalSubtitle}>
            Reorder your Fold’s home screen personal finance widgets in a way that suits you the best.
          </ThemedText>

          <View style={styles.modalList}>
            {sortedWidgets.map((w, idx) => (
              <ThemedView key={w.id} type="backgroundElement" style={[styles.modalRow, { borderColor: theme.border }]}>
                <View style={styles.modalRowLeft}>
                  <MaterialCommunityIcons name="drag" size={18} color={theme.textMuted} />
                  <ThemedText type="smallBold">{w.title}</ThemedText>
                </View>

                <View style={styles.modalRowRight}>
                  <View style={styles.reorderButtons}>
                    <Pressable
                      onPress={() => move(w.id, 'up')}
                      disabled={idx === 0}
                      style={({ pressed }) => [styles.reorderButton, pressed && styles.pressed, idx === 0 && styles.disabled]}>
                      <MaterialCommunityIcons name="chevron-up" size={18} color={theme.textSecondary} />
                    </Pressable>
                    <Pressable
                      onPress={() => move(w.id, 'down')}
                      disabled={idx === sortedWidgets.length - 1}
                      style={({ pressed }) => [
                        styles.reorderButton,
                        pressed && styles.pressed,
                        idx === sortedWidgets.length - 1 && styles.disabled,
                      ]}>
                      <MaterialCommunityIcons name="chevron-down" size={18} color={theme.textSecondary} />
                    </Pressable>
                  </View>

                  <Switch
                    value={w.isVisible}
                    onValueChange={v => setVisibility(w.id, v)}
                    trackColor={{ false: theme.backgroundSelected, true: theme.accentBlue }}
                    thumbColor={w.isVisible ? theme.text : theme.textSecondary}
                  />
                </View>
              </ThemedView>
            ))}
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: Spacing.two,
  },
  modalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTopActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  saveButton: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
  modalTitle: {
    marginTop: Spacing.one,
  },
  modalSubtitle: {
    marginTop: -Spacing.one,
  },
  modalList: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  modalRow: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexShrink: 1,
  },
  modalRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  reorderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  reorderButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

