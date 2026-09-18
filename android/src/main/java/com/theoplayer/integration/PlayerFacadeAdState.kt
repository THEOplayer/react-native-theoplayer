package com.theoplayer.integration

import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak

/**
 * Advertising state supplied by [Integration.getAdState], independent of dispatched events.
 *
 * Experimental API: subject to change or removal without notice.
 *
 * @property playing Whether a linear advertisement is playing.
 * @property currentAds The currently active advertisements.
 * @property currentAdBreak The active ad break, or null. Null does not fall back to the native ad break.
 */
data class PlayerFacadeAdState(
  val playing: Boolean,
  val currentAds: List<Ad>,
  val currentAdBreak: AdBreak?,
)
