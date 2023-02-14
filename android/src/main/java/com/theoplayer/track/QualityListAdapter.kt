package com.theoplayer.track

import com.theoplayer.android.api.player.track.mediatrack.quality.Quality
import com.theoplayer.android.api.player.track.mediatrack.quality.QualityList
import java.util.*

fun <Q: Quality> emptyQualityList(): QualityList<Q>  {
  return QualityListAdapter()
}

/**
 * Adapts an Android List to a QualityList.
 */
class QualityListAdapter<Q : Quality> : QualityList<Q> {
  private var qualities: MutableList<Q>

  constructor() {
    this.qualities = arrayListOf()
  }

  constructor(qualities: MutableList<Q>) {
    this.qualities = qualities
  }

  constructor(qualities: QualityList<Q>) {
    this.qualities = ArrayList()
    for (quality in qualities) {
      this.qualities.add(quality)
    }
  }

  override fun length(): Int {
    return qualities.size
  }

  override fun getItem(i: Int): Q? {
    return if (i >= 0 && i < length()) qualities[i] else null
  }

  override fun iterator(): MutableIterator<Q?> {
    return qualities.iterator()
  }

  fun asList(): List<Q> {
    return qualities
  }

  fun sort(comparator: Comparator<Q>) {
    Collections.sort(qualities, comparator)
  }
}
