import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // App identifier - Android package name (reverse domain)
  appId: 'com.rexocollab.app',
  appName: 'Rexo Collab',
  // Vite build output directory
  webDir: 'dist',
  // Server config - for production, no server URL (uses bundled assets)
  server: {
    androidScheme: 'https',
  },
  // Android specific config
  android: {
    buildOptions: {
      // Debug APK - no signing needed
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    // Allow mixed content for HTTP resources
    allowMixedContent: false,
    // Capture input
    captureInput: true,
    // WebView settings
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    // SplashScreen plugin config (if added later)
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
    // StatusBar plugin config
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
