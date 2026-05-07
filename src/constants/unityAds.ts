import { Platform } from 'react-native';

/**
 * Unity Grow (LevelPlay) — dashboard cross-check (grow.unity.com → Monetization):
 *
 * 1) Dono stores par alag apps: Android row ka Game ID sirf Android build / Play package ke sath;
 *    iOS row ka Game ID sirf iOS / Xcode bundle ID ke sath. Ye IDs mix mat karo.
 * 2) Package / bundle: Play Console + Xcode dono me `com.app.parkclear` Grow me registered app(s) se bilkul match hon.
 * 3) Har app par Ad units: Interstitial + Banner banay hon; IDs yahi hon jo dashboard "Ad Unit ID" column me dikhen (placement name nahin).
 * 4) Mediation: kam az kam ek network mediation group me active / approved ho (warna fill issues alag).
 * 5) Account: billing / policy / region restrictions nah hon; kabhi kabhi 2080 server-side rejection hota hai — Unity support + Game ID.
 * 6) Test suite (optional): docs ke mutabiq init se pehle `LevelPlay.setMetaData('is_test_suite', ['enable'])` sirf debug builds me.
 *
 * Errors: 2080 = init/config server se nahin mila (Game ID + bundle/package + account). 626 = ad unit is Game ID / OS ke sath bind nahin.
 */

/** Unity LevelPlay app keys (dashboard → App settings) */
export const UNITY_APP_KEY_ANDROID = '24f17192d';
export const UNITY_APP_KEY_IOS = '24f16a61d';

/** Ad unit IDs per platform (different for Android vs iOS in Unity dashboard) */
export const UNITY_INTERSTITIAL_ANDROID = 'qk7mr064p5s687st';
export const UNITY_INTERSTITIAL_IOS = 'duushj0ud6e6so9e';

export const UNITY_BANNER_ANDROID = 'nc00qduiu7fc5czx';
/** Must match Setup → Ad units → Banner → Ad Unit ID on the iOS app row in Grow (copy-paste only). */
export const UNITY_BANNER_IOS = 'yj2osnpse33go37h';

export function getInterstitialAdUnitId(): string {
  const raw = Platform.select({
    android: UNITY_INTERSTITIAL_ANDROID,
    ios: UNITY_INTERSTITIAL_IOS,
    default: UNITY_INTERSTITIAL_ANDROID,
  });
  return typeof raw === 'string' ? raw.trim() : '';
}

export function getBannerAdUnitId(): string {
  const raw = Platform.select({
    android: UNITY_BANNER_ANDROID,
    ios: UNITY_BANNER_IOS,
    default: UNITY_BANNER_ANDROID,
  });
  return typeof raw === 'string' ? raw.trim() : '';
}

export function getUnityAppKey(): string {
  const raw = Platform.select({
    android: UNITY_APP_KEY_ANDROID,
    ios: UNITY_APP_KEY_IOS,
    default: UNITY_APP_KEY_ANDROID,
  });
  return typeof raw === 'string' ? raw.trim() : '';
}
