import type { NativeContentProtectionEvent } from './NativeContentProtectionEvent';
import type { LicenseResponse } from '@wouterds/react-native-theoplayer';
import type { NativeLicenseRequest } from './NativeLicenseRequest';
import { fromNativeLicenseRequest } from './NativeLicenseRequest';
import { fromBase64StringToUint8Array, fromUint8ArrayToBase64String } from '@wouterds/react-native-theoplayer';

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
  const { url, status, statusText, headers, base64body, request } = response;
  const body = base64body ? fromBase64StringToUint8Array(base64body) : new Uint8Array();
  return {
    url,
    status,
    statusText,
    headers,
    body,
    request: fromNativeLicenseRequest(request),
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
    base64body: response ? fromUint8ArrayToBase64String(new Uint8Array(response)) : '',
  };
}
