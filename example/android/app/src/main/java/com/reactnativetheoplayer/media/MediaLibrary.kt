package com.reactnativetheoplayer.media

import android.support.v4.media.MediaBrowserCompat
import android.support.v4.media.MediaDescriptionCompat
import androidx.core.net.toUri
import com.theoplayer.android.api.source.SourceDescription
import com.theoplayer.android.api.source.SourceType
import com.theoplayer.android.api.source.TypedSource
import com.theoplayer.android.api.source.metadata.MetadataDescription
import kotlin.collections.get

class MediaLibrary() {
  private var source: SourceDescription? = null
  private val sourceMap: MutableMap<String, SourceDescription> = mutableMapOf()
  private val sources: MutableList<SourceDescription> = mutableListOf()

  val mediaItems: List<MediaBrowserCompat.MediaItem>
    get() = sourceMap.map { item ->
      MediaBrowserCompat.MediaItem(
        MediaDescriptionCompat.Builder().setMediaId(item.key)
          .setTitle(item.value.metadata?.get("title"))
          .setSubtitle(item.value.metadata?.get("subtitle")).setIconUri(item.value.poster?.toUri())
          .build(), MediaBrowserCompat.MediaItem.FLAG_PLAYABLE
      )
    }

  val currentSource: SourceDescription?
    get() = source

  private fun addSource(key: String, src: SourceDescription) {
    sourceMap[key] = src
    sources.add(src)
    if (source == null) {
      source = src
    }
  }

  init {
    addSource(
      "asset1", SourceDescription.Builder(
        TypedSource.Builder("https://cdn.theoplayer.com/video/adultswim/clip.m3u8")
          .type(SourceType.HLSX).build()
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

    addSource(
      "asset2", SourceDescription.Builder(
        TypedSource.Builder("https://cdn.theoplayer.com/video/sintel/nosubs.m3u8")
          .type(SourceType.HLSX).build()
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

    addSource(
      "asset3", SourceDescription.Builder(
        TypedSource.Builder("https://cdn.theoplayer.com/video/dash/bbb_30fps/bbb_with_multiple_tiled_thumbnails.mpd")
          .type(SourceType.DASH).build()
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

  private fun itemIdFromSource(sourceDescription: SourceDescription?): Long {
    return sources.indexOf(sourceDescription).toLong()
  }

  fun setSourceFromMediaId(mediaId: String?): SourceDescription? {
    source = sourceMap[mediaId]
    return source
  }

  fun setSourceFromItemId(itemId: Long): SourceDescription? {
    val index = itemId.toInt()
    source = if (index in sources.indices) sources[index] else null
    return source
  }

  fun currentItemId(): Long {
    return sources.indexOf(source).toLong()
  }

  fun nextSource(): SourceDescription? {
    source = itemIdFromSource(source).let { itemId ->
      if (itemId == -1L) null else sources[(itemId.toInt() + 1).mod(sources.size)]
    }
    return source
  }

  fun prevSource(): SourceDescription? {
    source = itemIdFromSource(source).let { itemId ->
      if (itemId == -1L) null else sources[(itemId.toInt() - 1).mod(sources.size)]
    }
    return source
  }
}
