export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      if (
        window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      ) {
        navigator.serviceWorker
          .register('./sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered with scope:', registration.scope);
            // Check immediately for any updated service worker
            registration.update().catch(() => {});
          })
          .catch((error) => {
            console.info('[PWA] Service Worker registration note:', error);
          });
      }
    });
  }
}
