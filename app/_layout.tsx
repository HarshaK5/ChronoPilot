import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox } from 'react-native';

// FORCE BYPASS: Ignore native device permission errors for development utilities
LogBox.ignoreLogs([
  'Unable to activate keep awake',
  'KeepAwake',
]);

// Set global error handling boundaries to prevent the red screen crash
const originalHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((error, isFatal) => {
  if (error?.message?.includes('keep awake') || error?.message?.includes('KeepAwake')) {
    // Silently consume the utility error so the app keeps running smoothly
    return;
  }
  originalHandler(error, isFatal);
});

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}