import { Dimensions } from 'react-native';

// default thumbnail size (width).
export const THUMBNAIL_SIZE = 0.19 * Math.max(Dimensions.get('window').width, Dimensions.get('window').height);

// carousel mode
export type ThumbnailMode = 'single' | 'carousel';
export const THUMBNAIL_MODE: ThumbnailMode = 'carousel';
