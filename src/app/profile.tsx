import { signOut } from "firebase/auth";
import React from "react";
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  BottomTabInset,
  Colors,
  MaxContentWidth,
  Spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/slices/userSlice";

interface User {
  username: string;
  avatarUrl?: string;
}

interface CreditScore {
  value: number | null;
  status: "not_fetched" | "loading" | "fetched" | "error";
}

interface Connections {
  bankAccounts: number;
  creditCards: number;
  investments: number;
  creditReports: number;
}

interface Statistics {
  taggedPercentage: number;
  merchantPercentage: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.user);

  const user: User = {
    username: reduxUser.username ? `@${reduxUser.username}` : "@guest",
  };

  async function handleLogout() {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
    dispatch(logoutUser());
  }

  const creditScore: CreditScore = {
    value: null,
    status: "not_fetched",
  };

  const connections: Connections = {
    bankAccounts: 2,
    creditCards: 1,
    investments: 0,
    creditReports: 0,
  };

  const statistics: Statistics = {
    taggedPercentage: 100,
    merchantPercentage: 99,
  };

  function handleNotImplemented(message: string) {
    Alert.alert("Coming soon", message);
  }

  return (
    <ThemedView style={styles.container} type="background">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <AppHeader
            title="Profile"
            onBack={() => router.back()}
            onSettings={() =>
              handleNotImplemented("Settings screen is not implemented yet.")
            }
          />

          <UserProfileCard
            user={user}
            onPress={() =>
              handleNotImplemented("Profile details are not implemented yet.")
            }
          />

          <ThemedView type="backgroundElement" style={styles.card}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => pressed && styles.pressed}>
              <ThemedText type="smallBold" themeColor="accentRed">
                Log out
              </ThemedText>
            </Pressable>
          </ThemedView>

          {/* Credit score card is not implemented yet */}
          {/* <CreditScoreCard
            creditScore={creditScore}
            onFetch={() => handleNotImplemented('Credit score flow is not implemented yet.')}
          /> */}
          {/* Action row is not implemented yet */}
          {/* <ActionRow
            onInvite={() => handleNotImplemented('Invite flow is not implemented yet.')}
            onContacts={() => handleNotImplemented('Contacts screen is not implemented yet.')}
          /> */}

          <SecureConnectionsSection
            connections={connections}
            onPressCard={(title) =>
              handleNotImplemented(
                `${title} management screen is not implemented yet.`,
              )
            }
          />

          <StatisticsSection
            statistics={statistics}
            onPressMerchantAnalytics={() =>
              handleNotImplemented("Merchant analytics is not implemented yet.")
            }
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

interface AppHeaderProps {
  title: string;
  onBack: () => void;
  onSettings: () => void;
}

function AppHeader({ title, onBack, onSettings }: AppHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.headerRow}>
      <ThemedText onPress={onBack} type="smallBold" themeColor="textSecondary">
        X
      </ThemedText>
      <ThemedText type="smallBold">{title}</ThemedText>
      <ThemedText
        onPress={onSettings}
        type="smallBold"
        themeColor="textSecondary"
        style={styles.settingsText}>
        ⚙
      </ThemedText>
    </View>
  );
}

interface UserProfileCardProps {
  user: User;
  onPress: () => void;
}

function UserProfileCard({ user, onPress }: UserProfileCardProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.profileRow}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor:
                theme.avatarBackground ?? Colors.dark.avatarBackground,
            },
          ]}>
          <ThemedText type="smallBold">
            {user.username.charAt(1).toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.profileTextContainer}>
          <ThemedText type="smallBold">{user.username}</ThemedText>
        </View>
        <ThemedText
          type="smallBold"
          themeColor="textSecondary"
          onPress={onPress}>
          &gt;
        </ThemedText>
      </View>
    </ThemedView>
  );
}

interface CreditScoreCardProps {
  creditScore: CreditScore;
  onFetch: () => void;
}

