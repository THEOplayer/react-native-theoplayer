const NAN_VALUE = -1;
const POS_INF_VALUE = -2;

// We can't send INF and NaN values over the bridge, so convert if necessary.
export function decodeNanInf(v: number): number {
  if (v === NAN_VALUE) {
    return NaN;
  }
  if (v === POS_INF_VALUE) {
    return Infinity;
  }
  return v;
}

export const objectToString = {}.toString;

const viewClasses = [
  '[object Int8Array]',
  '[object Uint8Array]',
  '[object Uint8ClampedArray]',
  '[object Int16Array]',
  '[object Uint16Array]',
  '[object Int32Array]',
  '[object Uint32Array]',
  '[object Float32Array]',
  '[object Float64Array]',
  '[object DataView]',
];

export function arrayContainsElement_<T>(array: ReadonlyArray<T>, element: T): boolean {
  return array.indexOf(element) !== -1;
}

export const isArrayBufferView_: typeof ArrayBuffer.isView =
  ArrayBuffer.isView || ((obj) => obj && arrayContainsElement_(viewClasses, objectToString.call(obj)));

export function isBufferSource(bufferSource: any): bufferSource is BufferSource {
  return bufferSource instanceof ArrayBuffer || isArrayBufferView_(bufferSource);
}

export const isArray: <T = any>(arg: unknown) => arg is T[] =
  Array.isArray ||
  function isArray(arg: unknown): arg is unknown[] {
    return objectToString.call(arg) === '[object Array]';
  };
