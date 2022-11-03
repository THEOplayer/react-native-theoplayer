import type { NativeContentProtectionEvent } from './NativeContentProtectionEvent';
import { base64StringToUint8Array_, uint8ArrayToBase64String_ } from '../utils/Base64Utils';
import type { LicenseResponse } from 'react-native-theoplayer';
import type { NativeLicenseRequest } from './NativeLicenseRequest';
import { fromNativeLicenseRequest } from './NativeLicenseRequest';

export interface NativeLicenseResponse extends NativeContentProtectionEvent {
  url: string;
  status: number;
  statusText: string;
  headers: { [headerName: string]: string };
  base64body: string;
  request: NativeLicenseRequest;
}

export interface NativeLicenseResponseResult extends NativeContentProtectionEvent {
  base64body: string;
}

export function fromNativeLicenseResponse(response: NativeLicenseResponse): LicenseResponse {
  const { url, status, statusText, headers, base64body } = response;
  const body = base64body ? base64StringToUint8Array_(base64body) : new Uint8Array();
  return {
    url,
    status,
    statusText,
    headers,
    body,
    request: fromNativeLicenseRequest(response.request),
  };
}

export function toNativeLicenseResponseResult(
  requestId: string,
  integrationId: string,
  keySystemId: string,
  response: ArrayBuffer,
): NativeLicenseResponseResult {
  return {
    requestId,
    integrationId,
    keySystemId,
    base64body: response ? uint8ArrayToBase64String_(new Uint8Array(response)) : '',
  };
}
