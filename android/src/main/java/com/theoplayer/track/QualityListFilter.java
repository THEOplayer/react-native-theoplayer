package com.theoplayer.track;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableArray;
import com.theoplayer.android.api.player.track.mediatrack.quality.Quality;
import com.theoplayer.android.api.player.track.mediatrack.quality.QualityList;

import java.util.ArrayList;
import java.util.List;

/**
 * QualityListFilter allows filtering a QualityList.
 */
public class QualityListFilter<Q extends Quality> {

  private final QualityList<Q> qualities;

  public QualityListFilter(QualityList<Q> qualities) {
    this.qualities = qualities;
  }

  @NonNull
  public QualityList<Q> filterQualityList(ReadableArray uids) {
    return new QualityListAdapter<Q>(filterList(uids));
  }

  @NonNull
  public List<Q> filterList(ReadableArray uids) {
    final List<Q> filteredQualities = new ArrayList<>();
    for (int q = 0; q < uids.size(); q++) {
      for (final Q quality : qualities) {
        if (uids.getInt(q) == quality.getUid()) {
          filteredQualities.add(quality);
        }
      }
    }
    return filteredQualities;
  }
}
