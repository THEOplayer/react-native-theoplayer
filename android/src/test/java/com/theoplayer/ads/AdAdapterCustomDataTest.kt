package com.theoplayer.ads

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.JavaOnlyArray
import com.facebook.react.bridge.JavaOnlyMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.event.ads.AdIntegrationKind
import com.theoplayer.integration.facadeStub
import org.json.JSONObject
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import org.mockito.MockedStatic
import org.mockito.Mockito.mockStatic

class AdAdapterCustomDataTest {
  private var factories: MockedStatic<Arguments>? = null

  @Before fun useJavaBridgeContainers() {
    factories = mockStatic(Arguments::class.java).apply {
      `when`<WritableMap> { Arguments.createMap() }.thenAnswer { JavaOnlyMap() }
      `when`<WritableArray> { Arguments.createArray() }.thenAnswer { JavaOnlyArray() }
    }
  }

  @After fun restoreBridgeFactories() {
    factories?.close()
  }

  @Test fun parsesAdAndAdBreakCustomDataFromJavascript() {
    val metadata = JavaOnlyMap.of(
      "campaign", "example",
      "optional", null,
      "nested", mapOf("enabled" to true),
      "values", listOf(1.5, null, 2.0),
    )
    val payload = JavaOnlyMap.of("customData", metadata)
    assertEquals(metadata.toHashMap(), AdAdapter.parseAd(payload)?.customData)
    assertEquals(metadata.toHashMap(), AdAdapter.parseAdBreak(payload)?.customData)
  }

  @Test fun missingAndNullCustomDataRemainAbsent() {
    for (payload in listOf(JavaOnlyMap(), JavaOnlyMap.of("customData", null))) {
      assertNull(AdAdapter.parseAd(payload)?.customData)
      assertNull(AdAdapter.parseAdBreak(payload)?.customData)
    }
    assertFalse(AdAdapter.fromAd(ad(null)).hasKey("customData"))
    assertFalse(AdAdapter.fromAdBreak(adBreak(null)).hasKey("customData"))
  }

  @Test fun emptyCustomDataIsNotTreatedAsAbsent() {
    val payload = JavaOnlyMap.of("customData", JavaOnlyMap())
    assertEquals(emptyMap<String, Any?>(), AdAdapter.parseAd(payload)?.customData)
    assertEquals(emptyMap<String, Any?>(), AdAdapter.parseAdBreak(payload)?.customData)
    assertEquals(emptyMap<String, Any?>(), AdAdapter.fromAd(ad(emptyMap<String, Any?>())).getMap("customData")?.toHashMap())
  }

  @Test fun preservesNestedValuesNullsAndNumericTypesInBothNativeModels() {
    val metadata = linkedMapOf(
      "nested" to mapOf("enabled" to true),
      "values" to listOf(1.5f, null, 2.toShort(), 3.toByte()),
      "optional" to null,
      "long" to 4_000_000_000L,
    )
    for (payload in listOf(AdAdapter.fromAd(ad(metadata)), AdAdapter.fromAdBreak(adBreak(JSONObject(metadata))))) {
      val result = requireNotNull(payload.getMap("customData"))
      assertTrue(requireNotNull(result.getMap("nested")).getBoolean("enabled"))
      assertTrue(result.hasKey("optional"))
      assertTrue(result.isNull("optional"))
      assertEquals(listOf(1.5, null, 2.0, 3.0), result.getArray("values")?.toArrayList())
      assertEquals(4_000_000_000.0, result.getDouble("long"), 0.0)
    }
  }

  @Test fun invalidMapKeysCannotAbortAdOrAdBreakSerialization() {
    val metadata = linkedMapOf<Any?, Any?>(null to "invalid", 1 to "invalid", "campaign" to "example")
    for (payload in listOf(AdAdapter.fromAd(ad(metadata)), AdAdapter.fromAdBreak(adBreak(metadata)))) {
      assertEquals(mapOf("campaign" to "example"), payload.getMap("customData")?.toHashMap())
    }
  }

  @Test fun nestedAdsKeepIndependentCustomDataWithoutRecursiveAdBreaks() {
    val nativeBreak = adBreak(mapOf("break" to "metadata"))
    val nativeAd = ad(mapOf("ad" to "metadata"), nativeBreak)
    val breakWithAds = adBreak(mapOf("break" to "metadata"), listOf(nativeAd))
    val payload = AdAdapter.fromAdBreak(breakWithAds)
    val nestedAd = requireNotNull(payload.getArray("ads")?.getMap(0))
    assertEquals("metadata", payload.getMap("customData")?.getString("break"))
    assertEquals("metadata", nestedAd.getMap("customData")?.getString("ad"))
    assertFalse(nestedAd.hasKey("adBreak"))
  }

  @Test fun broadcastAdEventsExposeCustomDataToNativeListeners() {
    val payload = JavaOnlyMap.of(
      "subType", "adbegin",
      "ad", JavaOnlyMap.of("customData", JavaOnlyMap.of("campaign", "example")),
    )
    assertEquals(mapOf("campaign" to "example"), AdEventAdapter.parseEvent(payload)?.ad?.customData)
  }

  @Test fun broadcastAdBreakEventsExposeBreakAndNestedAdCustomData() {
    for (subType in listOf("adbreakbegin", "adbreakend")) {
      val payload = JavaOnlyMap.of(
        "subType", subType,
        "ad", JavaOnlyMap.of(
          "customData", JavaOnlyMap.of("break", "metadata"),
          "ads", JavaOnlyArray.of(JavaOnlyMap.of("customData", JavaOnlyMap.of("ad", "metadata"))),
        ),
      )
      val adBreak = requireNotNull(AdEventAdapter.parseEvent(payload)?.ad?.adBreak)
      assertEquals(mapOf("break" to "metadata"), adBreak.customData)
      assertEquals(mapOf("ad" to "metadata"), adBreak.ads.single().customData)
      assertSame(adBreak, adBreak.ads.single().adBreak)
    }
  }

  private fun ad(metadata: Any?, adBreak: AdBreak? = null): Ad = facadeStub { method, _ ->
    when (method) {
      "getIntegration" -> AdIntegrationKind.CUSTOM
      "getType" -> "linear"
      "getCompanions" -> emptyList<Any>()
      "getSkipOffset" -> -1
      "getAdBreak" -> adBreak
      "getCustomData" -> metadata
      else -> null
    }
  }

  private fun adBreak(metadata: Any?, ads: List<Ad> = emptyList()): AdBreak = facadeStub { method, _ ->
    when (method) {
      "getIntegration" -> AdIntegrationKind.CUSTOM
      "getAds" -> ads
      "getMaxDuration" -> -1
      "getMaxRemainingDuration" -> -1.0
      "getTimeOffset" -> 0
      "getCustomData" -> metadata
      else -> null
    }
  }
}
