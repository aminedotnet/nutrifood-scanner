import { 
  AdMob, 
  BannerAdOptions, 
  BannerAdSize, 
  BannerAdPosition,
  BannerAdPluginEvents,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents,
  AdMobInitializationOptions
} from '@capacitor-community/admob';

// تهيئة AdMob
export const initializeAdMob = async () => {
  try {
    const options: AdMobInitializationOptions = {
      testingDevices: ['YOUR_TESTING_DEVICE_ID'], // استبدل بـ Device ID للاختبار
      initializeForTesting: true, // غيرها إلى false في الإنتاج
    };
    
    await AdMob.initialize(options);
    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('AdMob initialization error:', error);
  }
};

// عرض إعلان Banner
export const showBannerAd = async () => {
  try {
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-3940256099942544/6300978111', // استبدل بـ Ad Unit ID الخاص بك
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      // isTesting: true, // غيرها إلى false في الإنتاج
    };
    
    await AdMob.showBanner(options);
    console.log('Banner ad shown');
  } catch (error) {
    console.error('Banner ad error:', error);
  }
};

// إخفاء إعلان Banner
export const hideBannerAd = async () => {
  try {
    await AdMob.hideBanner();
    console.log('Banner ad hidden');
  } catch (error) {
    console.error('Hide banner error:', error);
  }
};

// حذف إعلان Banner
export const removeBannerAd = async () => {
  try {
    await AdMob.removeBanner();
    console.log('Banner ad removed');
  } catch (error) {
    console.error('Remove banner error:', error);
  }
};

// عرض إعلان Interstitial (بين الصفحات)
export const showInterstitialAd = async () => {
  try {
    await AdMob.prepareInterstitial({
      adId: 'ca-app-pub-3940256099942544/1033173712', // استبدل بـ Ad Unit ID الخاص بك
      // isTesting: true, // غيرها إلى false في الإنتاج
    });
    
    await AdMob.showInterstitial();
    console.log('Interstitial ad shown');
  } catch (error) {
    console.error('Interstitial ad error:', error);
  }
};

// عرض إعلان Reward (المكافآت)
export const showRewardAd = async () => {
  try {
    await AdMob.prepareRewardVideoAd({
      adId: 'ca-app-pub-3940256099942544/5224354917', // استبدل بـ Ad Unit ID الخاص بك
      // isTesting: true, // غيرها إلى false في الإنتاج
    });
    
    const result = await AdMob.showRewardVideoAd();
    console.log('Reward ad result:', result);
    return result;
  } catch (error) {
    console.error('Reward ad error:', error);
    throw error;
  }
};

// الاستماع لأحداث Banner
export const setupBannerListeners = () => {
  AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
    console.log('Banner ad loaded');
  });

  AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
    console.error('Banner ad failed to load:', error);
  });

  AdMob.addListener(BannerAdPluginEvents.Opened, () => {
    console.log('Banner ad opened');
  });

  AdMob.addListener(BannerAdPluginEvents.Closed, () => {
    console.log('Banner ad closed');
  });

  AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => {
    console.log('Banner ad size changed:', size);
  });
};

// الاستماع لأحداث Interstitial
export const setupInterstitialListeners = () => {
  AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
    console.log('Interstitial ad loaded');
  });

  AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error) => {
    console.error('Interstitial ad failed to load:', error);
  });

  AdMob.addListener(InterstitialAdPluginEvents.Showed, () => {
    console.log('Interstitial ad showed');
  });

  AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (error) => {
    console.error('Interstitial ad failed to show:', error);
  });

  AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
    console.log('Interstitial ad dismissed');
  });
};

// الاستماع لأحداث Reward
export const setupRewardListeners = () => {
  AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
    console.log('Reward ad loaded');
  });

  AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
    console.error('Reward ad failed to load:', error);
  });

  AdMob.addListener(RewardAdPluginEvents.Showed, () => {
    console.log('Reward ad showed');
  });

  AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error) => {
    console.error('Reward ad failed to show:', error);
  });

  AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
    console.log('Reward ad dismissed');
  });

  AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
    console.log('User earned reward:', reward);
  });
};

// إعداد جميع المستمعين
export const setupAllAdListeners = () => {
  setupBannerListeners();
  setupInterstitialListeners();
  setupRewardListeners();
};
