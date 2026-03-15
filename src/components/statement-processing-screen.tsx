import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon } from "@/components/ui/app-icon";
import { API_BASE_URL } from "@/lib/apibase";
import { notifyStatementProcessed } from "@/lib/notifications";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearActiveJob,
  selectIsStatementJobActive,
  updateJobStatus,
  type StatementJobResult,
} from "@/store/slices/statementJobSlice";
import { fetchHomeDashboard } from "@/store/slices/homeSlice";
import { completeStatementSetup } from "@/store/slices/userSlice";

const POLL_INTERVAL_MS = 4000;
const DEFAULT_EXPECTED_TIME_SEC = 90;

export function StatementProcessingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);
  const { activeJobId, status, result, error, startedAt } = useAppSelector(
    (state) => state.statementJob,
  );
  const isActive = useAppSelector(selectIsStatementJobActive);

  const [elapsedSec, setElapsedSec] = useState(0);
  const [expectedDurationSec, setExpectedDurationSec] = useState(DEFAULT_EXPECTED_TIME_SEC);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollJob = useCallback(async () => {
    if (!activeJobId || !token) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/jobs/${activeJobId}?t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          cache: "no-store",
        },
      );
      const data = await res.json();

      if (!data.success || !data.data) return;

      const {
        status: jobStatus,
        result: jobResult,
        error: jobError,
        expectedDurationSec: apiExpectedSec,
      } = data.data;

      if (typeof apiExpectedSec === "number" && apiExpectedSec > 0) {
        setExpectedDurationSec(apiExpectedSec);
      }

      dispatch(
        updateJobStatus({
          status: jobStatus,
          result: jobResult as StatementJobResult | null,
          error: jobError ?? null,
        }),
      );

      if (jobStatus === "completed" || jobStatus === "failed") {
        const txCount = (jobResult as StatementJobResult)?.transactionsCreated;
        await notifyStatementProcessed(
          jobStatus === "completed",
          txCount,
          jobError,
        );
        if (jobStatus === "completed") {
          dispatch(completeStatementSetup());
          void dispatch(fetchHomeDashboard());
        }
        // Do not clear here; user sees result card and taps "View dashboard" / "Try again"
      }
    } catch {
      // Keep polling on network error
    }
  }, [activeJobId, token, dispatch]);

  useEffect(() => {
    if (activeJobId) setExpectedDurationSec(DEFAULT_EXPECTED_TIME_SEC);
  }, [activeJobId]);

  useEffect(() => {
    if (!isActive || !activeJobId) return;

    pollJob();
    pollRef.current = setInterval(pollJob, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [isActive, activeJobId, pollJob]);

  useEffect(() => {
    if (!isActive || startedAt == null) return;

    const tick = () =>
      setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    elapsedRef.current = setInterval(tick, 1000);

    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      elapsedRef.current = null;
    };
  }, [isActive, startedAt]);

  const expectedMins = Math.ceil(expectedDurationSec / 60);
  const progress = Math.min(100, (elapsedSec / expectedDurationSec) * 100);

  if (!activeJobId && !result && !error) return null;

  const isFailed = status === "failed" || (!!error && !isActive);

  return (
    <ThemedView
      style={[
        styles.container,
        { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom + Spacing.four },
      ]}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: theme.backgroundElement,
              ...(isFailed ? { borderWidth: 2, borderColor: theme.accentRed } : {}),
            },
          ]}>
          <AppIcon
            name={isFailed ? "alert-circle" : "file-text"}
            size={48}
            color={isFailed ? theme.accentRed : theme.accentBlue}
          />
        </View>

        <ThemedText type="title" style={styles.title}>
          {isFailed ? "Processing failed" : "Processing your statement"}
        </ThemedText>
        <ThemedText type="small" themeColor="textMuted" style={styles.subtitle}>
          {isFailed
            ? "Something went wrong while parsing your statement."
            : `We're extracting your account and transactions. This usually takes about ${expectedMins} minute${expectedMins > 1 ? "s" : ""}.`}
        </ThemedText>

        {isActive && (
          <>
            <View style={[styles.progressWrap, { backgroundColor: theme.backgroundElement }]}>
              <View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: theme.accentBlue,
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
            <ThemedText type="small" themeColor="textMuted" style={styles.elapsed}>
              {Math.floor(elapsedSec / 60)}:{(elapsedSec % 60).toString().padStart(2, "0")} elapsed
            </ThemedText>
            <View style={styles.spinnerWrap}>
              <ActivityIndicator size="large" color={theme.accentBlue} />
            </View>
          </>
        )}

        {status === "completed" && result && (
          <View style={[styles.resultCard, { backgroundColor: theme.successSoft }]}>
            <AppIcon name="check-circle" size={24} color={theme.accentGreen} />
            <View style={styles.resultText}>
              <ThemedText type="smallBold" style={{ color: theme.accentGreen }}>
                Done
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {result.transactionsCreated ?? 0} transaction(s) imported.
                {result.transactionsSkippedDuplicate
                  ? ` ${result.transactionsSkippedDuplicate} duplicate(s) skipped.`
                  : ""}
              </ThemedText>
            </View>
          </View>
        )}

        {isFailed && (
          <View style={[styles.resultCard, { backgroundColor: theme.dangerSoft }]}>
            <AppIcon name="alert-circle" size={24} color={theme.accentRed} />
            <View style={styles.resultText}>
              <ThemedText type="smallBold" style={{ color: theme.accentRed }}>
                Error
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.errorText}>
                {error || "Please try uploading again."}
              </ThemedText>
            </View>
          </View>
        )}

        {!isActive && (status === "completed" || isFailed) && (
          <Pressable
            onPress={() => dispatch(clearActiveJob())}
            style={({ pressed }) => [
              styles.doneButton,
              { backgroundColor: theme.accentBlue, opacity: pressed ? 0.9 : 1 },
            ]}>
            <ThemedText style={styles.doneButtonText}>
              {status === "completed" ? "View dashboard" : "Try again"}
            </ThemedText>
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    paddingHorizontal: Spacing.four,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: Radius.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.five,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.two,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: Spacing.five,
  },
  progressWrap: {
    width: "100%",
    height: 6,
    borderRadius: Radius.full,
    overflow: "hidden",
    marginBottom: Spacing.two,
  },
  progressBar: {
    height: "100%",
    borderRadius: Radius.full,
  },
  elapsed: {
    marginBottom: Spacing.five,
  },
  spinnerWrap: {
    marginBottom: Spacing.three,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.sm,
    width: "100%",
    marginBottom: Spacing.four,
  },
  resultText: {
    flex: 1,
    gap: Spacing.half,
  },
  errorText: {
    flex: 1,
  },
  doneButton: {
    height: 48,
    paddingHorizontal: Spacing.five,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
