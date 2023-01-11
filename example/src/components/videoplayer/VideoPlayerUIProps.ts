import { Dimensions, Platform } from 'react-native';

// default thumbnail size (width).
export const THUMBNAIL_SIZE = 0.19 * Math.max(Dimensions.get('window').width, Dimensions.get('window').height);

// carousel mode
export type ThumbnailMode = 'single' | 'carousel';
export const THUMBNAIL_MODE: ThumbnailMode = 'carousel';

// whether to show a cast button.
// NOTE: react-native-google-cast does not support web yet.
export const ENABLE_CAST_BUTTON = Platform.OS !== 'web';
