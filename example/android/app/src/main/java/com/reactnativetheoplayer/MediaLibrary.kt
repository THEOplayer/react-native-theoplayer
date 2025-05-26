package com.reactnativetheoplayer

import android.support.v4.media.MediaBrowserCompat
import android.support.v4.media.MediaDescriptionCompat
import com.theoplayer.android.api.source.SourceDescription
import com.theoplayer.android.api.source.TypedSource
import com.theoplayer.android.api.source.metadata.MetadataDescription
import androidx.core.net.toUri
import com.theoplayer.android.api.source.SourceType

class MediaLibrary() {
  private val sourceMap: MutableMap<String, SourceDescription> = mutableMapOf()
  private val sources: MutableList<SourceDescription> = mutableListOf()

  val mediaItems: List<MediaBrowserCompat.MediaItem>
    get() = sourceMap.map { item ->
      MediaBrowserCompat.MediaItem(
        MediaDescriptionCompat.Builder()
          .setMediaId(item.key)
          .setTitle(item.value.metadata?.get("title"))
          .setSubtitle(item.value.metadata?.get("subtitle"))
          .setIconUri(item.value.poster?.toUri())
          .build(),
        MediaBrowserCompat.MediaItem.FLAG_PLAYABLE
      )
    }

  private fun addSource(key: String, source: SourceDescription) {
    sourceMap[key] = source
    sources.add(source)
  }

  init {
    addSource("asset1", SourceDescription.Builder(
        TypedSource.Builder("https://cdn.theoplayer.com/video/adultswim/clip.m3u8")
          .type(SourceType.HLSX)
          .build()
      ).apply {
        metadata(
          MetadataDescription(
            mutableMapOf(
              "title" to "The Venture Bros",
              "subtitle" to "Adult Swim",
              "album" to "React-Native THEOplayer demos",
              "displayIconUri" to "https://cdn.theoplayer.com/react-native-theoplayer/temp/THEOPlayer-200x200.png",
              "artist" to "THEOplayer",
              "type" to "tv-show",
              "releaseDate" to "november 29th",
              "releaseYear" to 1997
            )
          )
        )
      }.build()
    )

    addSource("asset2", SourceDescription.Builder(
        TypedSource.Builder("https://cdn.theoplayer.com/video/sintel/nosubs.m3u8")
          .type(SourceType.HLSX)
          .build()
      ).apply {
        metadata(
          MetadataDescription(
            mutableMapOf(
              "title" to "Sintel",
              "subtitle" to "HLS - Sideloaded Chapters",
              "album" to "React-Native THEOplayer demos",
              "displayIconUri" to "https://cdn.theoplayer.com/video/sintel_old/poster.jpg",
              "artist" to "THEOplayer",
              "type" to "tv-show",
              "releaseDate" to "november 29th",
              "releaseYear" to 1997
            )
          )
        )
      }.build()
    )

    addSource("asset3", SourceDescription.Builder(
        TypedSource.Builder("https://cdn.theoplayer.com/video/dash/bbb_30fps/bbb_with_multiple_tiled_thumbnails.mpd")
          .type(SourceType.DASH)
          .build()
      ).apply {
        metadata(
          MetadataDescription(
            mutableMapOf(
              "title" to "Big Buck Bunny",
              "subtitle" to "DASH - Thumbnails in manifest",
              "album" to "React-Native THEOplayer demos",
              "displayIconUri" to "https://cdn.theoplayer.com/video/big_buck_bunny/poster.jpg",
              "artist" to "THEOplayer",
              "type" to "tv-show",
              "releaseDate" to "november 29th",
              "releaseYear" to 1997
            )
          )
        )
      }.build()
    )
  }

  fun sourceFromMediaId(mediaId: String?): SourceDescription? {
    return sourceMap[mediaId]
  }

  fun itemIdFromSource(sourceDescription: SourceDescription?): Long {
    return sources.indexOf(sourceDescription).toLong()
  }

  fun nextSource(sourceDescription: SourceDescription?): SourceDescription? {
    return itemIdFromSource(sourceDescription).let { itemId ->
      if (itemId == -1L) null else sources[(itemId.toInt() + 1).mod(sources.size)]
    }
  }

  fun prevSource(sourceDescription: SourceDescription?): SourceDescription? {
    return itemIdFromSource(sourceDescription).let { itemId ->
      if (itemId == -1L) null else sources[(itemId.toInt() - 1).mod(sources.size)]
    }
  }
}