function CreditScoreCard({ creditScore, onFetch }: CreditScoreCardProps) {
  const theme = useTheme();

  let label = "Not fetched yet, tap to begin";
  if (creditScore.status === "loading") {
    label = "Fetching your credit score...";
  } else if (creditScore.status === "error") {
    label = "Something went wrong, tap to retry";
  } else if (creditScore.status === "fetched") {
    label = "Your Equifax credit score";
  }

  const scoreDisplay =
    creditScore.value === null ? "000" : String(creditScore.value);

  return (
    <ThemedView
      type="backgroundElement"
      style={styles.card}
      onTouchEnd={onFetch}>
      <View style={styles.creditRow}>
        <View style={styles.creditTextColumn}>
          <ThemedText type="small" themeColor="textSecondary">
            credit score
          </ThemedText>
          <ThemedText type="subtitle">{scoreDisplay}</ThemedText>
          <ThemedText type="small" themeColor="textMuted">
            {label}
          </ThemedText>
        </View>
        <View style={styles.equifaxBadge}>
          <ThemedText type="smallBold" themeColor="accentRed">
            Equifax
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

interface ActionRowProps {
  onInvite: () => void;
  onContacts: () => void;
}

function ActionRow({ onInvite, onContacts }: ActionRowProps) {
  return (
    <View style={styles.actionRow}>
      <ActionButton label="Invite" variant="primary" onPress={onInvite} />
      <ActionButton label="Contacts" variant="secondary" onPress={onContacts} />
    </View>
  );
}

interface ActionButtonProps {
  label: string;
  variant: "primary" | "secondary";
  onPress: () => void;
}

function ActionButton({ label, variant, onPress }: ActionButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === "primary";

  return (
    <ThemedView
      type="backgroundElement"
      style={[
        styles.actionButton,
        isPrimary && {
          borderColor: theme.accentBlue ?? Colors.dark.accentBlue,
          borderWidth: 1,
        },
      ]}
      onTouchEnd={onPress}>
      <ThemedText
        type="smallBold"
        themeColor={isPrimary ? "accentBlue" : "textSecondary"}
        style={styles.actionButtonText}>
        {label}
      </ThemedText>
    </ThemedView>
  );
}

interface SecureConnectionsSectionProps {
  connections: Connections;
  onPressCard: (title: string) => void;
}

function SecureConnectionsSection({
  connections,
  onPressCard,
}: SecureConnectionsSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      <ThemedText type="smallBold">Secure connections</ThemedText>
      <View style={styles.grid}>
        <ConnectionMetricCard
          title="Bank accounts"
          count={connections.bankAccounts}
          onPress={() => onPressCard("Bank accounts")}
        />
        <ConnectionMetricCard
          title="Credit cards"
          count={connections.creditCards}
          onPress={() => onPressCard("Credit cards")}
        />
        <ConnectionMetricCard
          title="Investments"
          count={connections.investments}
          onPress={() => onPressCard("Investments")}
        />
        <ConnectionMetricCard
          title="Credit reports"
          count={connections.creditReports}
          onPress={() => onPressCard("Credit reports")}
        />
      </View>
    </View>
  );
}

interface ConnectionMetricCardProps {
  title: string;
  count: number;
  onPress: () => void;
}

function ConnectionMetricCard({
  title,
  count,
  onPress,
}: ConnectionMetricCardProps) {
  const theme = useTheme();
  const isActive = count > 0;

  return (
    <ThemedView
      type="backgroundElement"
      style={[
        styles.metricCard,
        !isActive && {
          borderColor: theme.divider ?? Colors.dark.divider,
          borderWidth: 1,
        },
      ]}
      onTouchEnd={onPress}>
      <ThemedText type="smallBold">{count}</ThemedText>
      <ThemedText
        type="small"
        themeColor={isActive ? "textSecondary" : "textMuted"}>
        {title}
      </ThemedText>
    </ThemedView>
  );
}

interface StatisticsSectionProps {
  statistics: Statistics;
  onPressMerchantAnalytics: () => void;
}

function StatisticsSection({
  statistics,
  onPressMerchantAnalytics,
}: StatisticsSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      <ThemedText type="smallBold">Statistics</ThemedText>
      <View style={styles.sectionGap}>
        <StatisticCard
          percentage={statistics.taggedPercentage}
          label="Transactions tagged"
          clickable={false}
        />
        <StatisticCard
          percentage={statistics.merchantPercentage}
          label="Transactions have merchants"
          clickable
          onPress={onPressMerchantAnalytics}
        />
      </View>
    </View>
  );
}

interface StatisticCardProps {
  percentage: number;
  label: string;
  clickable?: boolean;
  onPress?: () => void;
}

function StatisticCard({
  percentage,
  label,
  clickable,
  onPress,
}: StatisticCardProps) {
  const theme = useTheme();

  return (
    <ThemedView
      type="backgroundElement"
      style={styles.statCard}
      onTouchEnd={clickable ? onPress : undefined}>
      <ThemedText type="subtitle">{percentage}%</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      {clickable && (
        <ThemedText
          type="small"
          themeColor="accentBlue"
          style={styles.statLink}>
          View details
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  content: {
    flex: 1,
    gap: Spacing.three,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.two,
  },
  settingsText: {
    textAlign: "right",
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  profileTextContainer: {
    flex: 1,
  },
  creditRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  creditTextColumn: {
    gap: Spacing.one,
  },
  equifaxBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  actionRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  actionButton: {
    flex: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    textTransform: "uppercase",
  },
  sectionContainer: {
    gap: Spacing.two,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  metricCard: {
    flexBasis: "48%",
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  sectionGap: {
    gap: Spacing.two,
  },
  statCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  statLink: {
    marginTop: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});
