package com.theoplayer.source

import android.text.TextUtils
import com.theoplayer.android.api.error.ErrorCode
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.source.SourceType
import com.theoplayer.android.api.source.TypedSource
import org.json.JSONObject

typealias CustomSSAIAdapter = (json: JSONObject, currentBuilder: TypedSource.Builder) -> TypedSource.Builder

private const val ERROR_UNSUPPORTED_SSAI_INTEGRATION = "Unsupported SSAI integration"
private const val ERROR_MISSING_SSAI_INTEGRATION = "Missing SSAI integration"
private const val PROP_INTEGRATION = "integration"

object SSAIAdapterRegistry {
  private val _adapters: MutableMap<String, CustomSSAIAdapter> = HashMap()

  fun register(integration: String, adapter: CustomSSAIAdapter) {
    _adapters[integration] = adapter
  }

  fun hasIntegration(integration: String): Boolean {
    return _adapters[integration] != null
  }

  fun typedSourceBuilderFromJson(json: JSONObject, currentBuilder: TypedSource.Builder, sourceType: SourceType?): TypedSource.Builder {
    // Check for valid SsaiIntegration
    val ssaiIntegrationStr = json.optString(PROP_INTEGRATION)

    // Check for valid `integration` property, which is mandatory.
    if (TextUtils.isEmpty(ssaiIntegrationStr)) {
      throw THEOplayerException(ErrorCode.AD_ERROR, ERROR_MISSING_SSAI_INTEGRATION)
    }

    // Check for known SsaiIntegration
    if (!hasIntegration(ssaiIntegrationStr)) {
      throw THEOplayerException(
        ErrorCode.AD_ERROR,
        "$ERROR_UNSUPPORTED_SSAI_INTEGRATION: $ssaiIntegrationStr"
      )
    }

    // Prefer DASH if SSAI type not specified
    if (sourceType == null) {
      currentBuilder.type(SourceType.DASH)
    }

    return _adapters[ssaiIntegrationStr]?.invoke(json, currentBuilder) ?: currentBuilder
  }
}
