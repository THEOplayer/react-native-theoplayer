package com.theoplayer.ads;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.theoplayer.android.api.ads.Ad;
import com.theoplayer.android.api.ads.AdBreak;
import com.theoplayer.android.api.ads.CompanionAd;
import com.theoplayer.android.api.ads.GoogleImaAd;
import com.theoplayer.android.api.ads.UniversalAdId;

import java.util.List;

public class AdInfo {
  private static final String PROP_AD_SYSTEM = "adSystem";
  private static final String PROP_AD_INTEGRATION = "integration";
  private static final String PROP_AD_TYPE = "type";
  private static final String PROP_AD_ID = "id";
  private static final String PROP_AD_BREAK = "adBreak";
  private static final String PROP_AD_COMPANIONS = "companions";
  private static final String PROP_AD_SKIPOFFSET = "skipOffset";
  private static final String PROP_AD_CREATIVE_ID = "creativeId";
  private static final String PROP_AD_TRAFFICKING_PARAMETERS = "traffickingParametersString";
  private static final String PROP_AD_BITRATE = "bitrate";
  private static final String PROP_AD_UNIVERSAL_AD_IDS = "universalAdIds";
  private static final String PROP_AD_TITLE = "title";
  private static final String PROP_AD_DURATION = "duration";
  private static final String PROP_AD_WRAPPER_AD_IDS = "wrapperAdIds";
  private static final String PROP_AD_WRAPPER_AD_SYSTEMS = "wrapperAdSystems";
  private static final String PROP_AD_WRAPPER_CREATIVE_IDS = "wrapperCreativeIds";
  private static final String PROP_AD_WIDTH = "width";
  private static final String PROP_AD_HEIGHT = "height";
  private static final String PROP_AD_CONTENT_TYPE = "contentType";

  private static final String PROP_ADBREAK_INTEGRATION = "integration";
  private static final String PROP_ADBREAK_MAXDURATION = "maxDuration";
  private static final String PROP_ADBREAK_TIMEOFFSET = "timeOffset";
  private static final String PROP_ADBREAK_MAXREMAININGDURATION = "maxRemainingDuration";
  private static final String PROP_ADBREAK_ADS = "ads";

  private static final String PROP_COMPANION_ADSLOTID = "adSlotId";
  private static final String PROP_COMPANION_ALTTEXT = "altText";
  private static final String PROP_COMPANION_CLICKTHROUGH = "clickThrough";
  private static final String PROP_COMPANION_WIDTH = "width";
  private static final String PROP_COMPANION_HEIGHT = "height";
  private static final String PROP_COMPANION_RESOURCEURI = "resourceURI";

  private static final String PROP_UNIVERSAL_AD_ID_REGISTRY = "adIdRegistry";
  private static final String PROP_UNIVERSAL_AD_ID_VALUE = "adIdValue";

  public static WritableMap fromAd(final Ad ad) {
    return fromAd(ad, true);
  }

