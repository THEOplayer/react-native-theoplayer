import type { CertificateRequest, CertificateResponse, ContentProtectionAPI, LicenseRequest } from 'react-native-theoplayer';
import type { KeySystemId } from 'react-native-theoplayer';
import type { ContentProtectionIntegrationFactory } from 'react-native-theoplayer';
import { NativeEventEmitter, NativeModules } from 'react-native';
import type { ContentProtectionIntegration } from 'react-native-theoplayer';
import type { NativeContentProtectionEvent } from './NativeContentProtectionEvent';
import type { NativeLicenseRequest } from './NativeLicenseRequest';
import { fromNativeLicenseRequest, toNativeLicenseRequest } from './NativeLicenseRequest';
import { fromNativeLicenseResponse, NativeLicenseResponse, toNativeLicenseResponseResult } from './NativeLicenseResponse';

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

interface BuildEvent extends NativeContentProtectionEvent {
  drmConfig: string;
}

interface CertificateRequestEvent extends NativeContentProtectionEvent, CertificateRequest {}
interface CertificateResponseEvent extends NativeContentProtectionEvent, CertificateResponse {}

interface ExtractFaiplayContentIdEvent extends NativeContentProtectionEvent {
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
    const { requestId, integrationId, keySystemId, drmConfig } = event;
    const factory = this.getFactory(integrationId, keySystemId);
    if (factory) {
      this.currentIntegration = {
        integrationId,
        keySystemId,
        integration: factory.build({
          // TODO: extract drmConfiguration from drmConfig
          integration: '',
        }),
      };
      NativeModules.ContentProtectionModule.onBuildProcessed({ requestId, resultString: 'success' });
    } else {
      NativeModules.ContentProtectionModule.onBuildProcessed({
        requestId,
        resultString: 'failed',
      });
    }
  };

  private onCertificateRequest = async (event: CertificateRequestEvent) => {
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

  private onLicenseRequest = async (request: NativeLicenseRequest) => {
    const { requestId, integrationId, keySystemId } = request;
    const integration = this.getIntegration(integrationId, keySystemId);
    // Optionally let the custom integration modify the request.
    if (integration?.onLicenseRequest) {
      const modifiedRequest = await integration.onLicenseRequest(fromNativeLicenseRequest(request));
      // TODO: we also want to support BufferSource results
      const modifiedNativeRequest = toNativeLicenseRequest(requestId, integrationId, keySystemId, modifiedRequest as LicenseRequest);
      NativeModules.ContentProtectionModule.onLicenseRequestProcessed(modifiedNativeRequest);
    } else {
      NativeModules.ContentProtectionModule.onLicenseRequestProcessed(request);
    }
  };

  private onLicenseResponse = async (response: NativeLicenseResponse) => {
    const { requestId, integrationId, keySystemId } = response;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.onLicenseResponse) {
      const responseResult = await integration.onLicenseResponse(fromNativeLicenseResponse(response));
      // TODO: we also want to support ArrayBufferView results
      const modifiedNativeResponse = toNativeLicenseResponseResult(requestId, integrationId, keySystemId, responseResult as ArrayBuffer);
      NativeModules.ContentProtectionModule.onLicenseResponseProcessed(modifiedNativeResponse);
    } else {
      NativeModules.ContentProtectionModule.onLicenseResponseProcessed(response);
    }
  };

  private onExtractFairplayContentId = async (event: ExtractFaiplayContentIdEvent) => {
    console.log('ContentProtectionAPI - received onExtractFairplayContentId', event);
    const { integrationId, keySystemId, skdUrl } = event;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.extractFairplayContentId) {
      const contentId = await integration.extractFairplayContentId(skdUrl);
      NativeModules.ContentProtectionModule.onExtractFairplayContentIdProcessed({
        skdUrl,
        contentId,
      });
    } else {
      const contentId = skdUrl;
      NativeModules.ContentProtectionModule.onExtractFairplayContentIdProcessed({
        skdUrl,
        contentId,
      });
    }
  };
}

export const ContentProtectionIntegrationsAPI = new NativeContentProtectionAPI();
