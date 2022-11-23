import type { NativeContentProtectionEvent } from './NativeContentProtectionEvent';
import type { CertificateResponse } from 'react-native-theoplayer';
import type { NativeCertificateRequest } from './NativeCertificateRequest';
import { fromNativeCertificateRequest } from './NativeCertificateRequest';
import { fromBase64StringToUint8Array, fromUint8ArrayToBase64String } from 'react-native-theoplayer';

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
  const { url, status, statusText, headers, base64body, request } = response;
  const body = base64body ? fromBase64StringToUint8Array(base64body) : new Uint8Array();
  return {
    url,
    status,
    statusText,
    headers,
    body,
    request: fromNativeCertificateRequest(request),
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
    base64body: response ? fromUint8ArrayToBase64String(new Uint8Array(response)) : '',
  };
}
