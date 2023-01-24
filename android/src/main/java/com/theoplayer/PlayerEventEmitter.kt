package com.theoplayer

import android.util.Log
import android.view.View
import androidx.annotation.StringDef
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.ReactEventEmitter
import com.theoplayer.ads.AdEventAdapter
import com.theoplayer.ads.AdEventAdapter.AdEventEmitter
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.player.*
import com.theoplayer.android.api.event.track.mediatrack.audio.ActiveQualityChangedEvent
import com.theoplayer.android.api.event.track.mediatrack.audio.AudioTrackEventTypes
import com.theoplayer.android.api.event.track.mediatrack.audio.QualityChangedEvent
import com.theoplayer.android.api.event.track.mediatrack.audio.list.AudioTrackListEventTypes
import com.theoplayer.android.api.event.track.mediatrack.video.VideoTrackEventTypes
import com.theoplayer.android.api.event.track.mediatrack.video.list.VideoTrackListEventTypes
import com.theoplayer.android.api.event.track.texttrack.AddCueEvent
import com.theoplayer.android.api.event.track.texttrack.RemoveCueEvent
import com.theoplayer.android.api.event.track.texttrack.TextTrackEventTypes
import com.theoplayer.android.api.event.track.texttrack.list.AddTrackEvent
import com.theoplayer.android.api.event.track.texttrack.list.RemoveTrackEvent
import com.theoplayer.android.api.event.track.texttrack.list.TextTrackListEventTypes
import com.theoplayer.android.api.event.track.texttrack.list.TrackListChangeEvent
import com.theoplayer.android.api.event.track.tracklist.TrackListEvent
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack
import com.theoplayer.android.api.player.track.mediatrack.MediaTrackList
import com.theoplayer.android.api.player.track.mediatrack.quality.AudioQuality
import com.theoplayer.android.api.player.track.mediatrack.quality.Quality
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality
import com.theoplayer.android.api.player.track.texttrack.TextTrack
import com.theoplayer.cast.CastEventAdapter
import com.theoplayer.track.*
import com.theoplayer.util.TypeUtils.encodeInfNan
import kotlin.math.floor

private val TAG = PlayerEventEmitter::class.java.name

private const val EVENT_SOURCECHANGE = "onNativeSourceChange"
private const val EVENT_LOADSTART = "onNativeLoadStart"
private const val EVENT_LOADEDMETADATA = "onNativeLoadedMetadata"
private const val EVENT_LOADEDDATA = "onNativeLoadedData"
private const val EVENT_CANPLAY = "onNativeCanPlay"
private const val EVENT_PLAY = "onNativePlay"
private const val EVENT_PLAYING = "onNativePlaying"
private const val EVENT_PAUSE = "onNativePause"
private const val EVENT_ERROR = "onNativeError"
private const val EVENT_PROGRESS = "onNativeProgress"
private const val EVENT_SEEKING = "onNativeSeeking"
private const val EVENT_SEEKED = "onNativeSeeked"
private const val EVENT_ENDED = "onNativeEnded"
private const val EVENT_READYSTATECHANGE = "onNativeReadyStateChange"
private const val EVENT_TIMEUPDATE = "onNativeTimeUpdate"
private const val EVENT_DURATIONCHANGE = "onNativeDurationChange"
private const val EVENT_SEGMENTNOTFOUND = "onNativeSegmentNotFound"
private const val EVENT_TEXTTRACK_LIST_EVENT = "onNativeTextTrackListEvent"
private const val EVENT_TEXTTRACK_EVENT = "onNativeTextTrackEvent"
private const val EVENT_MEDIATRACK_LIST_EVENT = "onNativeMediaTrackListEvent"
private const val EVENT_MEDIATRACK_EVENT = "onNativeMediaTrackEvent"
private const val EVENT_AD_EVENT = "onNativeAdEvent"
private const val EVENT_FULLSCREEN_WILL_PRESENT = "onNativeFullscreenPlayerWillPresent"
private const val EVENT_FULLSCREEN_DID_PRESENT = "onNativeFullscreenPlayerDidPresent"
private const val EVENT_FULLSCREEN_WILL_DISMISS = "onNativeFullscreenPlayerWillDismiss"
private const val EVENT_FULLSCREEN_DID_DISMISS = "onNativeFullscreenPlayerDidDismiss"
private const val EVENT_CAST_EVENT = "onNativeCastEvent"

