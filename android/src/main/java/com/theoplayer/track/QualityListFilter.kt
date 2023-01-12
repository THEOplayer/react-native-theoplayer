package com.theoplayer.track

import com.theoplayer.android.api.player.track.mediatrack.quality.Quality
import com.theoplayer.android.api.player.track.mediatrack.quality.QualityList
import com.facebook.react.bridge.ReadableArray
import java.util.ArrayList

/**
 * QualityListFilter allows filtering a QualityList.
 */
class QualityListFilter<Q : Quality>(private val qualities: QualityList<Q>) {

  fun filterQualityList(uids: ReadableArray): QualityList<Q> {
    return QualityListAdapter(filterList(uids))
  }

  private fun filterList(uids: ReadableArray): MutableList<Q> {
    val filteredQualities: MutableList<Q> = ArrayList()
    for (q in 0 until uids.size()) {
      for (quality in qualities) {
        if (uids.getInt(q) == quality.uid) {
          filteredQualities.add(quality)
        }
      }
    }
    return filteredQualities
  }
}
