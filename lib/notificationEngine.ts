import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ✅ Configure foreground notification behavior for the modern Expo API
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * 🛠️ Initializes native Android notification channels with specific priority profiles
 */
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Standard Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });

    await Notifications.setNotificationChannelAsync('emergency-siren', {
      name: '🚨 Chrono Emergency Siren',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'siren.wav',
      vibrationPattern: [0, 250, 250, 250, 500, 250],
      enableLights: true,
      bypassDnd: true,
    });
  }
}

interface ScheduleParams {
  taskTitle: string;
  deadlineString: string; // Expected Format: "YYYY-MM-DD HH:mm"
  durationMinutes: number;
}

/**
 * 🛸 Orchestrates the complete 3-Tiered notification timeline calculations
 */
export async function scheduleTaskNotificationGrid({
  taskTitle,
  deadlineString,
  durationMinutes,
}: ScheduleParams): Promise<void> {
  // 1. Assert secure system notification permissions
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  // 2. Initialize native channel configurations
  await setupNotificationChannels();

  // 3. Parse deadline and calculate Task Start Time
  const deadlineDate = new Date(deadlineString.replace(' ', 'T'));
  const startTimeMs = deadlineDate.getTime() - durationMinutes * 60 * 1000;
  const startTime = new Date(startTimeMs);
  const now = new Date();

  // --- TIER 1: 3 Hours Before Start (Standard Channel) ---
  const tier1Time = new Date(startTime.getTime() - 3 * 60 * 60 * 1000);
  if (tier1Time > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🕒 Horizon Threat: ${taskTitle}`,
        body: `Execution window initializes in 3 hours. Ready your workspace parameters.`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: tier1Time,
        channelId: 'default',           // ✅ channelId lives INSIDE trigger
      },
    });
    // Add this right before the closing brace of each tier's "if" statement:
    console.log(`[Notification Engine]: Enqueued Tier successfully for ${taskTitle} at ${tier1Time.toLocaleTimeString()}`);
  }

  // --- TIER 2: 1 Hour Before Start (Standard Channel) ---
  const tier2Time = new Date(startTime.getTime() - 1 * 60 * 60 * 1000);
  if (tier2Time > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⚠️ Preparation Window: ${taskTitle}`,
        body: `1 hour remaining before core execution window locks open.`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: tier2Time,
        channelId: 'default',           // ✅ channelId lives INSIDE trigger
      },
    });
    // Add this right before the closing brace of each tier's "if" statement:
    console.log(`[Notification Engine]: Enqueued Tier successfully for ${taskTitle} at ${tier2Time.toLocaleTimeString()}`);
  }

  // --- TIER 3: 15 Minutes Before Start (🚨 EMERGENCY SIREN CHANNEL) ---
  const tier3Time = new Date(startTime.getTime() - 15 * 60 * 1000);
  if (tier3Time > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🚨 CRITICAL EXECUTION BREACH: ${taskTitle}`,
        body: `T-MINUS 15 MINUTES! Drop all alternate focus threads immediately.`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: tier3Time,
        channelId: 'emergency-siren',   // ✅ channelId lives INSIDE trigger
      },
    });
    // Add this right before the closing brace of each tier's "if" statement:
    console.log(`[Notification Engine]: Enqueued Tier successfully for ${taskTitle} at ${tier3Time.toLocaleTimeString()}`);
  }
}