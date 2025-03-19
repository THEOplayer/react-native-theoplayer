package com.theoplayer.source

import com.millicast.subscribers.Option
import com.theoplayer.android.api.millicast.MillicastSource
import org.json.JSONObject

private const val PROP_SRC = "src"
private const val PROP_STREAM_ACCOUNT_ID = "streamAccountId"
private const val PROP_API_URL = "apiUrl"
private const val PROP_SUBSCRIBER_TOKEN = "subscriberToken"
private const val PROP_CONNECT_OPTIONS = "connectOptions"

private const val DISABLE_AUDIO = "disableAudio"

fun parseMillicastSource(jsonTypedSource: JSONObject): MillicastSource {
  return MillicastSource(
    src = jsonTypedSource.optString(PROP_SRC),
    streamAccountId = jsonTypedSource.optString(PROP_STREAM_ACCOUNT_ID),
    apiUrl = jsonTypedSource.optString(PROP_API_URL),
    subscriberToken = when (val token = jsonTypedSource.optString(PROP_SUBSCRIBER_TOKEN)) {
      "" -> null
      else -> token
    },
    connectOptions = jsonTypedSource.optJSONObject(PROP_CONNECT_OPTIONS)
      ?.let { buildMillicastConnectOptions(it) }
  )
}

fun buildMillicastConnectOptions(jsonObject: JSONObject): Option {
  return Option(
    disableAudio = jsonObject.optBoolean(DISABLE_AUDIO),
  )
}
