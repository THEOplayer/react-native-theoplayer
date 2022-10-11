package com.theoplayer.ads;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.theoplayer.android.api.ads.wrapper.AdEventListener;
import com.theoplayer.android.api.ads.wrapper.AdsApiWrapper;
import com.theoplayer.android.api.ads.Ad;
import com.theoplayer.android.api.ads.AdBreak;
import com.theoplayer.android.api.ads.ima.GoogleImaAdEventType;
import com.theoplayer.android.api.event.EventType;
import com.theoplayer.android.api.event.ads.AdEvent;

public class AdEventAdapter {
  private final AdsApiWrapper adsApi;
  private final AdEventListener eventListener;

  private static final String EVENT_PROP_AD = "ad";
  private static final String EVENT_PROP_TYPE = "type";

  private final static GoogleImaAdEventType[] ALL_AD_EVENTS = {
    GoogleImaAdEventType.LOADED,
    GoogleImaAdEventType.AD_BREAK_STARTED,
    GoogleImaAdEventType.STARTED,
    GoogleImaAdEventType.FIRST_QUARTILE,
    GoogleImaAdEventType.MIDPOINT,
    GoogleImaAdEventType.THIRD_QUARTILE,
    GoogleImaAdEventType.COMPLETED,
    GoogleImaAdEventType.AD_BREAK_ENDED,
    GoogleImaAdEventType.SKIPPED,
    GoogleImaAdEventType.AD_ERROR,
    GoogleImaAdEventType.AD_BUFFERING,
    GoogleImaAdEventType.AD_BREAK_FETCH_ERROR
  };

  public interface AdEventEmitter {
    void emit(WritableMap payload);
  }

  public AdEventAdapter(AdsApiWrapper adsApi, AdEventEmitter eventEmitter) {
    this.adsApi = adsApi;

    eventListener = new AdEventListener() {
      @Override
      public <E extends AdEvent<?>> void onAdEvent(EventType<E> eventType, Ad ad) {
        WritableMap payload = Arguments.createMap();
        payload.putString(EVENT_PROP_TYPE, mapAdType(eventType));
        if (ad != null) {
          payload.putMap(EVENT_PROP_AD, AdInfo.fromAd(ad));
        }
        eventEmitter.emit(payload);
      }

      @Override
      public <E extends AdEvent<?>> void onAdBreakEvent(EventType<E> eventType, AdBreak adBreak) {
        WritableMap payload = Arguments.createMap();
        payload.putString(EVENT_PROP_TYPE, mapAdType(eventType));
        if (adBreak != null) {
          payload.putMap(EVENT_PROP_AD, AdInfo.fromAdBreak(adBreak));
        }
        eventEmitter.emit(payload);
      }
    };

    for (GoogleImaAdEventType eventType: ALL_AD_EVENTS) {
      adsApi.addEventListener(eventType, eventListener);
    }
  }

  private String mapAdType(EventType<?> eventType) {
    switch ((GoogleImaAdEventType)eventType) {
      case LOADED: return "adloaded";
      case STARTED: return "adbegin";
      case FIRST_QUARTILE: return "adfirstquartile";
      case MIDPOINT: return "admidpoint";
      case THIRD_QUARTILE: return "adthirdquartile";
      case COMPLETED: return "adend";
      case SKIPPED: return "adskip";
      case AD_ERROR: return "aderror";
      case AD_BUFFERING: return "adbuffering";
      case AD_BREAK_STARTED: return "adbreakbegin";
      case AD_BREAK_ENDED: return "adbreakend";
      case AD_BREAK_FETCH_ERROR: return "aderror";
      default: return eventType.getName().toLowerCase();
    }
  }

  public void destroy() {
    for (GoogleImaAdEventType eventType: ALL_AD_EVENTS) {
      adsApi.removeEventListener(eventType, eventListener);
    }
  }
}
