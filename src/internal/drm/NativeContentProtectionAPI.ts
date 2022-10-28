import type { CertificateRequest, CertificateResponse, ContentProtectionAPI, LicenseRequest, LicenseResponse } from 'react-native-theoplayer';
import type { KeySystemId } from 'react-native-theoplayer';
import type { ContentProtectionIntegrationFactory } from 'react-native-theoplayer';
import { NativeEventEmitter, NativeModules } from 'react-native';
import type { ContentProtectionIntegration } from 'react-native-theoplayer';

interface WrappedContentProtectionIntegrationFactory {
  integrationId: string;
  keySystemId: string;
  integrationFactory: ContentProtectionIntegrationFactory;
}

interface WrappedContentProtectionIntegration {
  integrationId: string;
  keySystemId: string;
  integration: ContentProtectionIntegration;
}

interface ContentProtectionEvent {
  requestId: string;
  integrationId: string;
  keySystemId: string;
}

interface BuildEvent extends ContentProtectionEvent {
  drmConfig: string;
}
interface CertificateRequestEvent extends ContentProtectionEvent, CertificateRequest {}
interface CertificateResponseEvent extends ContentProtectionEvent, CertificateResponse {}
interface LicenseRequestEvent extends ContentProtectionEvent, LicenseRequest {}
interface LicenseResponseEvent extends ContentProtectionEvent, LicenseResponse {}
interface ExtractFaiplayContentIdEvent extends ContentProtectionEvent {
  skdUrl: string;
}

export class NativeContentProtectionAPI implements ContentProtectionAPI {
  private emitter: NativeEventEmitter;
  private registeredFactories: WrappedContentProtectionIntegrationFactory[] = [];
  private currentIntegration: WrappedContentProtectionIntegration | undefined = undefined;

  constructor() {
    this.emitter = new NativeEventEmitter(NativeModules.ContentProtectionModule);
    this.emitter.addListener('onBuildIntegration', this.onBuildIntegrationRequest);
    this.emitter.addListener('onCertificateRequest', this.onCertificateRequest);
    this.emitter.addListener('onCertificateResponse', this.onCertificateResponse);
    this.emitter.addListener('onLicenseRequest', this.onLicenseRequest);
    this.emitter.addListener('onLicenseResponse', this.onLicenseResponse);
    this.emitter.addListener('onExtractFairplayContentId', this.onExtractFairplayContentId);
  }

  registerContentProtectionIntegration(integrationId: string, keySystemId: KeySystemId, integrationFactory: ContentProtectionIntegrationFactory) {
    this.registeredFactories.push({
      integrationId,
      keySystemId,
      integrationFactory,
    });
    NativeModules.ContentProtectionModule.registerContentProtectionIntegration(integrationId, keySystemId);
  }

  private getFactory(integrationId: string, keySystemId: string): ContentProtectionIntegrationFactory | undefined {
    return this.registeredFactories.find((init) => init.integrationId === integrationId && init.keySystemId === keySystemId)?.integrationFactory;
  }

  private getIntegration(integrationId: string, keySystemId: string): ContentProtectionIntegration | undefined {
    return this.currentIntegration?.integrationId === integrationId && this.currentIntegration?.keySystemId === keySystemId
      ? this.currentIntegration?.integration
      : undefined;
  }

  private onBuildIntegrationRequest = (event: BuildEvent) => {
    console.log('ContentProtectionAPI - received onBuildIntegrationRequest', event);
    const { requestId, integrationId, keySystemId, drmConfig } = event;
    const factory = this.getFactory(integrationId, keySystemId);
    if (factory) {
      console.log('onBuildIntegrationRequest: ', requestId, integrationId, keySystemId, drmConfig);
      this.currentIntegration = {
        integrationId,
        keySystemId,
        integration: factory.build({
          // TODO: extract drmConfiguration from drmConfig
          integration: '',
        }),
      };
      NativeModules.ContentProtectionModule.onBuildProcessed({
        requestId,
        resultString: 'success',
      });
    } else {
      console.error(`No factory for ${integrationId} - ${keySystemId}  has been registered.`);
      NativeModules.ContentProtectionModule.onBuildProcessed({
        requestId,
        resultString: 'failed',
      });
    }
  };

