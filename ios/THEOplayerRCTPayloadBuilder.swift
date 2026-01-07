import Foundation
import THEOplayerSDK

private let PROP_SOURCE = "source"
private let PROP_CURRENT_TIME = "currentTime"
private let PROP_CURRENT_PROGRAM_DATE_TIME = "currentProgramDateTime"
private let PROP_PAUSED = "paused"
private let PROP_PLAYBACK_RATE = "playbackRate"
private let PROP_VOLUME = "volume"
private let PROP_MUTED = "muted"
private let PROP_SEEKABLE = "seekable"
private let PROP_BUFFERED = "buffered"
private let PROP_START = "start"
private let PROP_END = "end"

/**
 * This class is used to shape the `state` object for the event `onPlayerReady`
 */
class THEOplayerRCTPayloadBuilder {
    private var payload: [String: Any] = [:]
    
    func source(_ source: Any?) -> Self {
        if source != nil {
            let sourcePayload = NSMutableDictionary()
            // Fill in with source fields?
            payload[PROP_SOURCE] = sourcePayload
        }
        return self
    }
    
    func currentTime(_ timeInSec: Double) -> Self {
        payload[PROP_CURRENT_TIME] = timeInSec * 1e3
        return self
    }
    
    func currentProgramDateTime(_ date: Date?) -> Self {
        if let date = date {
            payload[PROP_CURRENT_PROGRAM_DATE_TIME] = date.timeIntervalSince1970 * 1e3
        }
        return self
    }
    
    func paused(_ value: Bool) -> Self {
        payload[PROP_PAUSED] = value
        return self
    }
    
    func playbackRate(_ rate: Double) -> Self {
        payload[PROP_PLAYBACK_RATE] = rate
        return self
    }
    
    func duration(_ durationInSec: Double?) -> Self {
        if let durationInSec = durationInSec {
            payload[PROP_DURATION] = (durationInSec * 1e3).coerceIfInfOrNan
        }
        return self
    }
    
    func volume(_ volume: Float, muted: Bool) -> Self {
        payload[PROP_VOLUME] = Double(volume)
        payload[PROP_MUTED] = muted
        return self
    }
    
    func seekable(_ timeRanges: [THEOplayerSDK.TimeRange]?) -> Self {
        payload[PROP_SEEKABLE] = fromTimeRanges(timeRanges)
        return self
    }
    
    func buffered(_ timeRanges: [THEOplayerSDK.TimeRange]?) -> Self {
        payload[PROP_BUFFERED] = fromTimeRanges(timeRanges)
        return self
    }
    
    func metadataTracksInfo(_ metadataTracksInfo: [String: Any]) -> Self {
        payload.merge(metadataTracksInfo) { (current, _) in current }
        return self
    }

    func build() -> [String: Any] {
        return payload
    }
    
    private func fromTimeRanges(_ ranges: [THEOplayerSDK.TimeRange]?) -> [[String: Double]] {
        guard let ranges = ranges else { return [] }
        return ranges.map {
            [
                PROP_START: $0.start * 1000,
                PROP_END: $0.end * 1000
            ]
        }
    }
}

private extension Double {
    // Make sure we do not send INF or NaN double values over the bridge. It might break debug sessions.
    var coerceIfInfOrNan: Double {
        // The following constants are taken from Android Theo SDK, see PayloadBuilder.kt.
        // Looks like some internal convention
        if self.isNaN {
            return -1.0
        }
        if self.isInfinite {
            return -2.0
        }
        return self
    }
}
