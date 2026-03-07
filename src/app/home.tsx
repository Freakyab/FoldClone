import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppSelector } from "@/store/hooks";
import { WidgetCustomizationModal } from "@/components/modals";
import type { WidgetConfig } from "@/components/models/home-widget";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { HomeHeader } from "@/components/ui/home";
import {
  BankAccountWidget,
  CreditCardsWidget,
  NetWorthWidget,
  OthersWidget,
  SpendingSummaryWidget,
  UploadPdfWidget,
} from "@/components/widgets";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "others", title: "Others", isVisible: true, order: 0 },
  { id: "netWorth", title: "Net worth", isVisible: true, order: 1 },
  { id: "uploadPdf", title: "Upload PDF", isVisible: true, order: 2 },
  { id: "bankAccount", title: "Bank account", isVisible: true, order: 3 },
  { id: "creditCards", title: "Credit cards", isVisible: true, order: 4 },
  {
    id: "spendingSummary",
    title: "Spending summary",
    isVisible: true,
    order: 5,
  },
];

function sortByOrder(widgets: WidgetConfig[]) {
  return [...widgets].sort((a, b) => a.order - b.order);
}

function getHiddenCount(widgets: WidgetConfig[]) {
  return widgets.filter((w) => !w.isVisible).length;
}

type HomeAction =
  | { type: "setAll"; widgets: WidgetConfig[] }
  | { type: "reset" }
  | { type: "toggleVisible"; id: WidgetConfig["id"]; isVisible: boolean }
  | { type: "move"; id: WidgetConfig["id"]; direction: "up" | "down" };

interface HomeState {
  widgets: WidgetConfig[];
}

function homeReducer(state: HomeState, action: HomeAction): HomeState {
  if (action.type === "reset") return { widgets: DEFAULT_WIDGETS };

  if (action.type === "setAll") {
    const widgets = action.widgets.map((w, idx) => ({ ...w, order: idx }));
    return { widgets };
  }

  if (action.type === "toggleVisible") {
    return {
      widgets: state.widgets.map((w) =>
        w.id === action.id ? { ...w, isVisible: action.isVisible } : w,
      ),
    };
  }

  if (action.type === "move") {
    const sorted = sortByOrder(state.widgets);
    const index = sorted.findIndex((w) => w.id === action.id);
    if (index === -1) return state;

    const nextIndex = action.direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sorted.length) return state;

    const updated = [...sorted];
    const tmp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = tmp;

    return { widgets: updated.map((w, idx) => ({ ...w, order: idx })) };
  }

  return state;
}

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const userName = useAppSelector((state) => state.user.name) || "User";

  const [state, dispatch] = React.useReducer(homeReducer, {
    widgets: DEFAULT_WIDGETS,
  });
  const widgetsSorted = React.useMemo(
    () => sortByOrder(state.widgets),
    [state.widgets],
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

  function openCustomize() {
    setDraftWidgets(widgetsSorted);
    setIsCustomizeOpen(true);
  }

  function closeCustomize() {
    setIsCustomizeOpen(false);
  }

  function saveCustomize() {
    dispatch({ type: "setAll", widgets: draftWidgets });
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
            return <NetWorthWidget key={widget.id} />;
          if (widget.id === "uploadPdf")
            return <UploadPdfWidget key={widget.id} />;
          if (widget.id === "bankAccount")
            return <BankAccountWidget key={widget.id} />;
          if (widget.id === "creditCards")
            return <CreditCardsWidget key={widget.id} />;
          if (widget.id === "spendingSummary")
            return (
              <SpendingSummaryWidget
                key={widget.id}
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
