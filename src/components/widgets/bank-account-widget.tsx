import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/themed-text";
import { BaseCard, MiniBars } from "@/components/ui/home";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { formatInr } from "@/utils/format-inr";

export function BankAccountWidget() {
  const theme = useTheme();
  const formattedBalance = formatInr(4245.9);
  const [wholeAmount, fractionAmount] = formattedBalance.split(".");

  return (
    <BaseCard style={styles.card}>
      <View style={styles.bankHeader}>
        <View style={styles.bankBrand}>
          <View style={[styles.bankLogo, { backgroundColor: theme.accentRed }]}>
            <ThemedText type="small" style={styles.logoText}>
              I
            </ThemedText>
          </View>
          <View>
            <ThemedText type="default" style={styles.bankName}>
              ICICI BANK
            </ThemedText>
            <ThemedText type="small" themeColor="textMuted">
              ****7597
            </ThemedText>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            { borderColor: theme.accentBlue },
            pressed && styles.pressed,
          ]}>
          <AppIcon name="settings" size={18} color={theme.accentBlue} />
        </Pressable>
      </View>

      <View style={styles.balanceSection}>
        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={styles.balanceLabel}>
          Current Balance
        </ThemedText>
        <View style={styles.amountRow}>
          <ThemedText type="title" style={styles.balanceAmount}>
            {wholeAmount}
          </ThemedText>
          {fractionAmount && (
            <ThemedText type="subtitle" style={styles.balanceAmountFraction}>
              .{fractionAmount}
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.chartContainer}>
        <MiniBars
          values={[2, 3, 3, 2, 4, 6, 5, 4, 6, 7, 6, 9, 14, 18, 26]}
          height={60}
          color="#22C55E"
        />
      </View>

      <View style={styles.dateMarkers}>
        <ThemedText type="small" themeColor="textMuted">
          JAN. 28
        </ThemedText>
        <ThemedText type="small" themeColor="textMuted">
          FEB. 27
        </ThemedText>
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111111",
    borderRadius: 18,
    padding: Spacing.three,
    borderWidth: 0,
  },
  pressed: {
    opacity: 0.7,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bankHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
  },
  bankBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  bankLogo: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "white",
    fontWeight: "bold",
  },
  bankName: {
    color: "white",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  balanceSection: {
    marginBottom: Spacing.three,
  },
  balanceLabel: {
    marginBottom: Spacing.one,
    color: "#9CA3AF",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  balanceAmount: {
    color: "white",
    fontSize: 32,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  balanceAmountFraction: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 2,
    marginBottom: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#27272f",
    marginBottom: Spacing.two,
  },
  chartContainer: {
    marginBottom: Spacing.three,
    height: 60,
  },
  dateMarkers: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.one,
  },
});
