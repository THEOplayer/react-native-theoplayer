import type { ContentProtectionAPI } from 'react-native-theoplayer';
import type { KeySystemId } from 'react-native-theoplayer';
import type { ContentProtectionIntegrationFactory } from 'react-native-theoplayer';
import { NativeEventEmitter, NativeModules } from 'react-native';
import type { ContentProtectionIntegration } from 'react-native-theoplayer';
import type { ContentProtectionRequest } from 'react-native-theoplayer';

interface ContentProtectionInit {
  integrationId: string;
  keySystemId: string;
  integrationFactory: ContentProtectionIntegrationFactory;
}

interface ContentProtectionInstance {
  integrationId: string;
  keySystemId: string;
  integration: ContentProtectionIntegration;
}

interface ContentProtectionEvent {
  requestId: string;
  integrationId: string;
  keySystemId: string;
}

interface CertificateRequestEvent extends ContentProtectionEvent, ContentProtectionRequest {}

export class NativeContentProtectionAPI implements ContentProtectionAPI {
  private emitter: NativeEventEmitter;

  private inits: ContentProtectionInit[] = [];

  private integrations: ContentProtectionInstance[] = [];

  constructor() {
    this.emitter = new NativeEventEmitter(NativeModules.ContentProtectionModule);
    this.emitter.addListener('onBuildIntegration', this.onBuildIntegrationRequest);
    this.emitter.addListener('onCertificateRequest', this.onCertificateRequest);
    this.emitter.addListener('onCertificateResponse', this.onCertificateResponse);
    this.emitter.addListener('onLicenseRequest', this.onLicenseRequest);
    this.emitter.addListener('onLicenseResponse', this.onLicenseResponse);
  }

  registerContentProtectionIntegration(integrationId: string, keySystemId: KeySystemId, integrationFactory: ContentProtectionIntegrationFactory) {
    this.inits.push({
      integrationId,
      keySystemId,
      integrationFactory,
    });
    NativeModules.ContentProtectionModule.registerContentProtectionIntegration(integrationId, keySystemId);
  }

  private getFactory(integrationId: string, keySystemId: string): ContentProtectionIntegrationFactory | undefined {
    return this.inits.find((init) => init.integrationId === integrationId && init.keySystemId === keySystemId)?.integrationFactory;
  }

  private getIntegration(integrationId: string, keySystemId: string): ContentProtectionIntegration | undefined {
    return this.integrations.find((integration) => integration.integrationId === integrationId && integration.keySystemId === keySystemId)
      ?.integration;
  }

  private onBuildIntegrationRequest = (event: ContentProtectionEvent) => {
    console.log('ContentProtectionAPI - received onBuildIntegrationRequest', event);
    const { requestId, integrationId, keySystemId } = event;
    const factory = this.getFactory(integrationId, keySystemId);
    if (factory) {
      console.log('OK', requestId, integrationId, keySystemId);
      // const integration = factory.build(/*TODO: config*/);
      // this.integrations.push({
      //   integrationId,
      //   keySystem,
      //   integration,
      // });
    } else {
      console.error(`No ${keySystemId} integration for id '${integrationId}' has been registered.`);
    }
  };

  private onCertificateRequest = async (event: CertificateRequestEvent) => {
    console.log('ContentProtectionAPI - received onCertificateRequest', event);
    const { integrationId, keySystemId, requestId } = event;
    const integration = this.getIntegration(integrationId, keySystemId);
    if (integration && integration.onCertificateRequest) {
      console.log('OK', requestId, keySystemId, integrationId);
      // const result = await integration.onCertificateRequest(event);
      // const base64result = 'TODO';
      // NativeModules.ContentProtectionModule.onCallback({
      //   requestId,
      // });
    } else {
      console.error(`No ${keySystemId} integration for id '${integrationId}' found.`);
    }
  };

  private onCertificateResponse = (event: ContentProtectionEvent) => {
    console.log('ContentProtectionAPI - received onCertificateResponse', event);
  };

  private onLicenseRequest = (event: ContentProtectionEvent) => {
    console.log('ContentProtectionAPI - received onLicenseRequest', event);
  };

  private onLicenseResponse = (event: ContentProtectionEvent) => {
    console.log('ContentProtectionAPI - received onLicenseResponse', event);
  };
}
