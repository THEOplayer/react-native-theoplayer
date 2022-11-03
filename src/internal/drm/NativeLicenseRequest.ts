import type { NativeContentProtectionEvent } from './NativeContentProtectionEvent';
import { base64StringToUint8Array_, uint8ArrayToBase64String_ } from '../utils/Base64Utils';
import type { LicenseRequest } from 'react-native-theoplayer';

export interface NativeLicenseRequest extends NativeContentProtectionEvent {
  url: string;
  method: string;
  headers: { [headerName: string]: string };
  base64body: string | null;
  useCredentials: boolean;
  fairplaySkdUrl: string | undefined;
}

export function fromNativeLicenseRequest(request: NativeLicenseRequest): LicenseRequest {
  const { url, method, headers, useCredentials, base64body, fairplaySkdUrl } = request;
  const body = base64body ? base64StringToUint8Array_(base64body) : null;
  return {
    url,
    method,
    headers,
    useCredentials,
    body,
    fairplaySkdUrl,
  };
}

export function toNativeLicenseRequest(requestId: string, integrationId: string, keySystemId: string, request: LicenseRequest): NativeLicenseRequest {
  return {
    requestId,
    integrationId,
    keySystemId,
    url: request.url,
    method: request.method,
    headers: request.headers,
    useCredentials: request.useCredentials,
    base64body: request.body ? uint8ArrayToBase64String_(request.body) : null,
    fairplaySkdUrl: request.fairplaySkdUrl,
  };
}
