package com.theoplayer.track

import com.theoplayer.android.api.player.track.mediatrack.quality.Quality
import com.theoplayer.android.api.player.track.mediatrack.quality.QualityList
import java.util.*

/**
 * Adapts an Android List to a QualityList.
 */
class QualityListAdapter<Q : Quality>(qualities: QualityList<Q>) : QualityList<Q> {
  private var qualities: MutableList<Q> = ArrayList()

  init {
    for (quality in qualities) {
      this.qualities.add(quality)
    }
  }

  override fun length(): Int {
    return qualities.size
  }

  override fun getItem(i: Int): Q {
    return qualities[i]
  }

  override fun iterator(): MutableIterator<Q?> {
    return qualities.iterator()
  }

  fun sort(comparator: Comparator<Q>) {
    Collections.sort(qualities, comparator)
  }
}
