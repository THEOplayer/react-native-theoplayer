package com.theoplayer.source

import com.google.gson.Gson
import com.theoplayer.BuildConfig
import com.theoplayer.android.api.error.ErrorCode
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.source.GoogleDaiTypedSource
import com.theoplayer.android.api.source.TypedSource
import com.theoplayer.android.api.source.ssai.dai.GoogleDaiLiveConfiguration
import com.theoplayer.android.api.source.ssai.dai.GoogleDaiVodConfiguration
import org.json.JSONObject

private const val PROP_AVAILABILITY_TYPE = "availabilityType"
private const val AVAILABILITY_TYPE_VOD = "vod"
private const val ERROR_DAI_NOT_ENABLED = "Google DAI support not enabled."

@Suppress("UNUSED_PARAMETER")
@Throws(THEOplayerException::class)
fun googleDaiBuilderFromJson(builder: TypedSource.Builder, json: JSONObject): TypedSource.Builder {
  // Check whether the integration was enabled
  if (!BuildConfig.EXTENSION_GOOGLE_DAI) {
    throw THEOplayerException(ErrorCode.AD_ERROR, ERROR_DAI_NOT_ENABLED)
  }
  // We need to create a new builder as the player SDK checks for:
  // typedSource is GoogleDaiTypedSource
  return if (json.optString(PROP_AVAILABILITY_TYPE) == AVAILABILITY_TYPE_VOD) {
    GoogleDaiTypedSource.Builder(
      Gson().fromJson(json.toString(), GoogleDaiVodConfiguration::class.java)
    )
  } else {
    GoogleDaiTypedSource.Builder(
      Gson().fromJson(json.toString(), GoogleDaiLiveConfiguration::class.java)
    )
  }
}