  private onCertificateRequest = async (event: CertificateRequestEvent) => {
    console.log('ContentProtectionAPI - received onCertificateRequest: ', event);
    const { requestId, integrationId, keySystemId } = event;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.onCertificateRequest) {
      //const result = await integration.onCertificateRequest(event);
      const resultString = 'Base64 encoded string'; // TODO: base64 encoding of result
      NativeModules.ContentProtectionModule.onCertificateRequestProcessed({
        requestId,
        resultString,
      });
    } else {
      const resultString = 'Base64 encoded string'; // TODO: base64 encoding of original
      NativeModules.ContentProtectionModule.onCertificateRequestProcessed({
        requestId,
        resultString,
      });
    }
  };

  private onCertificateResponse = async (event: CertificateResponseEvent) => {
    console.log('ContentProtectionAPI - received onCertificateResponse', event);
    const { requestId, integrationId, keySystemId } = event;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.onCertificateResponse) {
      //const result = await integration.onCertificateResponse(event);
      const resultString = 'Base64 encoded string'; // TODO: base64 encoding of result
      NativeModules.ContentProtectionModule.onCertificateResponseProcessed({
        requestId,
        resultString,
      });
    } else {
      const resultString = 'Base64 encoded string'; // TODO: base64 encoding of original
      NativeModules.ContentProtectionModule.onCertificateResponseProcessed({
        requestId,
        resultString,
      });
    }
  };

  private onLicenseRequest = async (event: LicenseRequestEvent) => {
    console.log('ContentProtectionAPI - received onLicenseRequest', event);
    const { requestId, integrationId, keySystemId } = event;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.onLicenseRequest) {
      //const result = await integration.onLicenseRequest(event);
      const resultString = 'Base64 encoded string'; // TODO: base64 encoding of result
      NativeModules.ContentProtectionModule.onCertificateResponseProcessed({
        requestId,
        resultString,
      });
    } else {
      const resultString = 'Base64 encoded string'; // TODO: base64 encoding of original
      NativeModules.ContentProtectionModule.onCertificateResponseProcessed({
        requestId,
        resultString,
      });
    }
  };

  private onLicenseResponse = async (event: LicenseResponseEvent) => {
    console.log('ContentProtectionAPI - received onLicenseResponse', event);
    const { requestId, integrationId, keySystemId } = event;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.onLicenseResponse) {
      //const result = await integration.onLicenseResponse(event);
      const resultString = 'Base64 encoded string'; // TODO: base64 encoding of result
      NativeModules.ContentProtectionModule.onCertificateResponseProcessed({
        requestId,
        resultString,
      });
    } else {
      const resultString = 'Base64 encoded string'; // TODO: base64 encoding of original
      NativeModules.ContentProtectionModule.onCertificateResponseProcessed({
        requestId,
        resultString,
      });
    }
  };

  private onExtractFairplayContentId = async (event: ExtractFaiplayContentIdEvent) => {
    console.log('ContentProtectionAPI - received onExtractFairplayContentId', event);
    const { requestId, integrationId, keySystemId, skdUrl } = event;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.extractFairplayContentId) {
      const resultString = await integration.extractFairplayContentId(skdUrl);
      NativeModules.ContentProtectionModule.onExtractFairplayContentIdProcessed({
        requestId,
        resultString,
      });
    } else {
      const resultString = skdUrl;
      NativeModules.ContentProtectionModule.onExtractFairplayContentIdProcessed({
        requestId,
        resultString,
      });
    }
  };
}

export const ContentProtectionIntegrationsAPI = new NativeContentProtectionAPI();
