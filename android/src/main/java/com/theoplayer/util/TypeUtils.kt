package com.theoplayer.util

const val NAN_VALUE: Double = -1.0
const val POS_INF_VALUE: Double = -2.0

object TypeUtils {
  // Make sure we do not send INF or NaN double values over the bridge. It will break debug sessions.
  fun encodeInfNan(v: Double): Double {
    if (v.isNaN()) {
      return NAN_VALUE
    }
    if (v.isInfinite()) {
      return POS_INF_VALUE
    }
    return v
  }
}
