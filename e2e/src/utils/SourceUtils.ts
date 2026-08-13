import { AdDescription, SourceDescription } from 'react-native-theoplayer';
import dash from '../res/dash.json';
import hls from '../res/hls.json';
import mp4 from '../res/mp4.json';
import ads from '../res/ads.json';

export enum SourceType {
  DASH,
  HLS,
  MP4,
}

export enum AdType {
  IMA_PRE_ROLL,
}

export interface TestSourceDescription {
  source: SourceDescription;
  description: string;
}

/**
 * The plain (ad-less) test sources for a platform. DASH is only supported on
 * Android and web.
 */
export function plainSources(platform: string): TestSourceDescription[] {
  const types = platform === 'android' || platform === 'web' ? [SourceType.DASH, SourceType.HLS, SourceType.MP4] : [SourceType.HLS, SourceType.MP4];
  return types.map((type) => getTestSource(type));
}

/**
 * The test sources with an IMA pre-roll.
 *
 * A single source: an ad break plays out the same regardless of the content it
 * interrupts, while every extra case is another ad session - on iOS a pair of
 * WKWebViews whose web content process a loaded CI machine can take longer to
 * launch than IMA waits for its ad request.
 */
export function adSources(): TestSourceDescription[] {
  return [getTestSource(SourceType.HLS, AdType.IMA_PRE_ROLL)];
}

export function getTestSource(sourceType: SourceType, adType?: AdType): TestSourceDescription {
  let testSource: TestSourceDescription;
  switch (sourceType) {
    case SourceType.DASH:
      testSource = { source: dash[0], description: 'DASH' };
      break;
    case SourceType.HLS:
      testSource = { source: hls[0], description: 'HLS' };
      break;
    case SourceType.MP4:
      testSource = { source: mp4[0], description: 'mp4' };
      break;
  }
  return adType === AdType.IMA_PRE_ROLL ? withPreRoll(testSource) : testSource;
}

function withPreRoll(testSource: TestSourceDescription): TestSourceDescription {
  return {
    source: { ...testSource.source, ads: [ads[0] as AdDescription] },
    description: `${testSource.description} with IMA pre-roll`,
  };
}
