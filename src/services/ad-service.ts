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

// Unity/ironSource App Keys
const APP_KEY_ANDROID = '24f17192d';
const APP_KEY_IOS = '24f16a61d';

// Interstitial Ad Unit ID
const INTERSTITIAL_AD_UNIT_ID = 'duushj0ud6e6so9e';
// Banner Ad Unit ID (for future use)
const BANNER_AD_UNIT_ID = 'yj2osnpse33go37h';

class AdService {
  private static instance: AdService;
  private interstitialAd: LevelPlayInterstitialAd | null = null;
  private isInitialized = false;

  private constructor() {
    if (INTERSTITIAL_AD_UNIT_ID) {
      this.interstitialAd = new LevelPlayInterstitialAd(INTERSTITIAL_AD_UNIT_ID);
    }
  }

  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  public async init() {
    if (this.isInitialized) return;

    const appKey = Platform.select({
      android: APP_KEY_ANDROID,
      ios: APP_KEY_IOS,
    });

    if (!appKey || appKey.includes('YOUR_')) {
      console.warn('Unity LevelPlay: App Key is missing or using placeholder.');
      return;
    }

    const initListener: LevelPlayInitListener = {
      onInitFailed: (error: LevelPlayInitError) => {
        console.error('Unity LevelPlay: Initialization Failed', error);
      },
      onInitSuccess: (configuration: LevelPlayConfiguration) => {
        console.log('Unity LevelPlay: Initialization Success', configuration);
        this.isInitialized = true;
        this.setupInterstitialListener();
      },
    };

    const initRequest = LevelPlayInitRequest.builder(appKey).build();
    LevelPlay.init(initRequest, initListener);
  }

  private setupInterstitialListener() {
    if (!this.interstitialAd) return;

    const listener: LevelPlayInterstitialAdListener = {
      onAdLoaded: (adInfo: LevelPlayAdInfo) => {
        console.log('Unity LevelPlay: Interstitial Loaded', adInfo);
      },
      onAdLoadFailed: (error: LevelPlayAdError) => {
        console.error('Unity LevelPlay: Interstitial Load Failed', error);
      },
      onAdInfoChanged: (adInfo: LevelPlayAdInfo) => {
        console.log('Unity LevelPlay: Ad Info Changed', adInfo);
      },
      onAdDisplayed: (adInfo: LevelPlayAdInfo) => {
        console.log('Unity LevelPlay: Interstitial Displayed', adInfo);
      },
      onAdDisplayFailed: (error: LevelPlayAdError, adInfo: LevelPlayAdInfo) => {
        console.error('Unity LevelPlay: Interstitial Display Failed', error, adInfo);
      },
      onAdClicked: (adInfo: LevelPlayAdInfo) => {
        console.log('Unity LevelPlay: Interstitial Clicked', adInfo);
      },
      onAdClosed: (adInfo: LevelPlayAdInfo) => {
        console.log('Unity LevelPlay: Interstitial Closed', adInfo);
        // Pre-load the next ad
        this.loadInterstitial();
      },
    };

    this.interstitialAd.setListener(listener);
    this.loadInterstitial();
  }

  public async loadInterstitial() {
    if (this.interstitialAd) {
      console.log('Unity LevelPlay: Loading Interstitial...');
      await this.interstitialAd.loadAd();
    }
  }

  public async showInterstitial() {
    if (!this.interstitialAd) return;

    const isReady = await this.interstitialAd.isAdReady();
    if (isReady) {
      console.log('Unity LevelPlay: Showing Interstitial...');
      this.interstitialAd.showAd();
    } else {
      console.log('Unity LevelPlay: Interstitial not ready, loading again...');
      this.loadInterstitial();
    }
  }
}

export default AdService.getInstance();
