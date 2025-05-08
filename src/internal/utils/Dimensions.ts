import type { ScaledSize } from 'react-native/Libraries/Utilities/Dimensions';
import { Dimensions, NativeModules } from 'react-native';

/**
 * Calculate the device's screen dimensions, while taking into account the full usable screen dimensions on Android.
 */
export function getFullscreenSize(): ScaledSize {
  const screenSize = Dimensions.get('screen');

  // On Android, ask the platform for the full usable screen dimensions.
  // It should return the full usable screen size, including support for edgeToEdge layouts.
  // {@link https://developer.android.com/develop/ui/views/layout/edge-to-edge}

  const nativeDims: ScaledSize = NativeModules.THEORCTPlayerModule.getUsableScreenDimensions();
  return nativeDims.width > 0 && nativeDims.height > 0 ? nativeDims : screenSize;
}
