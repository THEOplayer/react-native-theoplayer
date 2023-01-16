import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';
import type {
  DeviceBasedTitaniumIntegrationParameters,
  TitaniumIntegrationParameters,
  TokenBasedTitaniumIntegrationParameters,
} from './TitaniumIntegrationParameters';

export const isTitaniumDRMConfiguration = (
  configuration: TitaniumDrmConfiguration,
): boolean => {
  const integrationParameters = configuration.integrationParameters;
  return (
    isTokenBasedTitaniumDRMConfiguration(integrationParameters) ||
    isDeviceBasedTitaniumDRMConfiguration(integrationParameters)
  );
};

export const isTokenBasedTitaniumDRMConfiguration = (
  integrationParameters: TitaniumIntegrationParameters,
): integrationParameters is TokenBasedTitaniumIntegrationParameters =>
  integrationParameters.authToken !== undefined;

export const isDeviceBasedTitaniumDRMConfiguration = (
  integrationParameters: TitaniumIntegrationParameters,
): integrationParameters is DeviceBasedTitaniumIntegrationParameters =>
  integrationParameters.accountName !== undefined &&
  integrationParameters.customerName !== undefined &&
  integrationParameters.portalId !== undefined;
