package com.theoplayer.cache

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.cache.CacheStatus
import com.theoplayer.android.api.cache.CachingParameters
import com.theoplayer.android.api.cache.CachingTask
import com.theoplayer.android.api.cache.CachingTaskStatus
import com.theoplayer.util.fromTimeRanges

private const val PROP_ID = "id"
private const val PROP_STATUS = "status"
private const val PROP_SOURCE = "source"
private const val PROP_PARAMETERS = "parameters"
private const val PROP_PARAMETERS_AMOUNT = "amount"
private const val PROP_PARAMETERS_EXPIRATION_DATE = "expirationDate"
private const val PROP_PARAMETERS_BANDWIDTH = "bandwidth"
private const val PROP_DURATION = "duration"
private const val PROP_CACHED = "cached"
private const val PROP_SECONDS_CACHED = "secondsCached"
private const val PROP_PERCENTAGE_CACHED = "percentageCached"
private const val PROP_BYTES = "bytes"
private const val PROP_BYTES_CACHED = "bytesCached"

object CacheAdapter {

  fun fromCachingTask(task: CachingTask?): WritableMap {
    if (task == null) {
      return Arguments.createMap()
    }
    return Arguments.createMap().apply {
      putString(PROP_ID, task.id)
      putString(PROP_STATUS, fromCacheTaskStatus(task.status))
//      putString(PROP_SOURCE, /*TODO*/)
      putMap(PROP_PARAMETERS, fromCachingParameters(task.parameters))
      putDouble(PROP_DURATION, task.duration)
      putArray(PROP_CACHED, fromTimeRanges(task.cached))
      putDouble(PROP_SECONDS_CACHED, task.secondsCached)
      putDouble(PROP_PERCENTAGE_CACHED, task.percentageCached)
      putDouble(PROP_BYTES, task.bytes.toDouble())
      putDouble(PROP_BYTES_CACHED, task.bytesCached.toDouble())
    }
  }

  fun fromCacheStatus(status: CacheStatus): String {
    return when (status) {
      CacheStatus.INITIALISED -> "initialised"
      else -> "uninitialised"
    }
  }

  private fun fromCacheTaskStatus(status: CachingTaskStatus): String {
    return when (status) {
      CachingTaskStatus.ERROR -> "error"
      CachingTaskStatus.DONE -> "done"
      CachingTaskStatus.EVICTED -> "evicted"
      CachingTaskStatus.LOADING -> "loading"
      else -> "idle"
    }
  }

  private fun fromCachingParameters(parameters: CachingParameters?): WritableMap {
    return Arguments.createMap().apply {
      if (parameters != null) {
        putString(PROP_PARAMETERS_AMOUNT, parameters.amount)
        putDouble(PROP_PARAMETERS_BANDWIDTH, parameters.bandwidth.toDouble())
        // TODO: date
//        putDouble(PROP_PARAMETERS_EXPIRATION_DATE, parameters.expirationDate)
      }
    }
  }
}
