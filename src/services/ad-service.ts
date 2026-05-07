/**
 * Unity LevelPlay (ironSource mediation) — integration follows:
 * https://docs.unity.com/grow/levelplay/sdk/react/plugin-integration.md
 * https://docs.unity.com/grow/levelplay/sdk/react/interstitial-integration.md
 *
 * Flow: LevelPlay.init after LevelPlayInitRequest.builder(appKey).build() → onInitSuccess →
 * create LevelPlayInterstitialAd(adUnitId) → setListener → loadAd (listener before load per docs).
 */
import { Platform } from 'react-native';
import {
  LevelPlay,
  LevelPlayInitRequest,
  LevelPlayInitListener,
  LevelPlayInitError,
  LevelPlayConfiguration,
  LevelPlayInterstitialAd,
  LevelPlayInterstitialAdListener,
  LevelPlayAdInfo,
  LevelPlayAdError,
} from 'unity-levelplay-mediation';
import { getInterstitialAdUnitId, getUnityAppKey } from '../constants/unityAds';

/** Max init attempts (Unity: retry init if configuration fetch fails). */
const MAX_LEVELPLAY_INIT_ATTEMPTS = 5;
const INIT_RETRY_BASE_DELAY_MS = 1500;
const MAX_RETRY_DELAY_MS = 20000;

function shouldRetryLevelPlayInit(error: LevelPlayInitError): boolean {
  if (error.errorCode === 2080) return true;
  const msg = (error.errorMessage ?? '').toLowerCase();
  return (
    msg.includes('retrieve configurations') ||
    msg.includes('unable to retrieve') ||
    msg.includes('ironsource server') ||
    msg.includes('network') ||
    msg.includes('timeout')
  );
}

class AdService {
  private static instance: AdService;
  private interstitialAd: LevelPlayInterstitialAd | null = null;
  private isInitialized = false;
  private initChainActive = false;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingAfterInterstitial: (() => void) | null = null;

  private constructor() {}

  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  /**
   * SDK 8.7.0+: LevelPlayInitRequest.builder(APP_KEY).withUserId optional → LevelPlay.init(initRequest, listener)
   */
  public async init() {
    if (this.isInitialized) return;
    if (this.initChainActive) return;
    this.initChainActive = true;
    void this.runInitAttempt(1);
  }

