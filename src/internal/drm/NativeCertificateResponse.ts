import type { NativeContentProtectionEvent } from './NativeContentProtectionEvent';
import { base64StringToUint8Array_, uint8ArrayToBase64String_ } from '../utils/Base64Utils';
import type { CertificateResponse } from 'react-native-theoplayer';
import type { NativeCertificateRequest } from './NativeCertificateRequest';
import { fromNativeCertificateRequest } from './NativeCertificateRequest';

export interface NativeCertificateResponse extends NativeContentProtectionEvent {
  url: string;
  status: number;
  statusText: string;
  headers: { [headerName: string]: string };
  base64body: string;
  request: NativeCertificateRequest;
}

export interface NativeCertificateResponseResult extends NativeContentProtectionEvent {
  base64body: string;
}

export function fromNativeCertificateResponse(response: NativeCertificateResponse): CertificateResponse {
  const { url, status, statusText, headers, base64body } = response;
  const body = base64body ? base64StringToUint8Array_(base64body) : new Uint8Array();
  return {
    url,
    status,
    statusText,
    headers,
    body,
    request: fromNativeCertificateRequest(response.request),
  };
}

export function toNativeCertificateResponseResult(
  requestId: string,
  integrationId: string,
  keySystemId: string,
  response: ArrayBuffer,
): NativeCertificateResponseResult {
  return {
    requestId,
    integrationId,
    keySystemId,
    base64body: response ? uint8ArrayToBase64String_(new Uint8Array(response)) : '',
  };
}
