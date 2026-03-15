/**
 * Use direct build subpath imports to avoid loading expo-notifications main index,
 * which can fail to resolve getDevicePushTokenAsync on some Metro/Android setups.
 */
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await requestPermissionsAsync();
  return status === 'granted';
}

export async function notifyStatementProcessed(
  success: boolean,
  transactionsCreated?: number,
  error?: string,
): Promise<void> {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  const title = success ? 'Statement ready' : 'Statement processing failed';
  const body = success
    ? transactionsCreated !== undefined
      ? `${transactionsCreated} transaction(s) imported.`
      : 'Your bank statement has been processed.'
    : error || 'Something went wrong. Try uploading again.';

  await scheduleNotificationAsync({
    content: { title, body, data: { type: 'statement_job' } },
    trigger: null,
  });
}