  private clearInitRetryTimer() {
    if (this.retryTimer != null) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  private async runInitAttempt(attempt: number) {
    if (this.isInitialized) {
      this.initChainActive = false;
      return;
    }

    const appKey = getUnityAppKey();

    if (!appKey || appKey.includes('YOUR_')) {
      console.warn('Unity LevelPlay: App Key is missing or using placeholder.');
      this.initChainActive = false;
      return;
    }

    if (__DEV__) {
      console.info('[Unity LevelPlay] init attempt', {
        os: Platform.OS,
        gameIdHint: `${appKey.slice(0, 4)}…${appKey.slice(-2)} (full ID in unityAds.ts — must match Grow row for THIS platform)`,
      });
    }

    // Unity docs (Android Step 4 / RN plugin Step 5): enables Integration Test Suite — MUST be before LevelPlay.init.
    // Helps verify adapters on device; use __DEV__ only.
    if (__DEV__) {
      try {
        await LevelPlay.setMetaData('is_test_suite', ['enable']);
      } catch (metaErr) {
        console.warn('Unity LevelPlay: setMetaData is_test_suite', metaErr);
      }
    }

    const initListener: LevelPlayInitListener = {
      onInitFailed: (error: LevelPlayInitError) => {
        console.error(
          `Unity LevelPlay: Initialization Failed [${Platform.OS}]`,
          error,
        );
        console.warn(
          'Unity LevelPlay: 2080 / config errors — confirm Game ID matches platform row in Grow, bundle/package `com.app.parkclear`, Info.plist ATS matches Unity plugin doc, and network allows IronSource endpoints.',
        );

        if (shouldRetryLevelPlayInit(error) && attempt < MAX_LEVELPLAY_INIT_ATTEMPTS) {
          const exp = Math.min(
            INIT_RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1),
            MAX_RETRY_DELAY_MS,
          );
          console.warn(
            `Unity LevelPlay: retrying init (attempt ${attempt + 1}/${MAX_LEVELPLAY_INIT_ATTEMPTS}) in ${exp}ms`,
          );
          this.clearInitRetryTimer();
          this.retryTimer = setTimeout(() => {
            void this.runInitAttempt(attempt + 1);
          }, exp);
        } else {
          this.initChainActive = false;
        }
      },
      onInitSuccess: (configuration: LevelPlayConfiguration) => {
        console.log('Unity LevelPlay: Initialization Success', configuration);
        this.clearInitRetryTimer();
        this.isInitialized = true;
        this.initChainActive = false;
        void this.afterSdkReadyThenAttachAds();
      },
    };

    try {
      const initRequest = LevelPlayInitRequest.builder(appKey).build();
      await LevelPlay.init(initRequest, initListener);
    } catch (e) {
      console.error('Unity LevelPlay: init threw before callbacks', e);
      if (attempt < MAX_LEVELPLAY_INIT_ATTEMPTS) {
        const exp = Math.min(
          INIT_RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1),
          MAX_RETRY_DELAY_MS,
        );
        this.clearInitRetryTimer();
        this.retryTimer = setTimeout(() => {
          void this.runInitAttempt(attempt + 1);
        }, exp);
      } else {
        this.initChainActive = false;
      }
    }
  }

  /** validateIntegration + adapters debug: Unity Step 5 — dev only. */
  private async afterSdkReadyThenAttachAds() {
    if (__DEV__) {
      try {
        await LevelPlay.setAdaptersDebug(true);
        const validation = await LevelPlay.validateIntegration();
        console.log('validation---->', validation);
      } catch (e) {
        console.warn('Unity LevelPlay: validateIntegration / setAdaptersDebug', e);
      }
    }
    this.setupInterstitialAfterInit();
  }

  /** Interstitial object after onInitSuccess; listener before loadAd (Unity interstitial-integration.md). */
  private setupInterstitialAfterInit() {
    const interstitialId = getInterstitialAdUnitId();
    if (!interstitialId) {
      console.warn('Unity LevelPlay: Empty interstitial ad unit id — check unityAds.ts');
      return;
    }
    if (this.interstitialAd) {
      return;
    }

    this.interstitialAd = new LevelPlayInterstitialAd(interstitialId);

    const listener: LevelPlayInterstitialAdListener = {
      onAdLoaded: (adInfo: LevelPlayAdInfo) => {
        console.log('Unity LevelPlay: Interstitial Loaded', adInfo);
      },
      onAdLoadFailed: (error: LevelPlayAdError) => {
        console.error('Unity LevelPlay: Interstitial Load Failed', error);
        if (error.errorCode === 626) {
          console.warn(
            '[Unity LevelPlay] 626 — Ad Unit ID must be Interstitial for this OS under the same Game ID as unityAds.ts (' +
              Platform.OS +
              ').',
          );
        }
      },
      onAdInfoChanged: (adInfo: LevelPlayAdInfo) => {
        console.log('Unity LevelPlay: Ad Info Changed', adInfo);
      },
      onAdDisplayed: (adInfo: LevelPlayAdInfo) => {
        console.log('Unity LevelPlay: Interstitial Displayed', adInfo);
      },
      onAdDisplayFailed: (error: LevelPlayAdError, adInfo: LevelPlayAdInfo) => {
        console.error('Unity LevelPlay: Interstitial Display Failed', error, adInfo);
        this.flushPendingInterstitial();
        this.loadInterstitial();
      },
      onAdClicked: (adInfo: LevelPlayAdInfo) => {
        console.log('Unity LevelPlay: Interstitial Clicked', adInfo);
      },
      onAdClosed: (adInfo: LevelPlayAdInfo) => {
        console.log('Unity LevelPlay: Interstitial Closed', adInfo);
        this.flushPendingInterstitial();
        this.loadInterstitial();
      },
    };

    this.interstitialAd.setListener(listener);
    void this.loadInterstitial();
  }

  private flushPendingInterstitial() {
    const cb = this.pendingAfterInterstitial;
    this.pendingAfterInterstitial = null;
    cb?.();
  }

  public async loadInterstitial() {
    if (this.interstitialAd) {
      console.log('Unity LevelPlay: Loading Interstitial...');
      await this.interstitialAd.loadAd();
    }
  }

  public async showInterstitial(onClosed?: () => void) {
    if (!this.interstitialAd) {
      onClosed?.();
      return;
    }

    const isReady = await this.interstitialAd.isAdReady();
    if (isReady) {
      console.log('Unity LevelPlay: Showing Interstitial...');
      this.pendingAfterInterstitial = onClosed ?? null;
      try {
        await this.interstitialAd.showAd(null);
      } catch (e) {
        console.error('Unity LevelPlay: showAd threw', e);
        this.flushPendingInterstitial();
      }
    } else {
      console.log('Unity LevelPlay: Interstitial not ready, loading again...');
      onClosed?.();
      this.loadInterstitial();
    }
  }
}

export default AdService.getInstance();
