// THEOplayerRCTMainEventHandler.swift

import Foundation
import THEOplayerSDK

public class THEOplayerRCTMainEventHandler {
    // MARK: Members
    private weak var player: THEOplayer?
    private weak var presentationModeContext: THEOplayerRCTPresentationModeContext?
    private(set) var loadedMetadataAndChapterTracksInfo: [[String:Any]] = []
        
    // MARK: Events
    var onNativePlay: RCTDirectEventBlock?
    var onNativePause: RCTDirectEventBlock?
    var onNativeSourceChange: RCTDirectEventBlock?
    var onNativeLoadStart: RCTDirectEventBlock?
    var onNativeReadyStateChange: RCTDirectEventBlock?
    var onNativeDurationChange: RCTDirectEventBlock?
    var onNativeVolumeChange: RCTDirectEventBlock?
    var onNativeProgress: RCTBubblingEventBlock?
    var onNativeTimeUpdate: RCTBubblingEventBlock?
    var onNativePlaying: RCTDirectEventBlock?
    var onNativeSeeking: RCTDirectEventBlock?
    var onNativeSeeked: RCTDirectEventBlock?
    var onNativeEnded: RCTDirectEventBlock?
    public internal(set) var onNativeError: RCTDirectEventBlock?
    var onNativeLoadedData: RCTDirectEventBlock?
    var onNativeLoadedMetadata: RCTDirectEventBlock?
    var onNativeRateChange: RCTDirectEventBlock?
    var onNativeWaiting: RCTDirectEventBlock?
    var onNativeCanPlay: RCTDirectEventBlock?
    var onNativeDimensionChange: RCTDirectEventBlock?
    var onNativeVideoResize: RCTDirectEventBlock?
    
    // MARK: player Listeners
    private var playListener: EventListener?
    private var pauseListener: EventListener?
    private var sourceChangeListener: EventListener?
    private var loadStartListener: EventListener?
    private var readyStateChangeListener: EventListener?
    private var durationChangeListener: EventListener?
    private var volumeChangeListener: EventListener?
    private var progressListener: EventListener?
    private var timeUpdateListener: EventListener?
    private var playingListener: EventListener?
    private var seekingListener: EventListener?
    private var seekedListener: EventListener?
    private var endedListener: EventListener?
    private var errorListener: EventListener?
    private var loadedDataListener: EventListener?
    private var loadedMetadataListener: EventListener?
    private var rateChangeListener: EventListener?
    private var waitingListener: EventListener?
    private var canPlayListener: EventListener?
    private var videoResizeListener: EventListener?
    
    // MARK: player observer
    private var dimensionChangeObserver: NSKeyValueObservation?
    
    // MARK: - destruction
    func destroy() {
        // dettach listeners
        self.dettachListeners()
    }
    
    // MARK: - player setup / breakdown
    func setPlayer(_ player: THEOplayer) {
        self.player = player
        
        // attach listeners
        self.attachListeners()
    }
    
    func setLoadedMetadataAndChapterTracksInfo(_ tracksInfo: [[String:Any]]) {
        self.loadedMetadataAndChapterTracksInfo = tracksInfo
    }
    
