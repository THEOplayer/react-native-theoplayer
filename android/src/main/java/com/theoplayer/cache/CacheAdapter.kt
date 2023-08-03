package com.theoplayer.cache

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.cache.CacheStatus
import com.theoplayer.android.api.cache.CachingParameters
import com.theoplayer.android.api.cache.CachingPreferredTrackSelection
import com.theoplayer.android.api.cache.CachingTask
import com.theoplayer.android.api.cache.CachingTaskList
import com.theoplayer.android.api.cache.CachingTaskProgress
import com.theoplayer.android.api.cache.CachingTaskStatus
import com.theoplayer.util.fromTimeRanges
import java.util.Date

private const val PROP_ID = "id"
private const val PROP_STATUS = "status"
private const val PROP_SOURCE = "source"
private const val PROP_PARAMETERS = "parameters"
private const val PROP_PARAMETERS_AMOUNT = "amount"
private const val PROP_PARAMETERS_EXPIRATION_DATE = "expirationDate"
private const val PROP_PARAMETERS_BANDWIDTH = "bandwidth"
private const val PROP_PARAMETERS_PREFERRED_TRACK_SELECTION = "preferredTrackSelection"
private const val PROP_PARAMETERS_AUDIO_TRACK_SELECTION = "audioTrackSelection"
private const val PROP_PARAMETERS_TEXT_TRACK_SELECTION = "textTrackSelection"
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

  fun fromCachingTaskList(taskList: CachingTaskList?): WritableArray {
    return Arguments.createArray().apply {
      taskList?.forEach { task ->
        pushMap(fromCachingTask(task))
      }
    }
  }

  fun fromCacheStatus(status: CacheStatus): String {
    return when (status) {
      CacheStatus.INITIALISED -> "initialised"
      else -> "uninitialised"
    }
  }

  fun fromCachingTaskProgress(progress: CachingTaskProgress): WritableMap {
    return Arguments.createMap().apply {
      putDouble(PROP_DURATION, progress.duration)
      putArray(PROP_CACHED, fromTimeRanges(progress.cached))
      putDouble(PROP_SECONDS_CACHED, progress.secondsCached)
      putDouble(PROP_PERCENTAGE_CACHED, progress.percentageCached)
      putDouble(PROP_BYTES, progress.bytes.toDouble())
      putDouble(PROP_BYTES_CACHED, progress.bytesCached.toDouble())
    }
  }

  fun fromCacheTaskStatus(status: CachingTaskStatus): String {
    return when (status) {
      CachingTaskStatus.ERROR -> "error"
      CachingTaskStatus.DONE -> "done"
      CachingTaskStatus.EVICTED -> "evicted"
      CachingTaskStatus.LOADING -> "loading"
      else -> "idle"
    }
  }

  fun parseCachingParameters(parameters: ReadableMap): CachingParameters {
    return CachingParameters.Builder().apply {
      amount(parameters.getString(PROP_PARAMETERS_AMOUNT))
      if (parameters.hasKey(PROP_PARAMETERS_BANDWIDTH)) {
        bandwidth(parameters.getDouble(PROP_PARAMETERS_BANDWIDTH).toLong())
      }
      if (parameters.hasKey(PROP_PARAMETERS_EXPIRATION_DATE)) {
        expirationDate(Date(parameters.getDouble(PROP_PARAMETERS_EXPIRATION_DATE).toLong()))
      }
      if (parameters.hasKey(PROP_PARAMETERS_PREFERRED_TRACK_SELECTION)) {
        preferredTrackSelection(parsePreferredTrackSelection(parameters.getMap(PROP_PARAMETERS_PREFERRED_TRACK_SELECTION)))
      }
    }.build()
  }

  private fun parsePreferredTrackSelection(parameters: ReadableMap?): CachingPreferredTrackSelection {
    return CachingPreferredTrackSelection.Builder().apply {
      audioTrackSelection(fromReadableStringArray(parameters?.getArray(PROP_PARAMETERS_AUDIO_TRACK_SELECTION)))
      textTrackSelection(fromReadableStringArray(parameters?.getArray(PROP_PARAMETERS_TEXT_TRACK_SELECTION)))
    }.build()
  }

  private fun fromReadableStringArray(array: ReadableArray?): Array<String>? {
    return array?.toArrayList()?.map { it.toString() }?.toTypedArray()
  }

  private fun fromCachingParameters(parameters: CachingParameters?): WritableMap {
    return Arguments.createMap().apply {
      if (parameters != null) {
        putString(PROP_PARAMETERS_AMOUNT, parameters.amount)
        putDouble(PROP_PARAMETERS_BANDWIDTH, parameters.bandwidth.toDouble())
        putDouble(PROP_PARAMETERS_EXPIRATION_DATE, parameters.expirationDate.time.toDouble())
      }
    }
  }
}
