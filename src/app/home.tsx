import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { WidgetCustomizationModal } from "@/components/modals";
import type { WidgetConfig } from "@/components/models/home-widget";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { HomeHeader } from "@/components/ui/home";
import {
  BankAccountWidget,
  CashFlowWidget,
  CreditCardsWidget,
  NetWorthWidget,
  OthersWidget,
  SpendingSummaryWidget,
  UploadPdfWidget,
} from "@/components/widgets";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { fetchHomeDashboard } from "@/store/slices/homeSlice";
import {
  DEFAULT_WIDGETS,
  selectWidgets,
  setWidgets,
} from "@/store/slices/widgetsSlice";

const EMPTY_CASH_FLOW_ENTRIES = [
  { label: "Incoming", amount: 0, tone: "positive" as const },
  { label: "Outgoing", amount: 0, tone: "negative" as const },
  { label: "Invested", amount: 0, tone: "neutral" as const },
  { label: "Left", amount: 0, tone: "neutral" as const },
];

function sortByOrder(widgets: WidgetConfig[]) {
  return [...widgets].sort((a, b) => a.order - b.order);
}

function getHiddenCount(widgets: WidgetConfig[]) {
  return widgets.filter((w) => !w.isVisible).length;
}

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const appDispatch = useAppDispatch();
  const safeAreaInsets = useSafeAreaInsets();
  const userName = useAppSelector((state) => state.user.name) || "User";
  const specificId = useAppSelector((state) => state.user.specificId);
  const token = useAppSelector((state) => state.user.token);
  const homeDashboard = useAppSelector((state) => state.home.data);
  const homeStatus = useAppSelector((state) => state.home.status);
  const homeError = useAppSelector((state) => state.home.error);

  const appWidgets = useAppSelector(selectWidgets);
  const widgetsSorted = React.useMemo(
    () => sortByOrder(appWidgets),
    [appWidgets],
  );
  const visibleWidgets = React.useMemo(
    () => widgetsSorted.filter((w) => w.isVisible),
    [widgetsSorted],
  );
  const hiddenCount = React.useMemo(
    () => getHiddenCount(widgetsSorted),
    [widgetsSorted],
  );

  const [isCustomizeOpen, setIsCustomizeOpen] = React.useState(false);
  const [draftWidgets, setDraftWidgets] =
    React.useState<WidgetConfig[]>(widgetsSorted);

  React.useEffect(() => {
    if (!token) return;
    void appDispatch(fetchHomeDashboard());
  }, [appDispatch, token]);

  function openCustomize() {
    setDraftWidgets(widgetsSorted);
    setIsCustomizeOpen(true);
  }

  function closeCustomize() {
    setIsCustomizeOpen(false);
  }

  function saveCustomize() {
    appDispatch(setWidgets(draftWidgets));
    setIsCustomizeOpen(false);
  }

  function resetCustomize() {
    setDraftWidgets(DEFAULT_WIDGETS);
  }

  const contentInsets = React.useMemo(
    () => ({
      top: safeAreaInsets.top + Spacing.two,
      bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.two,
      left: safeAreaInsets.left + Spacing.three,
      right: safeAreaInsets.right + Spacing.three,
    }),
    [
      safeAreaInsets.bottom,
      safeAreaInsets.left,
      safeAreaInsets.right,
      safeAreaInsets.top,
    ],
  );

  return (
    <ThemedView style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: contentInsets.top,
            paddingBottom: Spacing.three,
            paddingLeft: contentInsets.left,
            paddingRight: contentInsets.right,
          },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        decelerationRate="fast">
        <HomeHeader
          username={userName}
          unreadCount={9}
          onPressProfile={() => router.push("/profile")}
          onNotificationsPress={() => router.push("/profile")}
          onCustomizePress={openCustomize}
        />

        {visibleWidgets.map((widget) => {
          if (widget.id === "others")
            return <OthersWidget key={widget.id} onOverflowPress={() => {}} />;
          if (widget.id === "netWorth")
            return (
              <NetWorthWidget
                key={specificId ? `netWorth-${specificId}` : widget.id}
                specificId={specificId || undefined}
                userName={userName}
                total={homeDashboard?.netWorth.total ?? 0}
                chartValues={homeDashboard?.netWorth.chartValues ?? [0, 0]}
                chartLabel={homeDashboard?.netWorth.chartLabel ?? "Last 180 days"}
                monthChange={homeDashboard?.netWorth.monthChange ?? 0}
                yearChange={homeDashboard?.netWorth.yearChange ?? 0}
                balance={homeDashboard?.netWorth.balance ?? 0}
                debt={homeDashboard?.netWorth.debt ?? 0}
                isLoading={homeStatus === "loading"}
              />
            );
          if (widget.id === "uploadPdf")
            return <UploadPdfWidget key={widget.id} />;
          if (widget.id === "bankAccount")
            return (
              <BankAccountWidget
                key={widget.id}
                account={homeDashboard?.bankAccounts?.selectedAccount ?? null}
                totalLinked={homeDashboard?.bankAccounts?.totalLinked ?? 0}
                isLoading={homeStatus === "loading"}
              />
            );
          if (widget.id === "creditCards")
            return <CreditCardsWidget key={widget.id} />;
          if (widget.id === "cashFlow")
            return (
              <CashFlowWidget
                key={widget.id}
                monthLabel={
                  homeDashboard?.cashFlow.monthLabel ?? "Current month"
                }
                entries={homeDashboard?.cashFlow.entries ?? EMPTY_CASH_FLOW_ENTRIES}
                isLoading={homeStatus === "loading"}
                helperText={homeStatus === "failed" ? homeError : null}
                onOverflowPress={() => {}}
              />
            );
          if (widget.id === "spendingSummary")
            return (
              <SpendingSummaryWidget
                key={widget.id}
                monthLabel={
                  homeDashboard?.spendingSummary.monthLabel ?? "Current month"
                }
                items={homeDashboard?.spendingSummary.items ?? []}
                isLoading={homeStatus === "loading"}
                onOverflowPress={() => {}}
              />
            );
          return null;
        })}

        {hiddenCount > 0 ? (
          <Pressable
            onPress={openCustomize}
            style={({ pressed }) => pressed && styles.pressed}>
            <ThemedView
              style={[
                styles.hiddenPill,
                { backgroundColor: theme.accentBlue },
              ]}>
              <ThemedText type="smallBold" style={styles.hiddenPillText}>
                {hiddenCount} WIDGET{hiddenCount === 1 ? "" : "S"} HIDDEN
              </ThemedText>
            </ThemedView>
          </Pressable>
        ) : null}
      </ScrollView>

      <WidgetCustomizationModal
        isVisible={isCustomizeOpen}
        widgets={draftWidgets}
        onChangeWidgets={setDraftWidgets}
        onClose={closeCustomize}
        onReset={resetCustomize}
        onSave={saveCustomize}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  hiddenPill: {
    alignSelf: "flex-start",
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    marginTop: Spacing.one,
  },
  hiddenPillText: {
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
