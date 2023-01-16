import { fromObjectToBase64String } from '@wouterds/react-native-theoplayer';
import {
  getDeviceType,
  getManufacturerSync,
  getModel,
  getReadableVersion,
  getSystemName,
  getSystemVersion,
} from 'react-native-device-info';
import type { ContentProtectionError, ErrorCode } from 'theoplayer';

import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';
import type { DeviceBasedTitaniumIntegrationParameters } from './TitaniumIntegrationParameters';
import {
  isDeviceBasedTitaniumDRMConfiguration,
  isTokenBasedTitaniumDRMConfiguration,
} from './TitaniumUtils';

export interface TitaniumDeviceAuthorizationData {
  LatensRegistration: TitaniumLatensRegistration;
}

export interface TitaniumLatensRegistration {
  CustomerName: string;
  AccountName: string;
  PortalId: string;
  FriendlyName: string;
  AppVersion: string | undefined;
  DeviceInfo: TitaniumDeviceInfo;
}

export interface TitaniumDeviceInfo extends TitaniumCDMDescription {
  FormatVersion: string;
  DeviceType: string;
  OSType: string;
  OSVersion: string;
  DeviceVendor: string;
  DeviceModel: string;
}

export interface TitaniumCDMDescription {
  DRMProvider: string;
  DRMVersion: string;
  DRMType: string;
}

export enum TitaniumCDMType {
  WIDEVINE = 'Widevine',
  PLAYREADY = 'PlayreadyV2',
  PLAYREADY_v2 = 'PlayreadyV2',
  PLAYREADY_v3 = 'PlayreadyV3',
  FAIRPLAY = 'Fairplay',
}

export const TITANIUM_CDM_DESCRIPTIONS: {
  [cdmType: string /* TitaniumCDMType_*/]: TitaniumCDMDescription;
} = {
  Widevine: {
    DRMProvider: 'Google',
    DRMVersion: '1.4.8.86',
    DRMType: 'Widevine',
  },
  PlayreadyV2: {
    DRMProvider: 'Microsoft',
    DRMVersion: '2.9',
    DRMType: 'Playready',
  },
  PlayreadyV3: {
    DRMProvider: 'Microsoft',
    DRMVersion: '3',
    DRMType: 'Playready',
  },
  Fairplay: {
    DRMProvider: 'Apple',
    DRMType: 'FairPlay',
    DRMVersion: '1.0',
  },
};

export const getTitaniumDeviceAuthorizationData = (
  integrationParameters: DeviceBasedTitaniumIntegrationParameters,
  cdmType: TitaniumCDMType,
): TitaniumDeviceAuthorizationData => {
  const cdmDescription: TitaniumCDMDescription =
    TITANIUM_CDM_DESCRIPTIONS[cdmType];
  const accountName = integrationParameters.accountName;
  const customerName = integrationParameters.customerName;
  const portalId = integrationParameters.portalId;
  const friendlyName = integrationParameters.friendlyName;

  const vendor = getManufacturerSync();

  return {
    LatensRegistration: {
      CustomerName: customerName,
      AccountName: accountName,
      PortalId: portalId,
      FriendlyName: friendlyName,
      AppVersion: getReadableVersion(),
      DeviceInfo: {
        FormatVersion: '1',
        DeviceType: getDeviceType(),
        OSType: getSystemName(),
        OSVersion: getSystemVersion(),
        DRMProvider: cdmDescription.DRMProvider,
        DRMVersion: cdmDescription.DRMVersion,
        DRMType: cdmDescription.DRMType,
        DeviceVendor: vendor,
        DeviceModel: getModel(),
      },
    },
  };
};

export const createErrorForMalformedDeviceInfoConfiguration = (
  configuration: TitaniumDrmConfiguration,
  cdmType: TitaniumCDMType,
): ContentProtectionError => {
  let message = `Invalid Titanium ${cdmType} DRM configuration.`;
  if (!configuration.integrationParameters.accountName) {
    message = `Invalid Titanium ${cdmType} DRM configuration, accountName is not set.`;
  } else if (!configuration.integrationParameters.customerName) {
    message = `Invalid Titanium ${cdmType} DRM configuration, customerName is not set.`;
  } else if (!configuration.integrationParameters.portalId) {
    message = `Invalid Titanium ${cdmType} DRM configuration, portalId is not set.`;
  }
  throw {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    code: ErrorCode.CONTENT_PROTECTION_CONFIGURATION_INVALID,
    message: message,
  } as ContentProtectionError;
};

export const createErrorForMalformedTokenConfiguration = (
  configuration: TitaniumDrmConfiguration,
  cdmType: TitaniumCDMType,
): ContentProtectionError => {
  let message = `Invalid Titanium ${cdmType} DRM configuration.`;
  if (!configuration.integrationParameters.authToken) {
    message = `Invalid Titanium ${cdmType} DRM configuration, authToken is not set.`;
  }
  throw {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    code: ErrorCode.CONTENT_PROTECTION_CONFIGURATION_INVALID,
    message: message,
  } as ContentProtectionError;
};

export const createTitaniumAuthHeader = (
  configuration: TitaniumDrmConfiguration,
  cdmType: TitaniumCDMType,
): string => {
  if (
    isTokenBasedTitaniumDRMConfiguration(configuration.integrationParameters)
  ) {
    return `Bearer ${configuration.integrationParameters.authToken}`;
  } else {
    throw createErrorForMalformedTokenConfiguration(configuration, cdmType);
  }
};

export const createTitaniumDeviceHeader = (
  configuration: TitaniumDrmConfiguration,
  cdmType: TitaniumCDMType,
): string => {
  if (
    isDeviceBasedTitaniumDRMConfiguration(configuration.integrationParameters)
  ) {
    const conf =
      configuration.integrationParameters as DeviceBasedTitaniumIntegrationParameters;
    const deviceAuthorizationData = getTitaniumDeviceAuthorizationData(
      conf,
      cdmType,
    );
    return fromObjectToBase64String(deviceAuthorizationData);
  } else {
    throw createErrorForMalformedDeviceInfoConfiguration(
      configuration,
      cdmType,
    );
  }
};

export const createTitaniumHeaders = (
  configuration: TitaniumDrmConfiguration,
  cdmType: TitaniumCDMType,
): { [key: string]: string } => {
  const hasAuthToken = isTokenBasedTitaniumDRMConfiguration(
    configuration.integrationParameters,
  );
  if (hasAuthToken) {
    return {
      'content-type': 'application/octet-stream',
      Authorization: createTitaniumAuthHeader(configuration, cdmType),
    };
  } else {
    return {
      'content-type': 'application/octet-stream',
      'X-TITANIUM-DRM-CDATA': createTitaniumDeviceHeader(
        configuration,
        cdmType,
      ),
    };
  }
};
