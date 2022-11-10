import { Buffer } from 'buffer';

// from object
export function fromObjectToBase64String(obj: { [key: string]: any }): string {
  return fromStringToBase64String(JSON.stringify(obj));
}

// from string
export function fromStringToBase64String(str: string): string {
  return Buffer.from(str, 'utf8').toString('base64');
}

// from base64 string
export function fromBase64StringToUint8Array(str: string): Uint8Array {
  return Buffer.from(str, 'base64');
}

// from uint8Array
export function fromUint8ArrayToBase64String(array: Uint8Array): string {
  return Buffer.from(array).toString('base64');
}