private const val EVENT_PROP_CURRENT_TIME = "currentTime"
private const val EVENT_PROP_CURRENT_PROGRAM_DATE_TIME = "currentProgramDateTime"
private const val EVENT_PROP_DURATION = "duration"
private const val EVENT_PROP_READYSTATE = "readyState"
private const val EVENT_PROP_ERROR = "error"
private const val EVENT_PROP_ERROR_CODE = "errorCode"
private const val EVENT_PROP_ERROR_MESSAGE = "errorMessage"
private const val EVENT_PROP_TEXT_TRACKS = "textTracks"
private const val EVENT_PROP_AUDIO_TRACKS = "audioTracks"
private const val EVENT_PROP_VIDEO_TRACKS = "videoTracks"
private const val EVENT_PROP_SELECTED_TEXT_TRACK = "selectedTextTrack"
private const val EVENT_PROP_SELECTED_AUDIO_TRACK = "selectedAudioTrack"
private const val EVENT_PROP_SELECTED_VIDEO_TRACK = "selectedVideoTrack"
private const val EVENT_PROP_SEEKABLE = "seekable"
private const val EVENT_PROP_START = "start"
private const val EVENT_PROP_END = "end"
private const val EVENT_PROP_RETRYCOUNT = "retryCount"
private const val EVENT_PROP_SEGMENTSTARTTIME = "segmentStartTime"
private const val EVENT_PROP_TRACK = "track"
private const val EVENT_PROP_TRACK_UID = "trackUid"
private const val EVENT_PROP_TRACK_TYPE = "trackType"
private const val EVENT_PROP_CUE = "cue"
private const val EVENT_PROP_TYPE = "type"
private const val EVENT_PROP_QUALITIES = "qualities"

