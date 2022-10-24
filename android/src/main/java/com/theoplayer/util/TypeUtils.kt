package com.theoplayer.util

const val NAN_VALUE: Double = -1.0
const val POS_INF_VALUE: Double = -2.0

object TypeUtils {
  // Make sure we do not send INF or NaN double values over the bridge. It will break debug sessions.
  fun encodeInfNan(v: Double): Double {
    return when (v) {
      Double.NaN -> NAN_VALUE
      Double.POSITIVE_INFINITY -> POS_INF_VALUE
      else -> {
        return v
      }
    }
  }
}
