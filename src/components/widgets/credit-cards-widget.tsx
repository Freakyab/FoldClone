import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { BaseCard, ProgressBar, WidgetHeader } from "@/components/ui/home";
import { Spacing } from "@/constants/theme";

import { formatInr } from "../../utils/format-inr";

export function CreditCardsWidget() {
  return (
    <BaseCard>
      <WidgetHeader
        title="Credit Cards"
        right={
          <View style={styles.creditRight}>
            <ThemedText type="smallBold">VISA</ThemedText>
            <ThemedText type="small" themeColor="textMuted">
              **5007
            </ThemedText>
          </View>
        }
      />

      <View style={styles.creditBody}>
        <View style={styles.rowText}>
          <ThemedText type="small" themeColor="textSecondary">
            Outstanding
          </ThemedText>
          <ThemedText type="subtitle" style={styles.amountTight}>
            {formatInr(586.75)}
          </ThemedText>
        </View>

        <View style={styles.creditMeta}>
          <ThemedText type="small" themeColor="textMuted">
            Utilisation
          </ThemedText>
          <ThemedText type="smallBold">1.18%</ThemedText>
        </View>

        <ProgressBar value={0.0118} />
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  rowText: {
    gap: Spacing.half,
    flexShrink: 1,
  },
  amountTight: {
    marginTop: -2,
  },
  creditRight: {
    alignItems: "flex-end",
    gap: Spacing.half,
  },
  creditBody: {
    gap: Spacing.two,
  },
  creditMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