@Suppress("UNCHECKED_CAST")
class PlayerEventEmitter internal constructor(
  reactContext: ReactApplicationContext,
  playerView: ReactTHEOplayerView
) {
  @Retention(AnnotationRetention.SOURCE)
  @StringDef(
    EVENT_SOURCECHANGE,
    EVENT_LOADSTART,
    EVENT_LOADEDMETADATA,
    EVENT_LOADEDDATA,
    EVENT_CANPLAY,
    EVENT_PLAY,
    EVENT_PLAYING,
    EVENT_PAUSE,
    EVENT_ERROR,
    EVENT_PROGRESS,
    EVENT_SEEKING,
    EVENT_SEEKED,
    EVENT_ENDED,
    EVENT_READYSTATECHANGE,
    EVENT_TIMEUPDATE,
    EVENT_DURATIONCHANGE,
    EVENT_SEGMENTNOTFOUND,
    EVENT_TEXTTRACK_LIST_EVENT,
    EVENT_TEXTTRACK_EVENT,
    EVENT_MEDIATRACK_LIST_EVENT,
    EVENT_MEDIATRACK_EVENT,
    EVENT_AD_EVENT,
    EVENT_FULLSCREEN_WILL_PRESENT,
    EVENT_FULLSCREEN_DID_PRESENT,
    EVENT_FULLSCREEN_WILL_DISMISS,
    EVENT_FULLSCREEN_DID_DISMISS,
    EVENT_CAST_EVENT
  )
  annotation class VideoEvents

  companion object {

    @JvmField
    val Events = arrayOf(
      EVENT_SOURCECHANGE,
      EVENT_LOADSTART,
      EVENT_LOADEDMETADATA,
      EVENT_LOADEDDATA,
      EVENT_CANPLAY,
      EVENT_PLAY,
      EVENT_PLAYING,
      EVENT_PAUSE,
      EVENT_ERROR,
      EVENT_PROGRESS,
      EVENT_SEEKING,
      EVENT_SEEKED,
      EVENT_ENDED,
      EVENT_READYSTATECHANGE,
      EVENT_TIMEUPDATE,
      EVENT_DURATIONCHANGE,
      EVENT_SEGMENTNOTFOUND,
      EVENT_TEXTTRACK_LIST_EVENT,
      EVENT_TEXTTRACK_EVENT,
      EVENT_MEDIATRACK_LIST_EVENT,
      EVENT_MEDIATRACK_EVENT,
      EVENT_AD_EVENT,
      EVENT_FULLSCREEN_WILL_PRESENT,
      EVENT_FULLSCREEN_DID_PRESENT,
      EVENT_FULLSCREEN_WILL_DISMISS,
      EVENT_FULLSCREEN_DID_DISMISS,
      EVENT_CAST_EVENT
    )
  }

  private val eventEmitter: ReactEventEmitter
  private var viewId = View.NO_ID
  private val playerListeners = HashMap<EventType<*>, EventListener<*>>()
  private val textTrackListeners = HashMap<EventType<*>, EventListener<*>>()
  private val audioTrackListeners = HashMap<EventType<*>, EventListener<*>>()
  private val videoTrackListeners = HashMap<EventType<*>, EventListener<*>>()
  private val playerView: ReactTHEOplayerView
  private val trackListAdapter = TrackListAdapter()
  private var adEventAdapter: AdEventAdapter? = null
  private var castEventAdapter: CastEventAdapter? = null
  private var lastTimeUpdate: Long = 0
  private var lastCurrentTime = 0.0

  init {
    eventEmitter = ReactEventEmitter(reactContext)
    this.playerView = playerView

    // Create listeners
    playerListeners[PlayerEventTypes.SOURCECHANGE] = EventListener<PlayerEvent<*>> {
      receiveEvent(EVENT_SOURCECHANGE, null)
    }
    playerListeners[PlayerEventTypes.LOADSTART] = EventListener<PlayerEvent<*>> {
      receiveEvent(EVENT_LOADSTART, null)
    }
    playerListeners[PlayerEventTypes.LOADEDMETADATA] =
      EventListener<PlayerEvent<*>> { onLoadedMetadata() }
    playerListeners[PlayerEventTypes.LOADEDDATA] = EventListener<PlayerEvent<*>> {
      receiveEvent(EVENT_LOADEDDATA, null)
    }
    playerListeners[PlayerEventTypes.CANPLAY] = EventListener<PlayerEvent<*>> {
      receiveEvent(EVENT_CANPLAY, null)
    }
    playerListeners[PlayerEventTypes.PLAY] = EventListener<PlayerEvent<*>> {
      receiveEvent(EVENT_PLAY, null)
    }
    playerListeners[PlayerEventTypes.PLAYING] = EventListener<PlayerEvent<*>> {
      receiveEvent(EVENT_PLAYING, null)
    }
    playerListeners[PlayerEventTypes.READYSTATECHANGE] =
      EventListener { event: ReadyStateChangeEvent -> onReadyState(event) }
    playerListeners[PlayerEventTypes.SEEKING] =
      EventListener { event: SeekingEvent -> onSeeking(event) }
    playerListeners[PlayerEventTypes.SEEKED] =
      EventListener { event: SeekedEvent -> onSeeked(event) }
    playerListeners[PlayerEventTypes.ERROR] =
      EventListener { event: ErrorEvent -> onError(event) }
    playerListeners[PlayerEventTypes.ENDED] =
      EventListener<PlayerEvent<*>> { receiveEvent(EVENT_ENDED, null) }
    playerListeners[PlayerEventTypes.PROGRESS] = EventListener<PlayerEvent<*>> { onProgress() }
    playerListeners[PlayerEventTypes.TIMEUPDATE] =
      EventListener { event: TimeUpdateEvent -> onTimeUpdate(event) }
    playerListeners[PlayerEventTypes.DURATIONCHANGE] =
      EventListener { event: DurationChangeEvent -> onDurationChange(event) }
    playerListeners[PlayerEventTypes.PAUSE] = EventListener<PlayerEvent<*>> { onPause() }
    playerListeners[PlayerEventTypes.SEGMENTNOTFOUND] =
      EventListener { event: SegmentNotFoundEvent -> onSegmentNotFound(event) }
    textTrackListeners[TextTrackListEventTypes.ADDTRACK] =
      EventListener { event: AddTrackEvent -> onTextTrackAdd(event) }
    textTrackListeners[TextTrackListEventTypes.REMOVETRACK] =
      EventListener { event: RemoveTrackEvent -> onTextTrackRemove(event) }
    textTrackListeners[TextTrackListEventTypes.TRACKLISTCHANGE] =
      EventListener { event: TrackListChangeEvent -> onTextTrackChange(event) }
    audioTrackListeners[AudioTrackListEventTypes.ADDTRACK] =
      EventListener { event: com.theoplayer.android.api.event.track.mediatrack.audio.list.AddTrackEvent ->
        onAudioTrackAdd(event)
      }
    audioTrackListeners[AudioTrackListEventTypes.REMOVETRACK] =
      EventListener { event: com.theoplayer.android.api.event.track.mediatrack.audio.list.RemoveTrackEvent ->
        onAudioTrackRemove(event)
      }
    audioTrackListeners[AudioTrackListEventTypes.TRACKLISTCHANGE] =
      EventListener { event: com.theoplayer.android.api.event.track.mediatrack.audio.list.TrackListChangeEvent ->
        onAudioTrackChange(event)
      }
    videoTrackListeners[VideoTrackListEventTypes.ADDTRACK] =
      EventListener { event: com.theoplayer.android.api.event.track.mediatrack.video.list.AddTrackEvent ->
        onVideoTrackAdd(event)
      }
    videoTrackListeners[VideoTrackListEventTypes.REMOVETRACK] =
      EventListener { event: com.theoplayer.android.api.event.track.mediatrack.video.list.RemoveTrackEvent ->
        onVideoTrackRemove(event)
      }
    videoTrackListeners[VideoTrackListEventTypes.TRACKLISTCHANGE] =
      EventListener { event: com.theoplayer.android.api.event.track.mediatrack.video.list.TrackListChangeEvent ->
        onVideoTrackChange(event)
      }
  }

  fun setViewId(viewId: Int) {
    this.viewId = viewId
  }

  fun emitError(exception: THEOplayerException) {
    emitError(exception.code.name, exception.message)
  }

  private fun emitError(code: String, message: String?) {
    val error = Arguments.createMap()
    error.putString(EVENT_PROP_ERROR_CODE, code)
    error.putString(EVENT_PROP_ERROR_MESSAGE, message ?: "")
    val payload = Arguments.createMap()
    payload.putMap(EVENT_PROP_ERROR, error)
    receiveEvent(EVENT_ERROR, payload)
  }

  private fun onLoadedMetadata() {
    val payload = Arguments.createMap()
    payload.putArray(EVENT_PROP_TEXT_TRACKS, playerView.textTrackInfo)
    payload.putArray(EVENT_PROP_AUDIO_TRACKS, playerView.audioTrackInfo)
    payload.putArray(EVENT_PROP_VIDEO_TRACKS, playerView.videoTrackInfo)
    val selectedTextTrack = playerView.selectedTextTrack
    if (selectedTextTrack != null) {
      payload.putInt(EVENT_PROP_SELECTED_TEXT_TRACK, selectedTextTrack.uid)
    }
    val selectedAudioTrack = playerView.selectedAudioTrack
    if (selectedAudioTrack != null) {
      payload.putInt(EVENT_PROP_SELECTED_AUDIO_TRACK, selectedAudioTrack.uid)
    }
    val selectedVideoTrack = playerView.selectedVideoTrack
    if (selectedVideoTrack != null) {
      payload.putInt(EVENT_PROP_SELECTED_VIDEO_TRACK, selectedVideoTrack.uid)
    }
    payload.putDouble(EVENT_PROP_DURATION, playerView.duration)
    receiveEvent(EVENT_LOADEDMETADATA, payload)
  }

  private fun onSeeking(event: SeekingEvent) {
    val payload = Arguments.createMap()
    payload.putDouble(EVENT_PROP_CURRENT_TIME, (1e03 * event.currentTime).toLong().toDouble())
    receiveEvent(EVENT_SEEKING, payload)
  }

  private fun onSeeked(event: SeekedEvent) {
    val payload = Arguments.createMap()
    payload.putDouble(EVENT_PROP_CURRENT_TIME, (1e03 * event.currentTime).toLong().toDouble())
    receiveEvent(EVENT_SEEKED, payload)
  }

  private fun shouldSkipTimeUpdate(now: Long, currentTime: Double): Boolean {
    val timeUpdateRate = BuildConfig.TIMEUPDATE_RATE

    // No limited update rate.
    if (timeUpdateRate == TimeUpdateRate.UNLIMITED) {
      return false
    }

    // Try to align updates on second boundary.
    if (floor(lastCurrentTime) != floor(currentTime)) {
      return false
    }

    // Limit update rate.
    val dt = now - lastTimeUpdate
    return timeUpdateRate == TimeUpdateRate.LIMITED_ONE_HZ && dt < 1e03 ||
      timeUpdateRate == TimeUpdateRate.LIMITED_TWO_HZ && dt < 500 ||
      timeUpdateRate == TimeUpdateRate.LIMITED_THREE_HZ && dt < 333
  }

  private fun onPause() {
    val player = playerView.player
    // Do not forward the pause event in case the content player is paused because the ad player starts.
    if (player != null && !playerView.adsApi.isPlaying) {
      receiveEvent(EVENT_PAUSE, null)
    }
  }

  private fun onTimeUpdate(event: TimeUpdateEvent) {
    val now = System.currentTimeMillis()
    val currentTime = event.currentTime

    // Check for limited timeUpdates
    if (shouldSkipTimeUpdate(now, currentTime)) {
      return
    }
    lastTimeUpdate = now
    lastCurrentTime = currentTime
    val payload = Arguments.createMap()
    payload.putDouble(EVENT_PROP_CURRENT_TIME, (1e03 * currentTime).toLong().toDouble())
    val currentProgramDateTime = event.currentProgramDateTime
    if (currentProgramDateTime != null) {
      payload.putDouble(
        EVENT_PROP_CURRENT_PROGRAM_DATE_TIME,
        (1e03 * currentProgramDateTime.time).toLong().toDouble()
      )
    }
    receiveEvent(EVENT_TIMEUPDATE, payload)
  }

  private fun onReadyState(event: ReadyStateChangeEvent) {
    val payload = Arguments.createMap()
    payload.putInt(EVENT_PROP_READYSTATE, event.readyState.ordinal)
    receiveEvent(EVENT_READYSTATECHANGE, payload)
  }

  private fun onDurationChange(event: DurationChangeEvent) {
    val payload = Arguments.createMap()
    payload.putDouble(EVENT_PROP_DURATION, encodeInfNan(1e03 * event.duration))
    receiveEvent(EVENT_DURATIONCHANGE, payload)
  }

  private fun onError(event: ErrorEvent) {
    emitError(event.errorObject)
  }

  private fun onProgress() {
    val timeRanges = playerView.getSeekableRange()
    val payload = Arguments.createMap()
    if (timeRanges != null) {
      val seekable = Arguments.createArray()
      for (i in 0 until timeRanges.length()) {
        val range = Arguments.createMap()
        range.putDouble(EVENT_PROP_START, 1e03 * timeRanges.getStart(i))
        range.putDouble(EVENT_PROP_END, 1e03 * timeRanges.getEnd(i))
        seekable.pushMap(range)
      }
      payload.putArray(EVENT_PROP_SEEKABLE, seekable)
    }
    receiveEvent(EVENT_PROGRESS, payload)
  }

  private fun onSegmentNotFound(event: SegmentNotFoundEvent) {
    val payload = Arguments.createMap()
    payload.putDouble(EVENT_PROP_SEGMENTSTARTTIME, 1e03 * event.segmentStartTime)
    payload.putString(EVENT_PROP_ERROR, event.error)
    payload.putInt(EVENT_PROP_RETRYCOUNT, event.retryCount)
    receiveEvent(EVENT_SEGMENTNOTFOUND, payload)
  }

  private fun dispatchTextTrackEvent(eventType: TrackEventType, textTrack: TextTrack) {
    val payload = Arguments.createMap()
    payload.putMap(EVENT_PROP_TRACK, playerView.getTextTrackInfo(textTrack))
    payload.putInt(EVENT_PROP_TYPE, eventType.type)
    when (eventType) {
      TrackEventType.ADD_TRACK -> {
        textTrack.addEventListener(TextTrackEventTypes.ADDCUE) { event: AddCueEvent ->
          onTextTrackAddCue(event)
        }
        textTrack.addEventListener(TextTrackEventTypes.REMOVECUE) { event: RemoveCueEvent ->
          onTextTrackRemoveCue(event)
        }
      }
      TrackEventType.REMOVE_TRACK -> {
        textTrack.removeEventListener(TextTrackEventTypes.ADDCUE) { event: AddCueEvent ->
          onTextTrackAddCue(event)
        }
        textTrack.removeEventListener(TextTrackEventTypes.REMOVECUE) { event: RemoveCueEvent ->
          onTextTrackRemoveCue(event)
        }
      }
      else -> {
        // Ignore
      }
    }
    receiveEvent(EVENT_TEXTTRACK_LIST_EVENT, payload)
  }

  private fun onTextTrackAdd(event: AddTrackEvent) {
    dispatchTextTrackEvent(TrackEventType.ADD_TRACK, event.track)
  }

  private fun onTextTrackRemove(event: RemoveTrackEvent) {
    dispatchTextTrackEvent(TrackEventType.REMOVE_TRACK, event.track)
  }

  private fun onTextTrackChange(event: TrackListChangeEvent) {
    dispatchTextTrackEvent(TrackEventType.CHANGE_TRACK, event.track)
  }

  private fun onTextTrackAddCue(event: AddCueEvent) {
    val payload = Arguments.createMap()
    payload.putInt(EVENT_PROP_TRACK_UID, event.track.uid)
    payload.putInt(EVENT_PROP_TYPE, TextTrackCueEventType.ADD_CUE.type)
    payload.putMap(EVENT_PROP_CUE, playerView.getTextTrackCueInfo(event.cue))
    receiveEvent(EVENT_TEXTTRACK_EVENT, payload)
  }

  private fun onTextTrackRemoveCue(event: RemoveCueEvent) {
    val payload = Arguments.createMap()
    payload.putInt(EVENT_PROP_TRACK_UID, event.track.uid)
    payload.putInt(EVENT_PROP_TYPE, TextTrackCueEventType.REMOVE_CUE.type)
    payload.putMap(EVENT_PROP_CUE, playerView.getTextTrackCueInfo(event.cue))
    receiveEvent(EVENT_TEXTTRACK_EVENT, payload)
  }

  private fun activeAudioTrack(): MediaTrack<AudioQuality>? {
    return if (playerView.player != null) activeTrack(
      playerView.player!!.audioTracks
    ) else null
  }

  private fun activeVideoTrack(): MediaTrack<VideoQuality>? {
    return if (playerView.player != null) activeTrack(
      playerView.player!!.videoTracks
    ) else null
  }

  private fun <T : Quality?> activeTrack(tracks: MediaTrackList<T>): MediaTrack<T>? {
    for (i in 0 until tracks.length()) {
      val track = tracks.getItem(i)
      if (track.isEnabled) {
        return track
      }
    }
    return null
  }

  private fun onActiveQualityChanged(event: QualityChangedEvent<*, *>) {
    val quality = event.quality
    val trackType = if (quality is AudioQuality) MediaTrackType.AUDIO else MediaTrackType.VIDEO
    val payload = Arguments.createMap()
    payload.putInt(EVENT_PROP_TYPE, MediaTrackEventType.ACTIVE_QUALITY_CHANGED.type)
    payload.putInt(EVENT_PROP_TRACK_TYPE, trackType.type)
    val activeTrack =
      if (trackType === MediaTrackType.AUDIO) activeAudioTrack() else activeVideoTrack()
    if (activeTrack != null) {
      payload.putInt(EVENT_PROP_TRACK_UID, activeTrack.uid)
    }
    val qualities = Arguments.createArray()
    qualities.pushMap(trackListAdapter.fromQuality(quality))
    payload.putArray(EVENT_PROP_QUALITIES, qualities)
    receiveEvent(EVENT_MEDIATRACK_EVENT, payload)
  }

  private fun <Q : Quality?> dispatchMediaTrackEvent(
    eventType: TrackEventType,
    trackType: MediaTrackType,
    track: MediaTrack<Q>
  ) {
    val payload = Arguments.createMap()
    payload.putInt(EVENT_PROP_TYPE, eventType.type)
    payload.putInt(EVENT_PROP_TRACK_TYPE, trackType.type)
    payload.putMap(EVENT_PROP_TRACK, trackListAdapter.fromMediaTrack(track, trackType))
    val qualityChangedEventType =
      (if (trackType === MediaTrackType.AUDIO)
        AudioTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT
      else VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT) as EventType<ActiveQualityChangedEvent>
    when (eventType) {
      TrackEventType.ADD_TRACK -> track.addEventListener(qualityChangedEventType) { event: QualityChangedEvent<*, *> ->
        onActiveQualityChanged(event)
      }
      TrackEventType.REMOVE_TRACK -> track.removeEventListener(qualityChangedEventType) { event: QualityChangedEvent<*, *> ->
        onActiveQualityChanged(event)
      }
      else -> { /* ignore */
      }
    }
    receiveEvent(EVENT_MEDIATRACK_LIST_EVENT, payload)
  }

  private fun onAudioTrackAdd(event: com.theoplayer.android.api.event.track.mediatrack.audio.list.AddTrackEvent) {
    dispatchMediaTrackEvent(TrackEventType.ADD_TRACK, MediaTrackType.AUDIO, event.track)
  }

  private fun onVideoTrackAdd(event: com.theoplayer.android.api.event.track.mediatrack.video.list.AddTrackEvent) {
    dispatchMediaTrackEvent(TrackEventType.ADD_TRACK, MediaTrackType.VIDEO, event.track)
  }

  private fun onAudioTrackRemove(event: com.theoplayer.android.api.event.track.mediatrack.audio.list.RemoveTrackEvent) {
    dispatchMediaTrackEvent(TrackEventType.REMOVE_TRACK, MediaTrackType.AUDIO, event.track)
  }

  private fun onVideoTrackRemove(event: com.theoplayer.android.api.event.track.mediatrack.video.list.RemoveTrackEvent) {
    dispatchMediaTrackEvent(TrackEventType.REMOVE_TRACK, MediaTrackType.VIDEO, event.track)
  }

  private fun onAudioTrackChange(event: com.theoplayer.android.api.event.track.mediatrack.audio.list.TrackListChangeEvent) {
    dispatchMediaTrackEvent(TrackEventType.CHANGE_TRACK, MediaTrackType.AUDIO, event.track)
  }

  private fun onVideoTrackChange(event: com.theoplayer.android.api.event.track.mediatrack.video.list.TrackListChangeEvent) {
    dispatchMediaTrackEvent(TrackEventType.CHANGE_TRACK, MediaTrackType.VIDEO, event.track)
  }

  fun onFullscreenWillPresent() {
    receiveEvent(EVENT_FULLSCREEN_WILL_PRESENT, null)
  }

  fun onFullscreenDidPresent() {
    receiveEvent(EVENT_FULLSCREEN_DID_PRESENT, null)
  }

  fun onFullscreenWillDismiss() {
    receiveEvent(EVENT_FULLSCREEN_WILL_DISMISS, null)
  }

  fun onFullscreenDidDismiss() {
    receiveEvent(EVENT_FULLSCREEN_DID_DISMISS, null)
  }

  private fun receiveEvent(@VideoEvents type: String, event: WritableMap?) {
    if (BuildConfig.LOG_PLAYER_EVENTS) {
      try {
        Log.d(TAG, "receiveEvent $type $event")
      } catch (ignore: RuntimeException) {
      }
    }
    eventEmitter.receiveEvent(viewId, type, event)
  }

  fun attachListeners(player: Player) {
    // Attach player listeners
    for ((key, value) in playerListeners) {
      player.addEventListener(
        key as EventType<PlayerEvent<*>>,
        value as EventListener<PlayerEvent<*>>
      )
    }

    // Attach text track listeners
    for ((key, value) in textTrackListeners) {
      player.textTracks.addEventListener(
        key as EventType<TrackListEvent<*, *>>,
        value as EventListener<TrackListEvent<*, *>>
      )
    }

    // Attach audio track listeners
    for ((key, value) in audioTrackListeners) {
      player.audioTracks.addEventListener(
        key as EventType<TrackListEvent<*, *>>,
        value as EventListener<TrackListEvent<*, *>>
      )
    }

    // Attach video track listeners
    for ((key, value) in videoTrackListeners) {
      player.videoTracks.addEventListener(
        key as EventType<TrackListEvent<*, *>>,
        value as EventListener<TrackListEvent<*, *>>
      )
    }

    // Attach AdStateHolder
    if (BuildConfig.EXTENSION_ADS) {
      adEventAdapter = AdEventAdapter(playerView.adsApi,
        object : AdEventEmitter {
          override fun emit(payload: WritableMap?) {
            receiveEvent(EVENT_AD_EVENT, payload)
          }
        })
    }
    if (BuildConfig.EXTENSION_CAST && playerView.castApi != null) {
      castEventAdapter = CastEventAdapter(playerView.castApi!!,
        object : CastEventAdapter.Emitter {
          override fun emit(payload: WritableMap?) {
            receiveEvent(EVENT_CAST_EVENT, payload)
          }
        })
    }
  }

  fun removeListeners(player: Player) {
    // Remove player listeners
    for ((key, value) in playerListeners) {
      player.removeEventListener(
        key as EventType<PlayerEvent<*>>,
        value as EventListener<PlayerEvent<*>>
      )
    }

    // Remove text track listeners
    for ((key, value) in textTrackListeners) {
      player.textTracks.removeEventListener(
        key as EventType<TrackListEvent<*, *>>,
        value as EventListener<TrackListEvent<*, *>>
      )
    }

    // Remove audio track listeners
    for ((key, value) in audioTrackListeners) {
      player.audioTracks.removeEventListener(
        key as EventType<TrackListEvent<*, *>>,
        value as EventListener<TrackListEvent<*, *>>
      )
    }

    // Remove video track listeners
    for ((key, value) in videoTrackListeners) {
      player.videoTracks.removeEventListener(
        key as EventType<TrackListEvent<*, *>>,
        value as EventListener<TrackListEvent<*, *>>
      )
    }
    castEventAdapter?.destroy()
    adEventAdapter?.destroy()
  }
}
