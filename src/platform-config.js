// Connection to the shared apps platform (Firebase project shared by all apps: see github.com/yanivmalka/apps-platform).
// Public web config — not a secret; access is enforced by the platform's firestore.rules.
// Open the app with ?backend=memory to test with local data instead.
window.PLATFORM_CONFIG = {
  appId: 'omer',
  firebase: {
    apiKey: 'AIzaSyAVyw2RUh3T0UPaxbCluCgFKzkLaGZOIyQ',
    authDomain: 'malka-apps.firebaseapp.com',
    projectId: 'malka-apps',
    storageBucket: 'malka-apps.firebasestorage.app',
    messagingSenderId: '141711225817',
    appId: '1:141711225817:web:30ceb430dee31b59ebdfc8',
  },
};
