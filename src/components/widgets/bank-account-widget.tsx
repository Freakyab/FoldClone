import React from "react";
import { StyleSheet, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/themed-text";
import { BaseCard, MiniBars } from "@/components/ui/home";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { SelectedBankAccount } from "@/store/slices/homeSlice";

import { formatInr } from "@/utils/format-inr";
import { getBankBrand } from "@/utils/get-bank-brand";

export interface BankAccountWidgetProps {
  account?: SelectedBankAccount | null;
  totalLinked?: number;
  isLoading?: boolean;
}

export function BankAccountWidget({
  account = null,
  totalLinked = 0,
  isLoading = false,
}: BankAccountWidgetProps) {
  const theme = useTheme();
  const formattedBalance = formatInr(account?.currentBalance ?? 0);
  const [wholeAmount, fractionAmount] = formattedBalance.split(".");
  const bankBrand = getBankBrand(account?.bankName);
  const chartValues =
    account?.chartValues && account.chartValues.length > 0
      ? account.chartValues
      : [0, 0, 0, 0];

  return (
    <BaseCard
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}>
      <View style={styles.bankHeader}>
        <View style={styles.bankBrand}>
          <View
            style={[
              styles.bankLogo,
              { backgroundColor: bankBrand.backgroundColor },
            ]}>
            <ThemedText type="small" style={styles.logoText}>
              {bankBrand.label}
            </ThemedText>
          </View>
          <View>
            <ThemedText type="default" style={styles.bankName}>
              {account?.bankName ?? "Linked accounts"}
            </ThemedText>
            <ThemedText type="small" themeColor="textMuted">
              {isLoading
                ? "Loading account details..."
                : account?.maskedAccountNumber ?? "No linked account yet"}
            </ThemedText>
          </View>
        </View>
        <View
          style={[
            styles.linkedPill,
            {
              backgroundColor: theme.backgroundSelected,
              borderColor: theme.border,
            },
          ]}>
          <AppIcon name="building-2" size={14} color={theme.textMuted} />
          <ThemedText type="small" themeColor="textMuted">
            {totalLinked} linked
          </ThemedText>
        </View>
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

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.chartContainer}>
        <MiniBars values={chartValues} height={60} color={theme.accentGreen} />
      </View>

      <View style={styles.dateMarkers}>
        <ThemedText type="small" themeColor="textMuted">
          {account?.startLabel ?? "N/A"}
        </ThemedText>
        <ThemedText type="small" themeColor="textMuted">
          {account?.endLabel ?? "TODAY"}
        </ThemedText>
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
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
  linkedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
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
    fontSize: 16,
    letterSpacing: 0.5,
  },
  balanceSection: {
    marginBottom: Spacing.three,
  },
  balanceLabel: {
    marginBottom: Spacing.one,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  balanceAmountFraction: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 2,
    marginBottom: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
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
