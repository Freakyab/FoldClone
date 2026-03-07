import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { BaseCard, MiniLine, OverflowButton } from "@/components/ui/home";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { othersData } from "../../types/others-data";
import { formatInr } from "../../utils/format-inr";

export interface OthersWidgetProps {
  onOverflowPress: () => void;
}

export function OthersWidget({ onOverflowPress }: OthersWidgetProps) {
  const theme = useTheme();
  const formattedCash = formatInr(othersData.cashAmount);

  return (
    <BaseCard>
      {/* Header row: wallet icon + title + overflow button */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="wallet-outline"
            size={16}
            color={theme.textSecondary}
          />
          <ThemedText type="smallBold">Others</ThemedText>
        </View>
        <OverflowButton
          onPress={onOverflowPress}
          accessibilityLabel="Others menu"
        />
      </View>

      {/* Inner inset card */}
      <View
        style={[
          styles.innerCard,
          { backgroundColor: theme.backgroundSelected },
        ]}>
        {/* Credit card icon + "Cash on hand" label */}
        <View style={styles.labelRow}>
          <MaterialCommunityIcons
            name="credit-card-outline"
            size={16}
            color={theme.textMuted}
          />
          <ThemedText type="small" themeColor="textMuted">
            Cash on hand
          </ThemedText>
        </View>

        {/* Amount + green sparkline */}
        <View style={styles.rowBetween}>
          <ThemedText style={styles.amount}>{formattedCash}</ThemedText>
          <View style={styles.sparklineContainer}>
            <MiniLine values={othersData.sparklineValues} height={32} />
          </View>
        </View>
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
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
  innerCard: {
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  sparklineContainer: {
    flex: 1,
    maxWidth: 90,
    marginLeft: Spacing.three,
  },
});
