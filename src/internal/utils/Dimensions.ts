import type { ScaledSize } from 'react-native/Libraries/Utilities/Dimensions';
import { Dimensions, Platform, StatusBar } from 'react-native';

/**
 * Calculate the device's screen dimensions, while taking into account the statusBar height and orientation on Android.
 */
export function getFullscreenSize(): ScaledSize {
  const screenSize = Dimensions.get('screen');

  // Adjust for statusBar height on Android, depending on the device's current orientation.
  if (Platform.OS === 'android' && Platform.Version >= 29) {
    const statusBarHeight = StatusBar.currentHeight || 0;
    if (screenSize.width < screenSize.height) {
      // portrait
      if (screenSize.height !== Dimensions.get('window').height + statusBarHeight) {
        screenSize.height = screenSize.height - statusBarHeight;
      }
    } else {
      // landscape
      if (screenSize.width !== Dimensions.get('window').width) {
        screenSize.width = screenSize.width - statusBarHeight;
      }
    }
  }
  return screenSize;
}
