import type { ScaledSize } from 'react-native/Libraries/Utilities/Dimensions';
import { Dimensions, Platform, StatusBar } from 'react-native';

/**
 * Calculate the device's screen dimensions, while taking into account the statusBar height on Android.
 */
export function getUsableScreenSize(): ScaledSize {
  const screenSize = Dimensions.get('screen');
  return {
    ...screenSize,
    height: Platform.OS === 'android' ? screenSize.height - (StatusBar.currentHeight || 0) : screenSize.height,
  };
}
