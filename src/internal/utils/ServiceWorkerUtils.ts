export function browserCanPlayHLSAndHasNoMSE() {
  const videoElement = document.createElement('video');
  const canPlayHls = videoElement && videoElement.canPlayType && videoElement.canPlayType('application/vnd.apple.mpegURL') !== '';
  // @ts-ignore
  const canPlayMse = Boolean(window.MediaSource || window.WebKitMediaSource || window.ManagedMediaSource);
  return canPlayHls && !canPlayMse;
}

export async function registerServiceWorker(libraryLocation?: string): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const serviceWorkerName = 'theoplayer.sw.js';
      const serviceWorkerPath = libraryLocation
        ? (libraryLocation.endsWith('/') ? libraryLocation : `${libraryLocation}/`) + serviceWorkerName
        : serviceWorkerName;
      const serviceWorkerScope = libraryLocation ? (libraryLocation.endsWith('/') ? libraryLocation : `${libraryLocation}/`) : '/';

      // unregister beforehand to solve an issue when doing a hard reload of the page causing the service worker to not intercept the manifests.
      await maybeUnregisterServiceWorker(serviceWorkerPath);
      await navigator.serviceWorker.register(serviceWorkerPath, {
        scope: serviceWorkerScope,
      });
      //console.log('Successfully registered server worker');
    } catch (error) {
      console.error(`Service worker registration failed: ${error}`);
    }
  }
}

export async function maybeUnregisterServiceWorker(serviceWorkerPath?: string): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration(serviceWorkerPath);
      await registration?.unregister();
    } catch (error) {
      console.error(`Service worker unregistration failed: ${error}`);
    }
  }
}
