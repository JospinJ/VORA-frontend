import React, { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { StatusBar } from 'expo-status-bar';
import * as LocalAuthentication from 'expo-local-authentication';
import { ActivityIndicator, Image, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@vora/tokens';
import { AuthFlow, resolveAppRole, type AppRole } from './src/features/auth/AuthFlow';
import { PassengerFlow } from './src/navigation/PassengerFlow';
import { DriverFlow } from './src/navigation/DriverFlow';
import { AdminFlow } from './src/navigation/AdminFlow';
import {
  ApiError,
  authApi,
  hydrateTokenStore,
  persistSessionRole,
  readSessionRole,
} from './src/services/api';

export default function App() {
  const [role, setRole] = useState<AppRole | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    const id = "vora-web-input-reset";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent =
      "html,body,#root{min-height:100%;background:#07080a}" +
      "body{margin:0;display:flex;justify-content:center;align-items:flex-start}" +
      "#root{width:390px;min-height:844px;margin:28px auto;border-radius:40px;overflow:hidden;box-shadow:0 0 0 14px #111318,0 24px 70px rgba(0,0,0,.55)}" +
      "input,textarea{outline:none!important;box-shadow:none!important;-webkit-appearance:none;appearance:none}input:focus,textarea:focus{outline:none!important;box-shadow:none!important}";
    document.head.appendChild(style);
    if (!document.querySelector('script[data-figma-capture]')) {
      const capture = document.createElement('script');
      capture.src = 'https://mcp.figma.com/mcp/html-to-design/capture.js';
      capture.async = true;
      capture.dataset.figmaCapture = '1';
      document.head.appendChild(capture);
    }
  }, []);

  useEffect(() => {
    setAssetsReady(true);
    void Asset.loadAsync([
      require('./assets/brand/vora-logo.png'),
      require('./assets/onboarding/city-connection.png'),
      require('./assets/onboarding/safety-ride.png'),
      require('./assets/onboarding/neighborhood-arrival.png'),
    ]).catch(() => undefined);
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      const [{ access, refresh }, storedRole] = await Promise.all([
        hydrateTokenStore(),
        readSessionRole(),
      ]);
      if (!active) return;
      if ((access || refresh) && storedRole) setRole(storedRole);
      if (!access && !refresh) {
        setSessionReady(true);
        return;
      }
      try {
        const biometricAvailable = await LocalAuthentication.hasHardwareAsync() && await LocalAuthentication.isEnrolledAsync();
        if (biometricAvailable) {
          const unlock = await LocalAuthentication.authenticateAsync({ promptMessage: 'Déverrouiller VORA', cancelLabel: 'Utiliser mon mot de passe', fallbackLabel: 'Code du téléphone', disableDeviceFallback: false });
          if (!unlock.success) { if (active) { setRole(null); setSessionReady(true); } return; }
        }
        let me;
        try {
          me = await authApi.me();
        } catch (error) {
          if (!(error instanceof ApiError) || error.status !== 401 || !refresh) throw error;
          await authApi.refresh();
          me = await authApi.me();
        }
        if (!active) return;
        const restoredRole: AppRole = resolveAppRole(me.roles);
        setRole(restoredRole);
        persistSessionRole(restoredRole);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          authApi.logout().catch(() => undefined);
          if (active) setRole(null);
        }
        // Une coupure réseau ne détruit pas une session encore récupérable.
      } finally {
        if (active) setSessionReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const onAuthenticated = (nextRole: AppRole) => {
    persistSessionRole(nextRole);
    setRole(nextRole);
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.root}>
        {!sessionReady ? (
          <View style={styles.restore} accessibilityLabel="Restauration de votre session VORA">
            <Image source={require('./assets/brand/vora-logo.png')} resizeMode="contain" style={styles.restoreLogo} />
            <ActivityIndicator color={colors.brand.turquoise500} />
          </View>
        ) : role === 'admin' ? (
          <AdminFlow onLogout={() => { authApi.logout().catch(() => undefined); setRole(null); }} />
        ) : role === 'driver' ? (
          <DriverFlow onLogout={() => { void authApi.logout().finally(() => setRole(null)); }} />
        ) : role === 'passenger' ? (
          <PassengerFlow onLogout={() => setRole(null)} />
        ) : (
          <AuthFlow onAuthenticated={onAuthenticated} assetsReady={fontsLoaded && assetsReady} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.stitch.bgCanvas },
  content: { flex: 1 },
  restore: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28 },
  restoreLogo: { width: 184, height: 82 },
});
