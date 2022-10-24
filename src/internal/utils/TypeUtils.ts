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