    // MARK: - attach/dettach main player Listeners
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
        // PLAY
        self.playListener = player.addEventListener(type: PlayerEventTypes.PLAY) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received PLAY event from THEOplayer") }
            if let forwardedPlayEvent = self?.onNativePlay {
                forwardedPlayEvent([:])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Play listener attached to THEOplayer") }
        
        // PAUSE
        self.pauseListener = player.addEventListener(type: PlayerEventTypes.PAUSE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received PAUSE event from THEOplayer") }
            if let forwardedPauseEvent = self?.onNativePause {
                forwardedPauseEvent([:])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Pause listener attached to THEOplayer") }
        
        // SOURCE_CHANGE
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received SOURCE_CHANGE event from THEOplayer") }
            if let forwardedSourceChangeEvent = self?.onNativeSourceChange {
                forwardedSourceChangeEvent([:])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] SourceChange listener attached to THEOplayer") }
        
        // LOAD_START
        self.loadStartListener = player.addEventListener(type: PlayerEventTypes.LOAD_START) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received LOAD_START event from THEOplayer") }
            if let forwardedLoadStartEvent = self?.onNativeLoadStart {
                forwardedLoadStartEvent([:])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] LoadStart listener attached to THEOplayer") }
        
        // READY_STATE_CHANGE
        self.readyStateChangeListener = player.addEventListener(type: PlayerEventTypes.READY_STATE_CHANGE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received READY_STATE_CHANGE event from THEOplayer") }
            if let forwardedReadyStateChangeEvent = self?.onNativeReadyStateChange {
                forwardedReadyStateChangeEvent(["readyState": event.readyState.rawValue - 1]) // [1-5] (iOS only) => [0-4] (other platforms + RN)
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ReadyStateChange listener attached to THEOplayer") }
        
        // DURATION_CHANGE
        self.durationChangeListener = player.addEventListener(type: PlayerEventTypes.DURATION_CHANGE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received DURATION_CHANGE event from THEOplayer") }
            if let forwardedDurationChangeEvent = self?.onNativeDurationChange {
                forwardedDurationChangeEvent(
                    [
                        "duration": THEOplayerRCTTypeUtils.encodeInfNan((event.duration ?? Double.nan) * 1000)             // sec -> msec
                    ]
                )
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] DurationChange listener attached to THEOplayer") }
        
        // VOLUME_CHANGE
        self.volumeChangeListener = player.addEventListener(type: PlayerEventTypes.VOLUME_CHANGE) { [weak self, weak player] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received VOLUME_CHANGE event from THEOplayer") }
            if let wplayer = player,
               let forwardedVolumeChangeEvent = self?.onNativeVolumeChange {
                forwardedVolumeChangeEvent(
                    [
                        "volume": event.volume,
                        "muted": wplayer.muted
                    ]
                )
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] VolumeChange listener attached to THEOplayer") }
        
        // PROGRESS
        self.progressListener = player.addEventListener(type: PlayerEventTypes.PROGRESS) { [weak self, weak player] event in
            //if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received PROGRESS event from THEOplayer") }
            if let wplayer = player,
               let forwardedProgressEvent = self?.onNativeProgress {
                let seekableTimeRanges = wplayer.seekable
                let bufferedTimeRanges = wplayer.buffered
                var seekable: [[String:Double]] = []
                seekableTimeRanges.forEach({ timeRange in
                    seekable.append(
                        [
                            "start": timeRange.start * 1000,            // sec -> msec
                            "end": timeRange.end * 1000                 // sec -> msec
                        ]
                    )
                })
                var buffered: [[String:Double]] = []
                bufferedTimeRanges.forEach({ timeRange in
                    buffered.append(
                        [
                            "start": timeRange.start * 1000,            // sec -> msec
                            "end": timeRange.end * 1000                 // sec -> msec
                        ]
                    )
                })
                forwardedProgressEvent(
                    [
                        "seekable":seekable,
                        "buffered":buffered
                    ]
                )
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Progress listener attached to THEOplayer") }
        
        // TIME_UPDATE
        self.timeUpdateListener = player.addEventListener(type: PlayerEventTypes.TIME_UPDATE) { [weak self] event in
            //if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received TIME_UPDATE event from THEOplayer") }
            if let forwardedTimeUpdateEvent = self?.onNativeTimeUpdate {
                let currentTime = event.currentTime * 1000                                                          // sec -> msec
                let currentProgramDateTime = (event.currentProgramDateTime?.timeIntervalSince1970 ?? 0.0) * 1000    // sec -> msec
                forwardedTimeUpdateEvent(
                    [
                        "currentTime": currentTime,
                        "currentProgramDateTime": currentProgramDateTime
                    ]
                )
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] TimeUpdate listener attached to THEOplayer") }
        
        // PLAYING
        self.playingListener = player.addEventListener(type: PlayerEventTypes.PLAYING) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received PLAYING event from THEOplayer") }
            if let forwardedPlayingEvent = self?.onNativePlaying {
                forwardedPlayingEvent([:])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Playing listener attached to THEOplayer") }
        
        // SEEKING
        self.seekingListener = player.addEventListener(type: PlayerEventTypes.SEEKING) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received SEEKING event from THEOplayer") }
            if let forwardedSeekingEvent = self?.onNativeSeeking {
                forwardedSeekingEvent(["currentTime": 1e3 * event.currentTime])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Seeking listener attached to THEOplayer") }
        
        // SEEKED
        self.seekedListener = player.addEventListener(type: PlayerEventTypes.SEEKED) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received SEEKED event from THEOplayer") }
            if let forwardedSeekedEvent = self?.onNativeSeeked {
                forwardedSeekedEvent(["currentTime": 1e3 * event.currentTime])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Seeked listener attached to THEOplayer") }
        
        // ENDED
        self.endedListener = player.addEventListener(type: PlayerEventTypes.ENDED) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received ENDED event from THEOplayer") }
            if let forwardedEndedEvent = self?.onNativeEnded {
                forwardedEndedEvent([:])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Ended listener attached to THEOplayer") }
        
        // ERROR
        self.errorListener = player.addEventListener(type: PlayerEventTypes.ERROR) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received ERROR event from THEOplayer") }
            if let forwardedErrorEvent = self?.onNativeError,
               let errorObject = event.errorObject
            {
                let errorCodeString = String(errorObject.code.rawValue)
                let errorCodeMessage = errorObject.message
                forwardedErrorEvent(
                    [
                        "error": [
                            "errorCode":errorCodeString,
                            "errorMessage":errorCodeMessage
                        ]
                    ]
                )
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Error listener attached to THEOplayer") }
        
        // LOADED_DATA
        self.loadedDataListener = player.addEventListener(type: PlayerEventTypes.LOADED_DATA) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received LOADED_DATA event from THEOplayer") }
            if let forwardedLoadedDataEvent = self?.onNativeLoadedData {
                forwardedLoadedDataEvent([:])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] LoadedData listener attached to THEOplayer") }
        
        // LOADED_META_DATA
        self.loadedMetadataListener = player.addEventListener(type: PlayerEventTypes.LOADED_META_DATA) { [weak self, weak player] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received LOADED_META_DATA event from THEOplayer") }
            if let wplayer = player,
               let self,
               let forwardedLoadedMetadataEvent = self.onNativeLoadedMetadata {
              let metadata = THEOplayerRCTTrackMetadataAggregator.aggregateTrackInfo(player: wplayer, metadataTracksInfo: self.loadedMetadataAndChapterTracksInfo)
                forwardedLoadedMetadataEvent(metadata)
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] LoadedMetadata listener attached to THEOplayer") }
        
        // RATE_CHANGE
        self.rateChangeListener = player.addEventListener(type: PlayerEventTypes.RATE_CHANGE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received RATE_CHANGE event from THEOplayer") }
            if let forwardedRateChangeEvent = self?.onNativeRateChange {
                forwardedRateChangeEvent(["playbackRate": event.playbackRate])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] RateChange listener attached to THEOplayer") }
        
        // WAITING
        self.waitingListener = player.addEventListener(type: PlayerEventTypes.WAITING) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received WAITING event from THEOplayer") }
            if let forwardedWaitingEvent = self?.onNativeWaiting {
                forwardedWaitingEvent([:])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Waiting listener attached to THEOplayer") }
        
        // CAN_PLAY
        self.canPlayListener = player.addEventListener(type: PlayerEventTypes.CAN_PLAY) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received CAN_PLAY event from THEOplayer") }
            if let forwardedCanPlayEvent = self?.onNativeCanPlay {
                forwardedCanPlayEvent([:])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] CanPlay listener attached to THEOplayer") }
        
        // RESIZE
        self.videoResizeListener = player.addEventListener(type: PlayerEventTypes.RESIZE) { [weak self, weak player] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received RESIZE event from THEOplayer") }
            if let wplayer = player,
               let forwardedVideoResizeEvent = self?.onNativeVideoResize {
                forwardedVideoResizeEvent(
                    [
                        "videoWidth": wplayer.videoWidth,
                        "videoHeight": wplayer.videoHeight,
                    ]
                )
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Resize listener attached to THEOplayer") }
        
        // DIMENSION CHANGE: implemented using videoRect Observation
        self.dimensionChangeObserver = player.observe(\.videoRect, options: [.new]) { [weak self, weak player] view, change in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Observed videoRect change on THEOplayer") }
            if let wplayer = player,
               let forwardedDimensionChangeEvent = self?.onNativeDimensionChange {
                forwardedDimensionChangeEvent(
                    [
                        "width": wplayer.frame.width,
                        "height": wplayer.frame.height,
                    ]
                )
            }
        }
    }
    
    private func dettachListeners() {
        guard let player = self.player else {
            return
        }
        
        // PLAY
        if let playListener = self.playListener {
            player.removeEventListener(type: PlayerEventTypes.PLAY, listener: playListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Play listener dettached from THEOplayer") }
        }
        
        // PAUSE
        if let pauseListener = self.pauseListener {
            player.removeEventListener(type: PlayerEventTypes.PAUSE, listener: pauseListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Pause listener dettached from THEOplayer") }
        }
        
        // SOURCE_CHANGE
        if let sourceChangeListener = self.sourceChangeListener {
            player.removeEventListener(type: PlayerEventTypes.SOURCE_CHANGE, listener: sourceChangeListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] SourceChange listener dettached from THEOplayer") }
        }
        
        // LOAD_START
        if let loadStartListener = self.loadStartListener {
            player.removeEventListener(type: PlayerEventTypes.LOAD_START, listener: loadStartListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] LoadStart listener dettached from THEOplayer") }
        }
        
        // READY_STATE_CHANGE
        if let readyStateChangeListener = self.readyStateChangeListener {
            player.removeEventListener(type: PlayerEventTypes.READY_STATE_CHANGE, listener: readyStateChangeListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ReadyStateChange listener dettached from THEOplayer") }
        }
        
        // DURATION_CHANGE
        if let durationChangeListener = self.durationChangeListener {
            player.removeEventListener(type: PlayerEventTypes.DURATION_CHANGE, listener: durationChangeListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] DurationChange listener dettached from THEOplayer") }
        }
        
        // PROGRESS
        if let progressListener = self.progressListener {
            player.removeEventListener(type: PlayerEventTypes.PROGRESS, listener: progressListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Progress listener dettached from THEOplayer") }
        }
        
        // TIME_UPDATE
        if let timeUpdateListener = self.timeUpdateListener {
            player.removeEventListener(type: PlayerEventTypes.TIME_UPDATE, listener: timeUpdateListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] TimeUpdate listener dettached from THEOplayer") }
        }
        
        // PLAYING
        if let playingListener = self.playingListener {
            player.removeEventListener(type: PlayerEventTypes.PLAYING, listener: playingListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Playing listener dettached from THEOplayer") }
        }
        
        // SEEKING
        if let seekingListener = self.seekingListener {
            player.removeEventListener(type: PlayerEventTypes.SEEKING, listener: seekingListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Seeking listener dettached from THEOplayer") }
        }
        
        // SEEKED
        if let seekedListener = self.seekedListener {
            player.removeEventListener(type: PlayerEventTypes.SEEKED, listener: seekedListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Seeked listener dettached from THEOplayer") }
        }
        
        // ENDED
        if let endedListener = self.endedListener {
            player.removeEventListener(type: PlayerEventTypes.ENDED, listener: endedListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Ended listener dettached from THEOplayer") }
        }
        
        // ERROR
        if let errorListener = self.errorListener {
            player.removeEventListener(type: PlayerEventTypes.ERROR, listener: errorListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Error listener dettached from THEOplayer") }
        }
        
        // LOADED_DATA
        if let loadedDataListener = self.loadedDataListener {
            player.removeEventListener(type: PlayerEventTypes.LOADED_DATA, listener: loadedDataListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] LoadedData listener dettached from THEOplayer") }
        }
        
        // LOADED_META_DATA
        if let loadedMetadataListener = self.loadedMetadataListener {
            player.removeEventListener(type: PlayerEventTypes.LOADED_META_DATA, listener: loadedMetadataListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] LoadedMetadata listener dettached from THEOplayer") }
        }
        
        // RATE_CHANGE
        if let rateChangeListener = self.rateChangeListener {
            player.removeEventListener(type: PlayerEventTypes.RATE_CHANGE, listener: rateChangeListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] RateChange listener dettached from THEOplayer") }
        }
        
        // WAITING
        if let waitingListener = self.waitingListener {
            player.removeEventListener(type: PlayerEventTypes.WAITING, listener: waitingListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Waiting listener dettached from THEOplayer") }
        }
        
        // CAN_PLAY
        if let canPlayListener = self.canPlayListener {
            player.removeEventListener(type: PlayerEventTypes.CAN_PLAY, listener: canPlayListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] CanPlay listener dettached from THEOplayer") }
        }
        
        // DIMENSION CHANGE
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Invalidate dimensionChangeObserver from THEOplayer") }
        self.dimensionChangeObserver?.invalidate()
        self.dimensionChangeObserver = nil
      
        // RESIZE
        if let videoResizeListener = self.videoResizeListener {
          player.removeEventListener(type: PlayerEventTypes.RESIZE, listener: videoResizeListener)
          if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] Resize listener dettached from THEOplayer") }
        }
    }
}
