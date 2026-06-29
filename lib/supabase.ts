import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Access variables safely using Expo's public environment convention
// Supabase password: 8aujDt5OpVdF16K5
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';

// Ensures web popups route back cleanly to your active native container
WebBrowser.maybeCompleteAuthSession();

export const handleGoogleSignInWithGmail = async () => {
  try {
    // 1. Resolve deep link targeting your specific custom native scheme
    const redirectTo = makeRedirectUri({
      scheme: 'chronopilot',
    });

    // 2. Trigger the cloud auth payload with explicit Gmail scopes
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true, // Prevents browser hijacking, passes control to WebBrowser
        scopes: 'https://www.googleapis.com/auth/gmail.readonly', // ──> 🟢 CRITICAL EMAIL SYNC RIGHTS
      },
    });

    if (error) throw error;

    // 3. Launch secure in-app window sheet
    if (data?.url) {
      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      
      // 4. On returning successfully, manually extract and apply session hash
      if (res.type === 'success' && res.url) {
        const parsedUrl = Linking.parse(res.url);
        const { access_token, refresh_token } = parsedUrl.queryParams || {};

        if (access_token) {
          await supabase.auth.setSession({
            access_token: Array.isArray(access_token) ? access_token[0] : access_token,
            refresh_token: Array.isArray(refresh_token) ? refresh_token[0] : refresh_token || '',
          });
          return { success: true };
        }
      }
    }
  } catch (err) {
    console.error('OAuth configuration pipeline failed:', err);
    return { success: false, error: err };
  }
};