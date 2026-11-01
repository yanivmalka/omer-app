// Connection to the shared apps platform (Firebase project shared by all apps: see github.com/yanivmalka/apps-platform).
// Public web config — not a secret; access is enforced by the platform's firestore.rules.
// While apiKey is empty the dedications area stays hidden (open the app with ?backend=memory to test with local data).
window.PLATFORM_CONFIG = {
  appId: 'omer',
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
};
