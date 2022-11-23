import { Buffer } from 'buffer';

// from object
export function fromObjectToString(obj: { [key: string]: any }): string {
  return JSON.stringify(obj);
}
export function fromObjectToBase64String(obj: { [key: string]: any }): string {
  return fromStringToBase64String(fromObjectToString(obj));
}
export function fromObjectToUint8Array(obj: { [key: string]: any }): Uint8Array {
  return fromStringToUint8Array(fromObjectToString(obj));
}

// from string
export function fromStringToBase64String(str: string): string {
  return Buffer.from(str, 'utf8').toString('base64');
}
export function fromStringToUint8Array(str: string): Uint8Array {
  return Buffer.from(str, 'utf8');
}
export function fromStringToObject(str: string): { [key: string]: any } {
  return JSON.parse(str);
}

// from base64 string
export function fromBase64StringToUint8Array(str: string): Uint8Array {
  return Buffer.from(str, 'base64');
}

// from uint8Array
export function fromUint8ArrayToBase64String(array: Uint8Array): string {
  return Buffer.from(array).toString('base64');
}
export function fromUint8ArrayToString(array: Uint8Array): string {
  return Buffer.from(array).toString('utf8');
}
export function fromUint8ArrayToObject(array: Uint8Array): { [key: string]: any } {
  return fromStringToObject(fromUint8ArrayToString(array));
}
