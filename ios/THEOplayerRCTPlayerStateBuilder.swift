import Foundation
import THEOplayerSDK

let STATE_SOURCE = "source"
let STATE_CURRENT_TIME = "currentTime"
let STATE_CURRENT_PROGRAM_DATE_TIME = "currentProgramDateTime"
let STATE_PAUSED = "paused"
let STATE_PLAYBACK_RATE = "playbackRate"
let STATE_DURATION = "duration"
let STATE_VOLUME = "volume"
let STATE_MUTED = "muted"
let STATE_SEEKABLE = "seekable"
let STATE_BUFFERED = "buffered"
let STATE_START = "start"
let STATE_END = "end"

class THEOplayerRCTPlayerStateBuilder {
    private var playerState: [String: Any] = [:]
    
    func build() -> [String: Any] {
        return playerState
    }
    
    func source(_ sourceDescription: SourceDescription?) -> Self {
        if let sourceDesc = sourceDescription {
            playerState[STATE_SOURCE] = THEOplayerRCTSourceDescriptionAggregator.aggregateSourceDescription(sourceDescription: sourceDesc)
        }
        return self
    }
    
    func currentTime(_ timeInSec: Double) -> Self {
        playerState[STATE_CURRENT_TIME] = timeInSec * 1000 // sec -> msec
        return self
    }
    
    func currentProgramDateTime(_ programDataTime: Date?) -> Self {
        if let date = programDataTime {
            playerState[STATE_CURRENT_PROGRAM_DATE_TIME] = date.timeIntervalSince1970 * 1000 // sec -> msec
        }
        return self
    }
    
    func paused(_ paused: Bool) -> Self {
        playerState[STATE_PAUSED] = paused
        return self
    }
    
    func playbackRate(_ rate: Double) -> Self {
        playerState[STATE_PLAYBACK_RATE] = rate
        return self
    }
    
    func duration(_ durationInSec: Double?) -> Self {
        if let durationInSec = durationInSec {
            playerState[PROP_DURATION] = THEOplayerRCTTypeUtils.encodeInfNan(durationInSec * 1000) // sec -> msec
        }
        return self
    }
    
    func volume(_ volume: Float) -> Self {
        playerState[STATE_VOLUME] = Double(volume)
        return self
    }
    
    func muted(_ muted: Bool) -> Self {
        playerState[STATE_MUTED] = muted
        return self
    }
    
    func seekable(_ seekableRanges: [THEOplayerSDK.TimeRange]?) -> Self {
        playerState[STATE_SEEKABLE] = fromTimeRanges(seekableRanges)
        return self
    }
    
    func buffered(_ bufferedRanges: [THEOplayerSDK.TimeRange]?) -> Self {
        playerState[STATE_BUFFERED] = fromTimeRanges(bufferedRanges)
        return self
    }
    
    func trackInfo(_ trackInfo: [String: Any]) -> Self {
        playerState.merge(trackInfo) { (current, _) in current }
        return self
    }
    
    private func fromTimeRanges(_ ranges: [THEOplayerSDK.TimeRange]?) -> [[String: Double]] {
        guard let inRanges = ranges else { return [] }
        
        var outRanges: [[String:Double]] = []
        inRanges.forEach({ timeRange in
            outRanges.append(
                [
                    STATE_START: timeRange.start * 1000,            // sec -> msec
                    STATE_END: timeRange.end * 1000                 // sec -> msec
                ]
            )
        })
        return outRanges
    }
}

