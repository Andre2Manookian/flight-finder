export default {
  expo: {
    name: 'FlightFinder',
    slug: 'flight-finder',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      }
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      skyScrapperApiKey: process.env.SKY_SCRAPPER_API_KEY || 'a0b0251162mshb031ff5d94aa420p1ac0b6jsn23fb5aa81fcb',
    },
  }
};