import type { NativeContentProtectionEvent } from './NativeContentProtectionEvent';
import type { CertificateRequest } from 'react-native-theoplayer';
import { fromBase64StringToUint8Array, fromUint8ArrayToBase64String } from 'react-native-theoplayer';

export interface NativeCertificateRequest extends NativeContentProtectionEvent {
  url: string;
  method: string;
  headers: { [headerName: string]: string };
  base64body: string | null;
  useCredentials: boolean;
}

export function fromNativeCertificateRequest(request: NativeCertificateRequest): CertificateRequest {
  const { url, method, headers, useCredentials, base64body } = request;
  const body = base64body ? fromBase64StringToUint8Array(base64body) : null;
  return {
    url,
    method,
    headers,
    useCredentials,
    body,
  };
}

export function toNativeCertificateRequest(
  requestId: string,
  integrationId: string,
  keySystemId: string,
  request: CertificateRequest,
): NativeCertificateRequest {
  return {
    requestId,
    integrationId,
    keySystemId,
    url: request.url,
    method: request.method,
    headers: request.headers,
    useCredentials: request.useCredentials ?? false,
    base64body: request.body ? fromUint8ArrayToBase64String(request.body) : null,
  };
}