  private static WritableMap fromAd(final Ad ad, boolean includeAdBreak) {
    WritableMap adPayload = Arguments.createMap();
    adPayload.putString(PROP_AD_INTEGRATION, ad.getIntegration() != null ? ad.getIntegration().getType() : "");
    adPayload.putString(PROP_AD_TYPE, ad.getType());
    adPayload.putString(PROP_AD_ID, ad.getId());
    AdBreak adBreak = ad.getAdBreak();
    if (includeAdBreak && adBreak != null) {
      adPayload.putMap(PROP_AD_BREAK, fromAdbreak(adBreak));
    }
    adPayload.putArray(PROP_AD_COMPANIONS, fromCompanions(ad.getCompanions()));
    adPayload.putInt(PROP_AD_SKIPOFFSET, ad.getSkipOffset());

    if (ad instanceof GoogleImaAd) {
      GoogleImaAd googleImaAd = (GoogleImaAd)ad;
      adPayload.putString(PROP_AD_SYSTEM, googleImaAd.getAdSystem());
      adPayload.putString(PROP_AD_CREATIVE_ID, googleImaAd.getCreativeId());
      adPayload.putString(PROP_AD_TRAFFICKING_PARAMETERS, googleImaAd.getImaAd().getTraffickingParameters());
      adPayload.putInt(PROP_AD_BITRATE, googleImaAd.getVastMediaBitrate());
      adPayload.putString(PROP_AD_TITLE, googleImaAd.getImaAd().getTitle());
      adPayload.putDouble(PROP_AD_DURATION, googleImaAd.getImaAd().getDuration());
      adPayload.putDouble(PROP_AD_WIDTH, googleImaAd.getImaAd().getVastMediaWidth());
      adPayload.putDouble(PROP_AD_HEIGHT, googleImaAd.getImaAd().getVastMediaHeight());
      adPayload.putString(PROP_AD_CONTENT_TYPE, googleImaAd.getImaAd().getContentType());

      WritableArray universalAdIdsPayload = Arguments.createArray();
      for (UniversalAdId universalAdId: googleImaAd.getUniversalAdIds()) {
        WritableMap idPayload = Arguments.createMap();
        idPayload.putString(PROP_UNIVERSAL_AD_ID_REGISTRY, universalAdId.getUniversalAdIdRegistry());
        idPayload.putString(PROP_UNIVERSAL_AD_ID_VALUE, universalAdId.getUniversalAdIdValue());
        universalAdIdsPayload.pushMap(idPayload);
      }
      adPayload.putArray(PROP_AD_UNIVERSAL_AD_IDS, universalAdIdsPayload);

      WritableArray wrapperAdIdsPayload = Arguments.createArray();
      for (String wrapperAdId: googleImaAd.getWrapperAdIds()) {
        wrapperAdIdsPayload.pushString(wrapperAdId);
      }
      adPayload.putArray(PROP_AD_WRAPPER_AD_IDS, wrapperAdIdsPayload);

      WritableArray wrapperAdSystemsPayload = Arguments.createArray();
      for (String wrapperAdSystem: googleImaAd.getWrapperAdSystems()) {
        wrapperAdSystemsPayload.pushString(wrapperAdSystem);
      }
      adPayload.putArray(PROP_AD_WRAPPER_AD_SYSTEMS, wrapperAdSystemsPayload);

      WritableArray wrapperCreativeIdsPayload = Arguments.createArray();
      for (String wrapperCreativeId: googleImaAd.getWrapperCreativeIds()) {
        wrapperCreativeIdsPayload.pushString(wrapperCreativeId);
      }
      adPayload.putArray(PROP_AD_WRAPPER_CREATIVE_IDS, wrapperCreativeIdsPayload);
    }

    return adPayload;
  }

  public static WritableMap fromAdbreak(@Nullable final AdBreak adbreak) {
    WritableMap adbreakPayload = Arguments.createMap();
    if (adbreak == null) {
      return adbreakPayload;
    }
    adbreakPayload.putString(PROP_ADBREAK_INTEGRATION, adbreak.getIntegration().getType());
    adbreakPayload.putInt(PROP_ADBREAK_MAXDURATION, adbreak.getMaxDuration());
    adbreakPayload.putInt(PROP_ADBREAK_TIMEOFFSET, adbreak.getTimeOffset());
    adbreakPayload.putDouble(PROP_ADBREAK_MAXREMAININGDURATION, adbreak.getMaxRemainingDuration());

    WritableArray adsPayload = Arguments.createArray();
    for (Ad ad: adbreak.getAds()) {
      // Some ads in the ad break are possibly not loaded yet.
      if (ad != null) {
        adsPayload.pushMap(fromAd(ad, false));
      }
    }
    adbreakPayload.putArray(PROP_ADBREAK_ADS, adsPayload);

    return adbreakPayload;
  }

  public static WritableArray fromCompanions(final List<CompanionAd> companions) {
    WritableArray companionsPayload = Arguments.createArray();
    for (CompanionAd companionAd: companions) {
      WritableMap adPayload = Arguments.createMap();
      adPayload.putString(PROP_COMPANION_ADSLOTID, companionAd.getAdSlotId());
      adPayload.putString(PROP_COMPANION_ALTTEXT, companionAd.getAltText());
      adPayload.putString(PROP_COMPANION_CLICKTHROUGH, companionAd.getClickThrough());
      adPayload.putInt(PROP_COMPANION_WIDTH, companionAd.getWidth());
      adPayload.putInt(PROP_COMPANION_HEIGHT, companionAd.getHeight());
      adPayload.putString(PROP_COMPANION_RESOURCEURI, companionAd.getResourceURI());
      companionsPayload.pushMap(adPayload);
    }
    return companionsPayload;
  }
}
