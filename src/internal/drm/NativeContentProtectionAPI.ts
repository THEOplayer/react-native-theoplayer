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
          // TODO: extract drmConfiguration from drmConfig base64 encoded string
          integration: '',
        }),
      };
      NativeModules.ContentProtectionModule.onBuildProcessed({
        requestId,
      });
    } else {
      console.error(`No factory for ${integrationId} - ${keySystemId}  has been registered.`);
    }
  };

  private onCertificateRequest = async (event: CertificateRequestEvent) => {
    console.log('ContentProtectionAPI - received onCertificateRequest: ', event);
    const { requestId, integrationId, keySystemId } = event;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.onCertificateRequest) {
      // const result = await integration.onCertificateRequest(event);
      const requestString = 'Base64 encoded request string'; // TODO: base64 encoding of result request
      NativeModules.ContentProtectionModule.onCertificateRequestProcessed({
        requestId,
        requestString,
      });
    } else {
      console.error(`No integration for ${integrationId} - ${keySystemId} available.`);
    }
  };

  private onCertificateResponse = async (event: CertificateResponseEvent) => {
    console.log('ContentProtectionAPI - received onCertificateResponse', event);
    const { requestId, integrationId, keySystemId } = event;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.onCertificateResponse) {
      //const result = await integration.onCertificateResponse(event);
      const responseString = 'Base64 encoded response string'; // TODO: base64 encoding of result response
      NativeModules.ContentProtectionModule.onCertificateResponseProcessed({
        requestId,
        responseString,
      });
    } else {
      console.error(`No integration for ${integrationId} - ${keySystemId} available.`);
    }
  };

  private onLicenseRequest = async (event: LicenseRequestEvent) => {
    console.log('ContentProtectionAPI - received onLicenseRequest', event);
    const { requestId, integrationId, keySystemId } = event;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.onLicenseRequest) {
      //const result = await integration.onLicenseRequest(event);
      const requestString = 'Base64 encoded request string'; // TODO: base64 encoding of result request
      NativeModules.ContentProtectionModule.onLicenseRequestProcessed({
        requestId,
        requestString,
      });
    } else {
      console.error(`No integration for ${integrationId} - ${keySystemId} available.`);
    }
  };

  private onLicenseResponse = async (event: LicenseResponseEvent) => {
    console.log('ContentProtectionAPI - received onLicenseResponse', event);
    const { requestId, integrationId, keySystemId } = event;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.onLicenseResponse) {
      //const result = await integration.onLicenseResponse(event);
      const responseString = 'Base64 encoded response string'; // TODO: base64 encoding of result response
      NativeModules.ContentProtectionModule.onLicenseResponseProcessed({
        requestId,
        responseString,
      });
    } else {
      console.error(`No integration for ${integrationId} - ${keySystemId} available.`);
    }
  };

  private onExtractFairplayContentId = async (event: ExtractFaiplayContentIdEvent) => {
    console.log('ContentProtectionAPI - received onExtractFairplayContentId', event);
    const { requestId, integrationId, keySystemId, skdUrl } = event;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.extractFairplayContentId) {
      const contentId = await integration.extractFairplayContentId(skdUrl);
      NativeModules.ContentProtectionModule.onExtractFairplayContentIdProcessed({
        requestId,
        contentId,
      });
    } else {
      console.error(`No integration for ${integrationId} - ${keySystemId} available.`);
    }
  };
}

export const ContentProtectionIntegrationsAPI = new NativeContentProtectionAPI();
