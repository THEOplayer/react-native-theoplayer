package com.theoplayer.track;

import androidx.annotation.NonNull;

import com.theoplayer.android.api.player.track.mediatrack.quality.Quality;
import com.theoplayer.android.api.player.track.mediatrack.quality.QualityList;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

/**
 * Adapts an Android List to a QualityList.
 */
public class QualityListAdapter<Q extends Quality> implements QualityList<Q> {
  private List<Q> qualities;

  public QualityListAdapter(@NonNull List<Q> qualities) {
    this.qualities = qualities;
  }

  public QualityListAdapter(@NonNull QualityList<Q> qualities) {
    this.qualities = new ArrayList<Q>();
    for (final Q quality : qualities) {
      this.qualities.add(quality);
    }
  }

  @Override
  public int length() {
    return qualities.size();
  }

  @Override
  public Q getItem(int i) {
    return (i >= 0 && i < length()) ? qualities.get(i) : null;
  }

  @NonNull
  @Override
  public Iterator<Q> iterator() {
    return qualities.iterator();
  }

  public List<Q> asList() {
    return qualities;
  }

  public void sort(Comparator<Q> comparator) {
    Collections.sort(qualities, comparator);
  }
}
