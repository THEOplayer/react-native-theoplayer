package com.reactnativetheoplayer

import android.support.v4.media.MediaBrowserCompat
import android.support.v4.media.MediaDescriptionCompat
import com.theoplayer.android.api.source.SourceDescription
import com.theoplayer.android.api.source.TypedSource
import com.theoplayer.android.api.source.metadata.MetadataDescription
import androidx.core.net.toUri
import com.theoplayer.android.api.source.SourceType

class MediaLibrary() {
  private val sources: MutableMap<String, SourceDescription> = mutableMapOf()

  val mediaItems: List<MediaBrowserCompat.MediaItem>
    get() = sources.map { item ->
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

  init {
    sources["asset1"] = SourceDescription.Builder(
      TypedSource.Builder("https://cdn.theoplayer.com/video/adultswim/clip.m3u8")
        .type(SourceType.HLSX)
        .build()
    ).apply {
      metadata(
        MetadataDescription(
          mapOf(
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

    sources["asset2"] = SourceDescription.Builder(
      TypedSource.Builder("https://cdn.theoplayer.com/video/sintel/nosubs.m3u8")
        .type(SourceType.HLSX)
        .build()
    ).apply {
      metadata(
        MetadataDescription(
          mapOf(
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

    sources["asset3"] = SourceDescription.Builder(
      TypedSource.Builder("https://cdn.theoplayer.com/video/dash/bbb_30fps/bbb_with_multiple_tiled_thumbnails.mpd")
        .type(SourceType.DASH)
        .build()
    ).apply {
      metadata(
        MetadataDescription(
          mapOf(
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
  }

  fun sourceFromMediaId(mediaId: String?): SourceDescription? {
    return sources[mediaId]
  }
}
