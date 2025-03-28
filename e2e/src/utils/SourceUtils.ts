import { AdDescription, SourceDescription } from 'react-native-theoplayer';
import dash from '../res/dash.json';
import hls from '../res/hls.json';
import mp4 from '../res/mp4.json';
import ads from '../res/ads.json';
import { Platform } from 'react-native';

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

type EnhancedSourceList = TestSourceDescription[] & SourceListMethods;

interface SourceListMethods {
  withPlain: () => EnhancedSourceList;
  withAds: () => EnhancedSourceList;
  withAdsIf: (condition: boolean) => EnhancedSourceList;
}

export function TestSources(): EnhancedSourceList {
  const testSources: TestSourceDescription[] = [];

  return Object.assign(testSources, {
    withPlain() {
      if (Platform.OS === 'android' || Platform.OS === 'web') {
        testSources.push(getTestSource(SourceType.DASH));
      }
      testSources.push(getTestSource(SourceType.HLS));
      testSources.push(getTestSource(SourceType.MP4));
      return testSources as EnhancedSourceList;
    },
    withAdsIf(condition: boolean) {
      return !condition ? (testSources as EnhancedSourceList) : this.withAds();
    },
    withAds() {
      if (Platform.OS === 'android' || Platform.OS === 'web') {
        testSources.push(getTestSource(SourceType.DASH, AdType.IMA_PRE_ROLL));
      }
      testSources.push(getTestSource(SourceType.HLS, AdType.IMA_PRE_ROLL));
      testSources.push(getTestSource(SourceType.MP4, AdType.IMA_PRE_ROLL));
      return testSources as EnhancedSourceList;
    },
  });
}

export function getTestSource(sourceType: SourceType, adType?: AdType): TestSourceDescription {
  let source: SourceDescription;
  let description: string;
  switch (sourceType) {
    case SourceType.DASH:
      source = dash[0];
      description = 'DASH';
      break;
    case SourceType.HLS:
      source = hls[0];
      description = 'HLS';
      break;
    case SourceType.MP4:
      source = mp4[0];
      description = 'mp4';
      break;
  }
  switch (adType) {
    case AdType.IMA_PRE_ROLL:
      source = extendSourceWithAds(source, ads[0] as AdDescription);
      description += ' with IMA pre-roll';
      break;
  }
  return {
    source,
    description,
  };
}

function extendSourceWithAds(source: SourceDescription, ad: AdDescription): SourceDescription {
  return { ...source, ads: [ad] };
}
