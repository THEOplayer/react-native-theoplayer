package com.theoplayer

import android.util.Log
import android.view.View
import androidx.annotation.StringDef
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType
import com.theoplayer.ads.AdEventAdapter
import com.theoplayer.ads.AdEventAdapter.AdEventEmitter
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.ads.theoads.theoAds
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.player.*
import com.theoplayer.android.api.event.track.mediatrack.audio.AudioTrackEventTypes
import com.theoplayer.android.api.event.track.mediatrack.audio.QualityChangedEvent
import com.theoplayer.android.api.event.track.mediatrack.audio.list.AudioTrackListEventTypes
import com.theoplayer.android.api.event.track.mediatrack.video.VideoTrackEventTypes
import com.theoplayer.android.api.event.track.mediatrack.video.list.VideoTrackListEventTypes
import com.theoplayer.android.api.event.track.texttrack.AddCueEvent
import com.theoplayer.android.api.event.track.texttrack.EnterCueEvent
import com.theoplayer.android.api.event.track.texttrack.ExitCueEvent
import com.theoplayer.android.api.event.track.texttrack.RemoveCueEvent
import com.theoplayer.android.api.event.track.texttrack.TextTrackEventTypes
import com.theoplayer.android.api.event.track.texttrack.list.AddTrackEvent
import com.theoplayer.android.api.event.track.texttrack.list.RemoveTrackEvent
import com.theoplayer.android.api.event.track.texttrack.list.TextTrackListEventTypes
import com.theoplayer.android.api.event.track.texttrack.list.TrackListChangeEvent
import com.theoplayer.android.api.event.track.tracklist.TrackListEvent
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.api.player.PresentationMode
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack
import com.theoplayer.android.api.player.track.mediatrack.MediaTrackList
import com.theoplayer.android.api.player.track.mediatrack.quality.AudioQuality
import com.theoplayer.android.api.player.track.mediatrack.quality.Quality
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality
import com.theoplayer.android.api.player.track.texttrack.TextTrack
import com.theoplayer.android.api.player.track.texttrack.TextTrackKind
import com.theoplayer.android.api.player.track.texttrack.TextTrackMode
import com.theoplayer.cast.CastEventAdapter
import com.theoplayer.presentation.PresentationModeChangeContext
import com.theoplayer.theoads.THEOadsEventAdapter
import com.theoplayer.theolive.THEOliveEventAdapter
import com.theoplayer.track.*
import com.theoplayer.util.PayloadBuilder
import kotlin.math.floor

private val TAG = PlayerEventEmitter::class.java.name

private const val EVENT_PLAYER_READY = "onNativePlayerReady"
private const val EVENT_PLAYER_STATE_SYNC = "onNativePlayerStateSync"
private const val EVENT_SOURCECHANGE = "onNativeSourceChange"
private const val EVENT_LOADSTART = "onNativeLoadStart"
private const val EVENT_LOADEDMETADATA = "onNativeLoadedMetadata"
private const val EVENT_LOADEDDATA = "onNativeLoadedData"
private const val EVENT_CANPLAY = "onNativeCanPlay"
private const val EVENT_PLAY = "onNativePlay"
private const val EVENT_PLAYING = "onNativePlaying"
private const val EVENT_WAITING = "onNativeWaiting"
private const val EVENT_PAUSE = "onNativePause"
private const val EVENT_ERROR = "onNativeError"
private const val EVENT_PROGRESS = "onNativeProgress"
private const val EVENT_SEEKING = "onNativeSeeking"
private const val EVENT_SEEKED = "onNativeSeeked"
private const val EVENT_ENDED = "onNativeEnded"
private const val EVENT_READYSTATECHANGE = "onNativeReadyStateChange"
private const val EVENT_TIMEUPDATE = "onNativeTimeUpdate"
private const val EVENT_DURATIONCHANGE = "onNativeDurationChange"
private const val EVENT_RATECHANGE = "onNativeRateChange"
private const val EVENT_SEGMENTNOTFOUND = "onNativeSegmentNotFound"
private const val EVENT_TEXTTRACK_LIST_EVENT = "onNativeTextTrackListEvent"
private const val EVENT_TEXTTRACK_EVENT = "onNativeTextTrackEvent"
private const val EVENT_MEDIATRACK_LIST_EVENT = "onNativeMediaTrackListEvent"
private const val EVENT_MEDIATRACK_EVENT = "onNativeMediaTrackEvent"
private const val EVENT_AD_EVENT = "onNativeAdEvent"
private const val EVENT_CAST_EVENT = "onNativeCastEvent"
private const val EVENT_THEOLIVE_EVENT = "onNativeTHEOliveEvent"
private const val EVENT_THEOADS_EVENT = "onNativeTHEOadsEvent"
private const val EVENT_PRESENTATIONMODECHANGE = "onNativePresentationModeChange"
private const val EVENT_VOLUMECHANGE = "onNativeVolumeChange"
private const val EVENT_DIMENSIONCHANGE = "onNativeDimensionChange"
private const val EVENT_VIDEORESIZE = "onNativeVideoResize"

