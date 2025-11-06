import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { 
  initializeAdMob, 
  showBannerAd, 
  hideBannerAd,
  removeBannerAd,
  showInterstitialAd,
  showRewardAd,
  setupAllAdListeners
} from '@/services/admob';

export const useAdMob = () => {
  useEffect(() => {
    // تهيئة AdMob فقط على الأجهزة الحقيقية
    if (Capacitor.isNativePlatform()) {
      initializeAdMob();
      setupAllAdListeners();
      
      // عرض إعلان Banner عند تحميل التطبيق
      showBannerAd();

      // إخفاء الإعلان عند إغلاق المكون
      return () => {
        removeBannerAd();
      };
    }
  }, []);

  return {
    showBanner: showBannerAd,
    hideBanner: hideBannerAd,
    removeBanner: removeBannerAd,
    showInterstitial: showInterstitialAd,
    showReward: showRewardAd,
  };
};
