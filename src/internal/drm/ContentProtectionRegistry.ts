import type { CertificateRequest, ContentProtectionAPI, DRMConfiguration, LicenseRequest } from 'react-native-theoplayer';
import type { KeySystemId } from 'react-native-theoplayer';
import type { ContentProtectionIntegrationFactory } from 'react-native-theoplayer';
import { NativeEventEmitter, NativeModules } from 'react-native';
import type { ContentProtectionIntegration } from 'react-native-theoplayer';
import type { NativeContentProtectionEvent } from './NativeContentProtectionEvent';
import { fromNativeLicenseRequest, NativeLicenseRequest, toNativeLicenseRequest } from './NativeLicenseRequest';
import { fromNativeLicenseResponse, NativeLicenseResponse, toNativeLicenseResponseResult } from './NativeLicenseResponse';
import { fromNativeCertificateRequest, NativeCertificateRequest, toNativeCertificateRequest } from './NativeCertificateRequest';
import { fromNativeCertificateResponse, NativeCertificateResponse, toNativeCertificateResponseResult } from './NativeCertificateResponse';
import { isBufferSource } from '../utils/TypeUtils';

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
  drmConfig: DRMConfiguration;
}

interface ExtractFaiplayContentIdEvent extends NativeContentProtectionEvent {
  fairplaySkdUrl: string;
}

export class NativeContentProtectionRegistry implements ContentProtectionAPI {
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
    console.log('ContentProtectionModule', `onBuildIntegrationRequest ${integrationId} ${keySystemId}`);
    const factory = this.getFactory(integrationId, keySystemId);
    if (factory) {
      this.currentIntegration = {
        integrationId,
        keySystemId,
        integration: factory.build(drmConfig),
      };
      NativeModules.ContentProtectionModule.onBuildProcessed({ requestId, resultString: 'success' });
    } else {
      NativeModules.ContentProtectionModule.onBuildProcessed({
        requestId,
        resultString: 'failed',
      });
    }
  };

  private onCertificateRequest = async (request: NativeCertificateRequest) => {
    const { requestId, integrationId, keySystemId } = request;
    console.log('ContentProtectionModule', `onCertificateRequest ${integrationId} ${keySystemId}`);
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.onCertificateRequest) {
      const result = await integration.onCertificateRequest(fromNativeCertificateRequest(request));
      // TODO: we also want to support ArrayBufferView results
      if (isBufferSource(result)) {
        const nativeResponse = toNativeCertificateResponseResult(requestId, integrationId, keySystemId, result as ArrayBuffer);
        NativeModules.ContentProtectionModule.onCertificateRequestProcessedAsCertificate(nativeResponse);
      } else if (result as CertificateRequest) {
        const modifiedNativeRequest = toNativeCertificateRequest(requestId, integrationId, keySystemId, result as CertificateRequest);
        NativeModules.ContentProtectionModule.onCertificateRequestProcessedAsRequest(modifiedNativeRequest);
      }
    } else {
      NativeModules.ContentProtectionModule.onCertificateRequestProcessedAsRequest(request);
    }
  };

  private onCertificateResponse = async (response: NativeCertificateResponse) => {
    const { requestId, integrationId, keySystemId } = response;
    console.log('ContentProtectionModule', `onCertificateResponse ${integrationId} ${keySystemId}`);
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.onCertificateResponse) {
      const responseResult = await integration.onCertificateResponse(fromNativeCertificateResponse(response));
      // TODO: we also want to support ArrayBufferView results
      const modifiedNativeResponse = toNativeCertificateResponseResult(requestId, integrationId, keySystemId, responseResult as ArrayBuffer);
      NativeModules.ContentProtectionModule.onCertificateResponseProcessed(modifiedNativeResponse);
    } else {
      NativeModules.ContentProtectionModule.onCertificateResponseProcessed(response);
    }
  };

  private onLicenseRequest = async (request: NativeLicenseRequest) => {
    const { requestId, integrationId, keySystemId } = request;
    console.log('ContentProtectionModule', `onLicenseRequest ${integrationId} ${keySystemId}`);
    const integration = this.getIntegration(integrationId, keySystemId);
    // Optionally let the custom integration modify the request.
    if (integration?.onLicenseRequest) {
      const result = await integration.onLicenseRequest(fromNativeLicenseRequest(request));
      // TODO: we also want to support ArrayBufferView results
      if (isBufferSource(result)) {
        const nativeResponse = toNativeLicenseResponseResult(requestId, integrationId, keySystemId, result as ArrayBuffer);
        NativeModules.ContentProtectionModule.onLicenseRequestProcessedAsLicense(nativeResponse);
      } else if (result as LicenseRequest) {
        const modifiedNativeRequest = toNativeLicenseRequest(requestId, integrationId, keySystemId, result as LicenseRequest);
        NativeModules.ContentProtectionModule.onLicenseRequestProcessedAsRequest(modifiedNativeRequest);
      }
    } else {
      NativeModules.ContentProtectionModule.onLicenseRequestProcessedAsRequest(request);
    }
  };

  private onLicenseResponse = async (response: NativeLicenseResponse) => {
    const { requestId, integrationId, keySystemId } = response;
    console.log('ContentProtectionModule', `onLicenseResponse ${integrationId} ${keySystemId}`);
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
    const { integrationId, keySystemId, fairplaySkdUrl, requestId } = event;
    console.log('ContentProtectionModule', `onExtractFairplayContentId ${integrationId} ${keySystemId}`);
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration?.extractFairplayContentId) {
      const contentId = await integration.extractFairplayContentId(fairplaySkdUrl);
      NativeModules.ContentProtectionModule.onExtractFairplayContentIdProcessed({
        requestId,
        contentId,
      });
    } else {
      const contentId = fairplaySkdUrl;
      NativeModules.ContentProtectionModule.onExtractFairplayContentIdProcessed({
        requestId,
        contentId,
      });
    }
  };
}

export const ContentProtectionRegistry = new NativeContentProtectionRegistry();
