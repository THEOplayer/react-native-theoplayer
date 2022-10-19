import type { VerizonMediaPreplayResponse } from 'theoplayer';
import { VerizonMediaAssetType } from './VerizonMediaAssetType';
import { URL as URLPolyfill } from 'react-native-url-polyfill';
import { isVerizonMediaExternalId } from './utils/VerizonMediaTypeUtils';
import type { VerizonMediaAssetId, VerizonMediaExternalId, VerizonMediaPingConfiguration, VerizonMediaSource } from './source/VerizonMediaSource';
import { VerizonMediaPreplayResponseType } from './source/VerizonMediaPreplayResponse';
import { isArray, isString } from '../../internal/utils/TypeUtils';
import { addQueryToUrl } from '../../internal/utils/UrlUtils';

enum VerizonMediaPingFeatureValues {
  AD_IMPRESSIONS = 1,
  FW_VIDEO_VIEWS = 2,
  LINEAR_AD_DATA = 4,
}

export class VerizonMediaPreplayClient {
  async fetch_(source: VerizonMediaSource): Promise<VerizonMediaPreplayResponse> {
    const url = await createRequestUrl(source);
    const response = await (await fetch(url)).json();

    return {
      ...response,
      type: source.assetType === VerizonMediaAssetType.ASSET ? VerizonMediaPreplayResponseType.VOD : VerizonMediaPreplayResponseType.LIVE,
    };
  }
}

const assetTypePathMap: { [T in VerizonMediaAssetType]: string } = {
  [VerizonMediaAssetType.ASSET]: '',
  [VerizonMediaAssetType.CHANNEL]: 'channel/',
  [VerizonMediaAssetType.EVENT]: 'event/',
};

async function createRequestUrl(source: VerizonMediaSource): Promise<string> {
  const prefix = source.prefix ?? 'https://content.uplynk.com';
  const assetType = source.assetType ?? VerizonMediaAssetType.ASSET;
  const type = assetTypePathMap[assetType];
  const assetId = createAssetId(source.id);
  // TODO add drm parameters
  const ping = source.ping ?? {
    adImpressions: false,
    freeWheelVideoViews: false,
    linearAdData: false,
  };
  const pingFeatureParameters = createPingConfigurationParams(assetType, ping);

  let preplayParameters: Record<string, string> = {};
  if (isArray(source.preplayParameters)) {
    source.preplayParameters.forEach((param: [string, string]) => {
      preplayParameters[param[0]] = param[1];
    });
  } else {
    preplayParameters = source.preplayParameters ?? {};
  }

  const urlString = `${prefix}/preplay/${type}${assetId}.json`;
  const url = new URLPolyfill(urlString);
  addQueryToUrl(url, preplayParameters);
  addQueryToUrl(url, pingFeatureParameters);
  return url.toString();
}

function createAssetId(id: VerizonMediaAssetId | VerizonMediaAssetId[] | VerizonMediaExternalId): string {
  if (isArray(id) && id.every(isString)) {
    return id.length === 1 ? id[0] : `${id.join(',')}/multiple`;
  } else if (isString(id)) {
    return id;
  } else if (isVerizonMediaExternalId(id) && isArray(id.externalId) && id.externalId.every(isString)) {
    return id.externalId.length === 1 ? `ext/${id.userId}/${id.externalId[0]}` : `ext/${id.userId}/${id.externalId.join(',')}/multiple`;
  } else if (isVerizonMediaExternalId(id) && isString(id.externalId)) {
    return `ext/${id.userId}/${id.externalId}`;
  } else {
    throw new TypeError('Invalid asset id');
  }
}

function calculatePingFeature(assetType: string, ping: VerizonMediaPingConfiguration): number {
  const isLive = assetType !== VerizonMediaAssetType.ASSET;

  const adImpressionsValue = !isLive && ping.adImpressions ? VerizonMediaPingFeatureValues.AD_IMPRESSIONS : 0;
  const freewheelVideoViewsValue = !isLive && ping.freeWheelVideoViews ? VerizonMediaPingFeatureValues.FW_VIDEO_VIEWS : 0;
  const linearAdDataValue = isLive && ping.linearAdData ? VerizonMediaPingFeatureValues.LINEAR_AD_DATA : 0;

  return adImpressionsValue + freewheelVideoViewsValue + linearAdDataValue;
}

function createPingConfigurationParams(assetType: string, ping: VerizonMediaPingConfiguration): Record<string, string> {
  const featuresValue = calculatePingFeature(assetType, ping);

  if (featuresValue) {
    return {
      'ad.cping': '1',
      'ad.pingf': String(featuresValue),
    };
  } else {
    return {};
  }
}
