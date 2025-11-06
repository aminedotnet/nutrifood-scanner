# إعداد AdMob للتطبيق 📱💰

## المتطلبات الأساسية
1. حساب Google AdMob ([admob.google.com](https://admob.google.com))
2. Android Studio مثبت على جهازك
3. Java JDK 11 أو أحدث

---

## 🚀 خطوات الإعداد الكاملة

### 1️⃣ تصدير المشروع من Lovable
```bash
# اضغط على أيقونة GitHub في Lovable
# اختر "Export to GitHub"
# انسخ المشروع إلى جهازك

git clone <YOUR_GITHUB_URL>
cd <PROJECT_NAME>
npm install
```

### 2️⃣ إضافة Capacitor و Android
```bash
# تثبيت Capacitor (إذا لم يكن مثبتاً)
npm install @capacitor/core @capacitor/cli

# تهيئة Capacitor
npx cap init

# إضافة منصة Android
npx cap add android

# بناء المشروع
npm run build

# مزامنة الملفات
npx cap sync android
```

### 3️⃣ إضافة AdMob Plugin
```bash
npm install @capacitor-community/admob
npx cap sync android
```

### 4️⃣ إنشاء حساب AdMob والحصول على IDs

#### أ. إنشاء تطبيق في AdMob:
1. اذهب إلى [admob.google.com](https://admob.google.com)
2. اضغط على "Apps" → "Add App"
3. اختر "Android"
4. أدخل اسم التطبيق
5. احفظ **App ID** (مثل: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`)

#### ب. إنشاء Ad Units:
1. **Banner Ad**: اضغط "Create ad unit" → اختر "Banner" → احفظ الـ **Ad Unit ID**
2. **Interstitial Ad**: اضغط "Create ad unit" → اختر "Interstitial" → احفظ الـ **Ad Unit ID**
3. **Reward Ad**: اضغط "Create ad unit" → اختر "Rewarded" → احفظ الـ **Ad Unit ID**

### 5️⃣ تحديث Android Manifest

افتح `android/app/src/main/AndroidManifest.xml` وأضف:

```xml
<manifest>
    <application>
        <!-- أضف App ID الخاص بك من AdMob -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
        
        <!-- باقي الكود... -->
    </application>
</manifest>
```

### 6️⃣ تحديث Ad IDs في الكود

افتح `src/services/admob.ts` واستبدل الـ Test IDs بالـ IDs الخاصة بك:

```typescript
// Banner Ad
adId: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // ضع Ad Unit ID للـ Banner

// Interstitial Ad  
adId: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ', // ضع Ad Unit ID للـ Interstitial

// Reward Ad
adId: 'ca-app-pub-XXXXXXXXXXXXXXXX/WWWWWWWWWW', // ضع Ad Unit ID للـ Reward
```

**⚠️ مهم:** غير `isTesting: true` إلى `isTesting: false` عند النشر النهائي!

### 7️⃣ فتح المشروع في Android Studio
```bash
npx cap open android
```

### 8️⃣ بناء APK

في Android Studio:

#### للاختبار (Debug APK):
1. اذهب إلى **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. انتظر حتى ينتهي البناء
3. اضغط على **locate** في الإشعار أو اذهب إلى:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

#### للنشر (Release APK):
1. أنشئ Keystore للتوقيع:
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. أنشئ ملف `android/key.properties`:
   ```properties
   storePassword=YOUR_STORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=my-key-alias
   storeFile=../my-release-key.keystore
   ```

3. عدّل `android/app/build.gradle`:
   ```gradle
   def keystoreProperties = new Properties()
   def keystorePropertiesFile = rootProject.file('key.properties')
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }

   android {
       ...
       signingConfigs {
           release {
               keyAlias keystoreProperties['keyAlias']
               keyPassword keystoreProperties['keyPassword']
               storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
               storePassword keystoreProperties['storePassword']
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled false
               proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

4. ابنِ Release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

5. ستجد الملف في:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## 📊 استخدام الإعلانات في التطبيق

### عرض Banner (ثابت في الأسفل)
```typescript
import { useAdMob } from '@/hooks/useAdMob';

const MyComponent = () => {
  useAdMob(); // سيعرض banner تلقائياً
  // ...
};
```

### عرض Interstitial (بين الصفحات)
```typescript
const { showInterstitial } = useAdMob();

// عند الانتقال إلى صفحة جديدة
const handleNavigate = async () => {
  await showInterstitial(); // عرض إعلان
  navigate('/next-page');
};
```

### عرض Reward (المكافآت)
```typescript
const { showReward } = useAdMob();

const handleWatchAd = async () => {
  await showReward();
  // سيتم تشغيل callback عند إنهاء الفيديو
};
```

---

## 🧪 اختبار الإعلانات

### Test Ad IDs من Google (للتطوير):
- **Banner**: `ca-app-pub-3940256099942544/6300978111`
- **Interstitial**: `ca-app-pub-3940256099942544/1033173712`
- **Reward**: `ca-app-pub-3940256099942544/5224354917`

⚠️ **لا تنسَ استبدالها بـ IDs الحقيقية قبل النشر!**

---

## 🚨 مشاكل شائعة وحلولها

### المشكلة: الإعلانات لا تظهر
**الحل:**
- تأكد من أن App ID صحيح في AndroidManifest
- تأكد من أن الجهاز متصل بالإنترنت
- انتظر بضع دقائق (أول مرة قد تستغرق وقتاً)
- تحقق من console.log للأخطاء

### المشكلة: "Invalid Ad Unit ID"
**الحل:**
- تحقق من Ad Unit IDs في `src/services/admob.ts`
- تأكد من أنها للمنصة الصحيحة (Android)

### المشكلة: التطبيق يتعطل
**الحل:**
- تأكد من تهيئة AdMob قبل عرض الإعلانات
- تحقق من الأخطاء في Android Studio Logcat

---

## 📈 نصائح لزيادة الأرباح

1. ✅ ضع Banner في الأسفل (دائماً مرئي)
2. ✅ عرض Interstitial بين الإجراءات المهمة (بعد مسح منتج)
3. ✅ استخدم Reward لميزات إضافية (حفظ أكثر من X منتج)
4. ✅ لا تُكثر من الإعلانات (تجربة المستخدم أهم!)
5. ✅ راقب أداء الإعلانات في لوحة AdMob

---

## 📚 روابط مفيدة

- [AdMob Official Docs](https://developers.google.com/admob)
- [Capacitor AdMob Plugin](https://github.com/capacitor-community/admob)
- [Android App Bundle Guide](https://developer.android.com/guide/app-bundle)
- [Google Play Console](https://play.google.com/console)

---

## ✅ Checklist قبل النشر

- [ ] استبدال Test Ad IDs بـ IDs حقيقية
- [ ] تغيير `isTesting: false` في جميع الإعلانات
- [ ] توقيع APK بـ Release Keystore
- [ ] اختبار التطبيق على جهاز حقيقي
- [ ] رفع حجم الإصدار (version code)
- [ ] إضافة Privacy Policy للتطبيق
- [ ] قراءة سياسات AdMob

---

**بالتوفيق في تطبيقك! 🚀💰**