private const val EVENT_PROP_TYPE = "type"
private const val EVENT_PROP_STATE = "state"
private const val EVENT_PROP_VERSION = "version"
private const val EVENT_PROP_SUITE_VERSION = "playerSuiteVersion"

@Suppress("UNCHECKED_CAST")
class PlayerEventEmitter internal constructor(
  private val reactContext: ReactApplicationContext,
  private val playerView: ReactTHEOplayerView
) {
  @Retention(AnnotationRetention.SOURCE)
  @StringDef(
    EVENT_PLAYER_READY,
    EVENT_PLAYER_STATE_SYNC,
    EVENT_SOURCECHANGE,
    EVENT_LOADSTART,
    EVENT_LOADEDMETADATA,
    EVENT_LOADEDDATA,
    EVENT_CANPLAY,
    EVENT_PLAY,
    EVENT_PLAYING,
    EVENT_WAITING,
    EVENT_PAUSE,
    EVENT_ERROR,
    EVENT_PROGRESS,
    EVENT_SEEKING,
    EVENT_SEEKED,
    EVENT_ENDED,
    EVENT_READYSTATECHANGE,
    EVENT_TIMEUPDATE,
    EVENT_DURATIONCHANGE,
    EVENT_RATECHANGE,
    EVENT_SEGMENTNOTFOUND,
    EVENT_TEXTTRACK_LIST_EVENT,
    EVENT_TEXTTRACK_EVENT,
    EVENT_MEDIATRACK_LIST_EVENT,
    EVENT_MEDIATRACK_EVENT,
    EVENT_AD_EVENT,
    EVENT_CAST_EVENT,
    EVENT_THEOLIVE_EVENT,
    EVENT_THEOADS_EVENT,
    EVENT_PRESENTATIONMODECHANGE,
    EVENT_VOLUMECHANGE,
    EVENT_DIMENSIONCHANGE,
    EVENT_VIDEORESIZE
  )
  annotation class VideoEvents

  companion object {
    val Events = arrayOf(
      EVENT_PLAYER_READY,
      EVENT_PLAYER_STATE_SYNC,
      EVENT_SOURCECHANGE,
      EVENT_LOADSTART,
      EVENT_LOADEDMETADATA,
      EVENT_LOADEDDATA,
      EVENT_CANPLAY,
      EVENT_PLAY,
      EVENT_PLAYING,
      EVENT_WAITING,
      EVENT_PAUSE,
      EVENT_ERROR,
      EVENT_PROGRESS,
      EVENT_SEEKING,
      EVENT_SEEKED,
      EVENT_ENDED,
      EVENT_READYSTATECHANGE,
      EVENT_TIMEUPDATE,
      EVENT_DURATIONCHANGE,
      EVENT_RATECHANGE,
      EVENT_SEGMENTNOTFOUND,
      EVENT_TEXTTRACK_LIST_EVENT,
      EVENT_TEXTTRACK_EVENT,
      EVENT_MEDIATRACK_LIST_EVENT,
      EVENT_MEDIATRACK_EVENT,
      EVENT_AD_EVENT,
      EVENT_CAST_EVENT,
      EVENT_THEOLIVE_EVENT,
      EVENT_THEOADS_EVENT,
      EVENT_PRESENTATIONMODECHANGE,
      EVENT_VOLUMECHANGE,
      EVENT_DIMENSIONCHANGE,
      EVENT_VIDEORESIZE
    )
  }

  private var viewId = View.NO_ID
  private val playerListeners = HashMap<EventType<*>, EventListener<*>>()
  private val textTrackListeners = HashMap<EventType<*>, EventListener<*>>()
  private val audioTrackListeners = HashMap<EventType<*>, EventListener<*>>()
  private val videoTrackListeners = HashMap<EventType<*>, EventListener<*>>()
  private var adEventAdapter: AdEventAdapter? = null
  private var castEventAdapter: CastEventAdapter? = null
  private var theoLiveEventAdapter: THEOliveEventAdapter? = null
  private var theoAdsEventAdapter: THEOadsEventAdapter? = null
  private var lastTimeUpdate: Long = 0
  private var lastCurrentTime = 0.0
  private var dimensionChangeListener = View.OnLayoutChangeListener { v, _, _, _, _, oldLeft, oldTop, oldRight, oldBottom ->
    if (v.width != oldRight - oldLeft || v.height != oldBottom - oldTop) {
      onDimensionChange(v.width, v.height)
    }
  }

  init {

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
    playerListeners[PlayerEventTypes.WAITING] = EventListener<PlayerEvent<*>> {
      receiveEvent(EVENT_WAITING, null)
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
    playerListeners[PlayerEventTypes.RATECHANGE] =
      EventListener { event: RateChangeEvent -> onRateChange(event) }
    playerListeners[PlayerEventTypes.PAUSE] = EventListener<PlayerEvent<*>> { onPause() }
    playerListeners[PlayerEventTypes.SEGMENTNOTFOUND] =
      EventListener { event: SegmentNotFoundEvent -> onSegmentNotFound(event) }
    playerListeners[PlayerEventTypes.PRESENTATIONMODECHANGE] =
      EventListener { event: PresentationModeChange -> onPresentationModeChange(event) }
    playerListeners[PlayerEventTypes.VOLUMECHANGE] =
      EventListener { event: VolumeChangeEvent -> onVolumeChange(event) }
    playerListeners[PlayerEventTypes.RESIZE] =
      EventListener { event: ResizeEvent -> onResize(event) }
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
    emitError(exception.code.id.toString(), exception.message)
  }

  fun emitPresentationModeChange(
    presentationMode: PresentationMode,
    prevPresentationMode: PresentationMode?,
    context: PresentationModeChangeContext? = null
  ) {
    receiveEvent(
      EVENT_PRESENTATIONMODECHANGE,
      PayloadBuilder().presentationMode(presentationMode, prevPresentationMode, context).build()
    )
  }

  fun preparePlayer(player: Player) {
    attachListeners(player)
    emitPlayerReady(player)
  }

  fun emitPlayerReady(player: Player) {
    val payload = Arguments.createMap().apply {
      putMap(EVENT_PROP_STATE, collectPlayerState())
      putMap(EVENT_PROP_VERSION, WritableNativeMap().apply {
        putString(EVENT_PROP_VERSION, THEOplayerGlobal.getVersion())
        putString(EVENT_PROP_SUITE_VERSION, "")
      })
    }

    // Notify the player is ready
    receiveEvent(EVENT_PLAYER_READY, payload)
  }

  fun emitPlayerStateSync() {
      val payload = Arguments.createMap().apply {
        putMap(EVENT_PROP_STATE, collectPlayerState())
      }
      receiveEvent(EVENT_PLAYER_STATE_SYNC, payload)
  }

  private fun collectPlayerState(): WritableMap {
    val player = playerView.player
    if (player != null) {
      return PayloadBuilder()
        .source(player.source)
        .currentTime(player.currentTime)
        .currentProgramDateTime(player.currentProgramDateTime)
        .paused(player.isPaused)
        .playbackRate(player.playbackRate)
        .duration(player.duration)
        .volume(player.volume, player.isMuted)
        .seekable(player.seekable)
        .buffered(player.buffered)
        .textTracks(player.textTracks)
        .audioTracks(player.audioTracks)
        .videoTracks(player.videoTracks)
        .selectedTextTrack(getSelectedTextTrack(player))
        .selectedAudioTrack(getSelectedAudioTrack(player))
        .selectedVideoTrack(getSelectedVideoTrack(player))
        .build()
    }

    return Arguments.createMap()
  }

  private fun emitError(code: String, message: String?) {
    receiveEvent(EVENT_ERROR, PayloadBuilder().error(code, message).build())
  }

  private fun onLoadedMetadata() {
    playerView.player?.let {
      receiveEvent(
        EVENT_LOADEDMETADATA, PayloadBuilder()
          .textTracks(it.textTracks)
          .audioTracks(it.audioTracks)
          .videoTracks(it.videoTracks)
          .selectedTextTrack(getSelectedTextTrack(it))
          .selectedAudioTrack(getSelectedAudioTrack(it))
          .selectedVideoTrack(getSelectedVideoTrack(it))
          .duration(it.duration)
          .build()
      )
    }
  }

  private fun onSeeking(event: SeekingEvent) {
    receiveEvent(EVENT_SEEKING, PayloadBuilder().currentTime(event.currentTime).build())
  }

  private fun onSeeked(event: SeekedEvent) {
    receiveEvent(EVENT_SEEKED, PayloadBuilder().currentTime(event.currentTime).build())
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
    return timeUpdateRate == TimeUpdateRate.LIMITED_ONE_HZ && dt < 1e3 ||
      timeUpdateRate == TimeUpdateRate.LIMITED_TWO_HZ && dt < 500 ||
      timeUpdateRate == TimeUpdateRate.LIMITED_THREE_HZ && dt < 333
  }

  private fun onPause() {
    val player = playerView.player
    // Do not forward the pause event in case the content player is paused because the ad player starts.
    if (player != null && (!playerView.adsApi.isPlaying || player.isPaused)) {
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
    receiveEvent(
      EVENT_TIMEUPDATE, PayloadBuilder()
        .currentTime(currentTime)
        .currentProgramDateTime(event.currentProgramDateTime)
        .build()
    )
  }

  private fun onReadyState(event: ReadyStateChangeEvent) {
    receiveEvent(EVENT_READYSTATECHANGE, PayloadBuilder().readyState(event.readyState).build())
  }

  private fun onDurationChange(event: DurationChangeEvent) {
    receiveEvent(EVENT_DURATIONCHANGE, PayloadBuilder().duration(event.duration).build())
  }

  private fun onRateChange(event: RateChangeEvent) {
    receiveEvent(EVENT_RATECHANGE, PayloadBuilder().playbackRate(event.playbackRate).build())
  }

  private fun onError(event: ErrorEvent) {
    emitError(event.errorObject)
  }

  private fun onProgress() {
    receiveEvent(
      EVENT_PROGRESS, PayloadBuilder()
        .seekable(playerView.player?.seekable)
        .buffered(playerView.player?.buffered)
        .build()
    )
  }

  private fun onSegmentNotFound(event: SegmentNotFoundEvent) {
    receiveEvent(
      EVENT_SEGMENTNOTFOUND,
      PayloadBuilder().segmentNotFound(event.segmentStartTime, event.error, event.retryCount)
        .build()
    )
  }

  private fun onPresentationModeChange(event: PresentationModeChange) {
    emitPresentationModeChange(
      event.presentationMode,
      playerView.presentationManager?.currentPresentationMode
    )
  }

  private fun onVolumeChange(event: VolumeChangeEvent) {
    receiveEvent(
      EVENT_VOLUMECHANGE,
      PayloadBuilder().volume(event.volume, playerView.player?.isMuted ?: false).build()
    )
  }

  private fun onDimensionChange(width: Int, height: Int) {
    receiveEvent(
      EVENT_DIMENSIONCHANGE,
      PayloadBuilder().size(width, height).build()
    )
  }

  private fun onResize(event: ResizeEvent) {
    receiveEvent(
      EVENT_VIDEORESIZE,
      PayloadBuilder().videoSize(event.width, event.height).build()
    )
  }

  private val onTextTrackAddCue = EventListener<AddCueEvent> { event ->
    val payload = PayloadBuilder().textTrackCue(event.cue, event.track).build().apply {
      putInt(EVENT_PROP_TYPE, TextTrackCueEventType.ADD_CUE.type)
    }
    receiveEvent(EVENT_TEXTTRACK_EVENT, payload)
  }

  private val onTextTrackRemoveCue = EventListener<RemoveCueEvent> { event ->
    val payload = PayloadBuilder().textTrackCue(event.cue, event.track).build().apply {
      putInt(EVENT_PROP_TYPE, TextTrackCueEventType.REMOVE_CUE.type)
    }
    receiveEvent(EVENT_TEXTTRACK_EVENT, payload)
  }

  private val onTextTrackEnterCue = EventListener<EnterCueEvent> { event ->
    val payload = PayloadBuilder().textTrackCue(event.cue, event.track).build().apply {
      putInt(EVENT_PROP_TYPE, TextTrackCueEventType.ENTER_CUE.type)
    }
    receiveEvent(EVENT_TEXTTRACK_EVENT, payload)
  }

  private val onTextTrackExitCue = EventListener<ExitCueEvent> { event ->
    val payload = PayloadBuilder().textTrackCue(event.cue, event.track).build().apply {
      putInt(EVENT_PROP_TYPE, TextTrackCueEventType.EXIT_CUE.type)
    }
    receiveEvent(EVENT_TEXTTRACK_EVENT, payload)
  }

  private fun dispatchTextTrackEvent(eventType: TrackEventType, textTrack: TextTrack) {
    val payload = PayloadBuilder().textTrack(textTrack).build().apply {
      putInt(EVENT_PROP_TYPE, eventType.type)
    }
    when (eventType) {
      TrackEventType.ADD_TRACK -> {
        textTrack.addEventListener(TextTrackEventTypes.ADDCUE, onTextTrackAddCue)
        textTrack.addEventListener(TextTrackEventTypes.REMOVECUE, onTextTrackRemoveCue)
        textTrack.addEventListener(TextTrackEventTypes.ENTERCUE, onTextTrackEnterCue)
        textTrack.addEventListener(TextTrackEventTypes.EXITCUE, onTextTrackExitCue)
      }
      TrackEventType.REMOVE_TRACK -> {
        textTrack.removeEventListener(TextTrackEventTypes.ADDCUE, onTextTrackAddCue)
        textTrack.removeEventListener(TextTrackEventTypes.REMOVECUE, onTextTrackRemoveCue)
        textTrack.removeEventListener(TextTrackEventTypes.ENTERCUE, onTextTrackEnterCue)
        textTrack.removeEventListener(TextTrackEventTypes.EXITCUE, onTextTrackExitCue)
      }
      else -> {
        // Ignore
      }
    }
    receiveEvent(EVENT_TEXTTRACK_LIST_EVENT, payload)
  }

  private fun onTextTrackAdd(event: AddTrackEvent) {
    // By default, set metadata tracks to mode 'hidden', until we add an API to set the mode.
    if (event.track.kind == TextTrackKind.METADATA.type) {
      event.track.mode = TextTrackMode.HIDDEN
    }
    dispatchTextTrackEvent(TrackEventType.ADD_TRACK, event.track)
  }

  private fun onTextTrackRemove(event: RemoveTrackEvent) {
    dispatchTextTrackEvent(TrackEventType.REMOVE_TRACK, event.track)
  }

  private fun onTextTrackChange(event: TrackListChangeEvent) {
    dispatchTextTrackEvent(TrackEventType.CHANGE_TRACK, event.track)
  }

  private fun activeAudioTrack(): MediaTrack<AudioQuality>? {
    return activeTrack(playerView.player?.audioTracks)
  }

  private fun activeVideoTrack(): MediaTrack<VideoQuality>? {
    return activeTrack(playerView.player?.videoTracks)
  }

  private fun <T : Quality?> activeTrack(tracks: MediaTrackList<T>?): MediaTrack<T>? {
    return tracks?.firstOrNull { track ->
      track.isEnabled
    }
  }

  private val onActiveQualityChanged = EventListener<QualityChangedEvent<*, *>> { event ->
    val quality = event.quality
    val trackType = if (quality is AudioQuality) MediaTrackType.AUDIO else MediaTrackType.VIDEO
    val activeTrack =
      if (trackType === MediaTrackType.AUDIO) activeAudioTrack() else activeVideoTrack()
    val payload = PayloadBuilder().mediaTrackQualities(event.quality, activeTrack).build().apply {
      putInt(EVENT_PROP_TYPE, MediaTrackEventType.ACTIVE_QUALITY_CHANGED.type)
    }
    receiveEvent(EVENT_MEDIATRACK_EVENT, payload)
  }

  private fun <Q : Quality?> dispatchMediaTrackEvent(
    eventType: TrackEventType,
    trackType: MediaTrackType,
    track: MediaTrack<Q>
  ) {
    val payload = PayloadBuilder().mediaTrack(trackType, track).build().apply {
      putInt(EVENT_PROP_TYPE, eventType.type)
    }
    val qualityChangedEventType =
      (if (trackType === MediaTrackType.AUDIO)
        AudioTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT
      else VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT)
    when (eventType) {
      TrackEventType.ADD_TRACK -> track.addEventListener(
        qualityChangedEventType,
        onActiveQualityChanged
      )
      TrackEventType.REMOVE_TRACK -> track.removeEventListener(
        qualityChangedEventType,
        onActiveQualityChanged
      )
      else -> { /* ignore */
      }
    }
    receiveEvent(EVENT_MEDIATRACK_LIST_EVENT, payload)
  }

  private fun getSelectedTextTrack(player: Player): TextTrack? {
    for (track in player.textTracks) {
      if (track.mode == TextTrackMode.SHOWING) {
        return track
      }
    }
    return null
  }

  private fun getSelectedAudioTrack(player: Player): MediaTrack<AudioQuality>? {
    for (track in player.audioTracks) {
      if (track.isEnabled) {
        return track
      }
    }
    return null
  }

  private fun getSelectedVideoTrack(player: Player): MediaTrack<VideoQuality>? {
    for (track in player.videoTracks) {
      if (track.isEnabled) {
        return track
      }
    }
    return null
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

  private fun receiveEvent(@VideoEvents type: String, event: WritableMap?) {
    if (BuildConfig.LOG_PLAYER_EVENTS) {
      try {
        Log.d(TAG, "receiveEvent $type $event")
      } catch (_: RuntimeException) {
      }
    }
    UIManagerHelper.getUIManager(
      reactContext,
      if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
        UIManagerType.FABRIC
      } else {
        @Suppress("DEPRECATION")
        UIManagerType.DEFAULT
      })?.receiveEvent(UIManagerHelper.getSurfaceId(playerView), viewId, type, event)
  }

  private fun attachListeners(player: Player) {
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

    // Attach ad event adapter
    adEventAdapter = AdEventAdapter(playerView.adsApi,
      object : AdEventEmitter {
        override fun emit(payload: WritableMap?) {
          receiveEvent(EVENT_AD_EVENT, payload)
        }
      })

    if (BuildConfig.EXTENSION_CAST) {
      castEventAdapter = playerView.castApi?.let {
        CastEventAdapter(it, object : CastEventAdapter.Emitter {
          override fun emit(payload: WritableMap?) {
            receiveEvent(EVENT_CAST_EVENT, payload)
          }
        })
      }
    }

    theoLiveEventAdapter = THEOliveEventAdapter(player.theoLive, object : THEOliveEventAdapter.Emitter {
      override fun emit(payload: WritableMap?) {
        receiveEvent(EVENT_THEOLIVE_EVENT, payload)
      }
    })

    if (BuildConfig.EXTENSION_THEOADS) {
      theoAdsEventAdapter =
        THEOadsEventAdapter(player.theoAds, object : THEOadsEventAdapter.Emitter {
          override fun emit(payload: WritableMap?) {
            receiveEvent(EVENT_THEOADS_EVENT, payload)
          }
        })
    }

    // Attach view size listener
    playerView.addOnLayoutChangeListener(dimensionChangeListener)
  }

  fun removeListeners(player: Player?) {
    // Remove player listeners
    for ((key, value) in playerListeners) {
      player?.removeEventListener(
        key as EventType<PlayerEvent<*>>,
        value as EventListener<PlayerEvent<*>>
      )
    }

    // Remove text track listeners
    for ((key, value) in textTrackListeners) {
      player?.textTracks?.removeEventListener(
        key as EventType<TrackListEvent<*, *>>,
        value as EventListener<TrackListEvent<*, *>>
      )
    }

    // Remove audio track listeners
    for ((key, value) in audioTrackListeners) {
      player?.audioTracks?.removeEventListener(
        key as EventType<TrackListEvent<*, *>>,
        value as EventListener<TrackListEvent<*, *>>
      )
    }

    // Remove video track listeners
    for ((key, value) in videoTrackListeners) {
      player?.videoTracks?.removeEventListener(
        key as EventType<TrackListEvent<*, *>>,
        value as EventListener<TrackListEvent<*, *>>
      )
    }

    // Remove view size listener
    playerView.removeOnLayoutChangeListener(dimensionChangeListener)

    castEventAdapter?.destroy()
    adEventAdapter?.destroy()
    theoLiveEventAdapter?.destroy()
    theoAdsEventAdapter?.destroy()
  }
}
