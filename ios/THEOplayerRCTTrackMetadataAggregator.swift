// THEOplayerRCTMetadataAggregator.swift

import Foundation
import THEOplayerSDK

let EVENT_PROP_TEXT_TRACKS: String = "textTracks"
let EVENT_PROP_AUDIO_TRACKS: String = "audioTracks"
let EVENT_PROP_VIDEO_TRACKS: String = "videoTracks"
let EVENT_PROP_SELECTED_TEXT_TRACK: String = "selectedTextTrack"
let EVENT_PROP_SELECTED_AUDIO_TRACK: String = "selectedAudioTrack"
let EVENT_PROP_SELECTED_VIDEO_TRACK: String = "selectedVideoTrack"
let EVENT_PROP_DURATION: String = "duration"
let PROP_ID: String = "id"
let PROP_UID: String = "uid"
let PROP_KIND: String = "kind"
let PROP_LANGUAGE: String = "language"
let PROP_MODE: String = "mode"
let PROP_LABEL: String = "label"
let PROP_TYPE: String = "type"
let PROP_QUALITIES: String = "qualities"
let PROP_ACTIVE_QUALITY: String = "activeQuality"
let PROP_TARGET_QUALITY: String = "targetQuality"
let PROP_STARTTIME: String = "startTime"
let PROP_ENDTIME: String = "endTime"
let PROP_CUES: String = "cues"
let PROP_CUE_CONTENT: String = "content"
let PROP_CUE_CUSTOM_ATTRIBUTES: String = "customAttributes"
let PROP_SRC: String = "src"
let PROP_START_DATE: String = "startDate"
let PROP_END_DATE: String = "endDate"
let PROP_ATTRIBUTE_CLASS: String = "class"
let PROP_DURATION: String = "duration"
let PROP_PLANNED_DURATION: String = "plannedDuration"
let PROP_END_ON_NEXT: String = "endOnNext"

class THEOplayerRCTTrackMetadataAggregator {

    class func aggregateTrackMetadata(player: THEOplayer, metadataTracksInfo: [[String:Any]]) -> [String:Any] {
        let textTracks: TextTrackList = player.textTracks
        let audioTracks: AudioTrackList = player.audioTracks
        let videoTracks: VideoTrackList = player.videoTracks
        return [
            EVENT_PROP_TEXT_TRACKS : THEOplayerRCTTrackMetadataAggregator.aggregatedTextTrackListInfo(textTracks: textTracks, metadataTracks: metadataTracksInfo, player: player),
            EVENT_PROP_AUDIO_TRACKS : THEOplayerRCTTrackMetadataAggregator.aggregatedAudioTrackListInfo(audioTracks: audioTracks),
            EVENT_PROP_VIDEO_TRACKS : THEOplayerRCTTrackMetadataAggregator.aggregatedVideoTrackListInfo(videoTracks: videoTracks),
            EVENT_PROP_SELECTED_TEXT_TRACK: THEOplayerRCTTrackMetadataAggregator.selectedTextTrack(textTracks: textTracks),
            EVENT_PROP_SELECTED_AUDIO_TRACK: THEOplayerRCTTrackMetadataAggregator.selectedAudioTrack(audioTracks: audioTracks),
            EVENT_PROP_SELECTED_VIDEO_TRACK: THEOplayerRCTTrackMetadataAggregator.selectedVideoTrack(videoTracks: videoTracks),
            EVENT_PROP_DURATION: THEOplayerRCTTypeUtils.encodeInfNan((player.duration ?? Double.nan) * 1000)
        ]
    }

    // MARK: TEXTTRACKS
    class func aggregatedTextTrackListInfo(textTracks: TextTrackList, metadataTracks: [[String:Any]], player: THEOplayer) -> [[String:Any]] {
        var trackEntries:[[String:Any]] = metadataTracks
        guard textTracks.count > 0 else {
            return trackEntries
        }
        for i in 0...textTracks.count-1 {
            let textTrack: TextTrack = textTracks.get(i)
            trackEntries.append(THEOplayerRCTTrackMetadataAggregator.aggregatedTextTrackInfo(textTrack: textTrack, player: player))
        }
        return trackEntries
    }
    
    class func aggregatedTextTrackInfo(textTrack: TextTrack, player: THEOplayer) -> [String:Any] {
        var entry: [String:Any] = [:]
        entry[PROP_ID] = textTrack.id
        entry[PROP_UID] = textTrack.uid
        entry[PROP_KIND] = textTrack.kind
        entry[PROP_LANGUAGE] = textTrack.language
        entry[PROP_MODE] = textTrack.mode._rawValue
        entry[PROP_LABEL] = textTrack.label
        entry[PROP_TYPE] = textTrack.type
        entry[PROP_SRC] = textTrack.src
        // process cues when texttrack contains them
        if !textTrack.cues.isEmpty {
            var cueList: [[String:Any]] = []
            for cue in textTrack.cues {
                cueList.append(THEOplayerRCTTrackMetadataAggregator.aggregatedTextTrackCueInfo(textTrackCue: cue, player: player))
            }
            entry[PROP_CUES] = cueList
        }
        return entry
    }
    
    private class func selectedTextTrack(textTracks: TextTrackList) -> Int {
        guard textTracks.count > 0 else {
            return 0
        }
        for i in 0...textTracks.count-1 {
            let textTrack: TextTrack = textTracks.get(i)
            if textTrack.mode == TextTrackMode.showing {
                return textTrack.uid
            }
        }
        return 0
    }
    
    // MARK: TEXTTRACK CUES
    class func aggregatedTextTrackCueInfo(textTrackCue: TextTrackCue, player: THEOplayer) -> [String:Any] {
        var entry: [String:Any] = [:]
        entry[PROP_ID] = textTrackCue.id
        entry[PROP_UID] = textTrackCue.uid
        var startTime = textTrackCue.startTime
        var endTime = textTrackCue.endTime
        if let dateRangeCue = textTrackCue as? DateRangeCue,
           let programDateTime = player.currentProgramDateTime?.timeIntervalSince1970 {
            let currentTime = player.currentTime
            let offset = programDateTime - currentTime
            startTime = dateRangeCue.startDate.timeIntervalSince1970 - offset
            endTime = dateRangeCue.endDate != nil ? dateRangeCue.endDate!.timeIntervalSince1970 - offset : .infinity
        }
        entry[PROP_STARTTIME] = THEOplayerRCTTypeUtils.encodeInfNan((startTime ?? 0) * 1000)
        entry[PROP_ENDTIME] = THEOplayerRCTTypeUtils.encodeInfNan((endTime ?? 0) * 1000)
        if let content = textTrackCue.content {
            entry[PROP_CUE_CONTENT] = content
        } else if let contentString = textTrackCue.contentString {
            entry[PROP_CUE_CONTENT] = contentString
        }
        if let dateRangeCue = textTrackCue as? DateRangeCue {
            entry[PROP_START_DATE] = dateRangeCue.startDate.timeIntervalSince1970 * 1000
            if let endDate = dateRangeCue.endDate {
                entry[PROP_END_DATE] = endDate.timeIntervalSince1970 * 1000
            }
            if let attributeClass = dateRangeCue.attributeClass {
                entry[PROP_ATTRIBUTE_CLASS] = attributeClass
            }
            if let duration = dateRangeCue.duration {
                entry[PROP_DURATION] = THEOplayerRCTTypeUtils.encodeInfNan(duration * 1000)
            }
            if let plannedDuration = dateRangeCue.plannedDuration {
                entry[PROP_PLANNED_DURATION] = THEOplayerRCTTypeUtils.encodeInfNan(plannedDuration * 1000)
            }
            entry[PROP_END_ON_NEXT] = dateRangeCue.endOnNext
            let customAttributes = dateRangeCue.customAttributes
            let customAttributesDict = customAttributes.getAttributesAsDictionary()
            if !customAttributesDict.isEmpty {
                var attributesEntry: [String:Any] = [:]
                for (key, _) in customAttributesDict {
                    do {
                        // try reading as string
                        attributesEntry[key] = try customAttributes.getString(for: key)
                    } catch {
                        do {
                            // try reading as double
                            attributesEntry[key] = try customAttributes.getDouble(for: key)
                        } catch {
                            do {
                                // try reading as data
                                attributesEntry[key] = try customAttributes.getBytes(for: key)
                            } catch {
                                print("Unable to extract customAttribute from DateRange cue. Content is limited to String, Double or Data.")
                            }
                        }
                    }
                }
                entry[PROP_CUE_CUSTOM_ATTRIBUTES] = attributesEntry
            }
        }
        return entry
    }

    // MARK: AUDIOTRACKS
    private class func aggregatedAudioTrackListInfo(audioTracks: AudioTrackList) -> [[String:Any]] {
        var audioTrackEntries:[[String:Any]] = []
        guard audioTracks.count > 0 else {
            return audioTrackEntries
        }
        for i in 0...audioTracks.count-1 {
            let audioTrack: MediaTrack = audioTracks.get(i) // should be casted to AudioTrack
            audioTrackEntries.append(THEOplayerRCTTrackMetadataAggregator.aggregatedAudioTrackInfo(audioTrack: audioTrack))
        }
        return audioTrackEntries
    }
    
    class func aggregatedAudioTrackInfo(audioTrack: MediaTrack) -> [String:Any] {
        var entry: [String:Any] = [:]
        entry[PROP_ID] = audioTrack.id
        entry[PROP_UID] = audioTrack.uid
        entry[PROP_KIND] = audioTrack.kind
        entry[PROP_LANGUAGE] = audioTrack.language
        entry[PROP_LABEL] = audioTrack.label
        entry[PROP_QUALITIES] = []          // empty: qualities are not being exposed on iOS
        //entry[PROP_ACTIVE_QUALITY] =      // undefined: qualities are not being exposed on iOS
        //entry[PROP_TARGET_QUALITY] =      // undefined: qualities are not being exposed on iOS
        return entry
    }
    
    private class func selectedAudioTrack(audioTracks: AudioTrackList) -> Int {
        guard audioTracks.count > 0 else {
            return 0
        }
        for i in 0...audioTracks.count-1 {
            let audioTrack: MediaTrack = audioTracks.get(i)
            if audioTrack.enabled {
                return audioTrack.uid
            }
        }
        return 0
    }

    // MARK: VIDEOTRACKS
    private class func aggregatedVideoTrackListInfo(videoTracks: VideoTrackList) -> [[String:Any]] {
        var videoTrackEntries:[[String:Any]] = []
        guard videoTracks.count > 0 else {
            return videoTrackEntries
        }
        for i in 0...videoTracks.count-1 {
            if let videoTrack: VideoTrack = videoTracks.get(i) as? VideoTrack {
                videoTrackEntries.append(THEOplayerRCTTrackMetadataAggregator.aggregatedVideoTrackInfo(videoTrack: videoTrack))
            }
        }
        return videoTrackEntries
    }
    
    class func aggregatedVideoTrackInfo(videoTrack: VideoTrack) -> [String:Any] {
        var entry: [String:Any] = [:]
        entry[PROP_ID] = videoTrack.id
        entry[PROP_UID] = videoTrack.uid
        entry[PROP_KIND] = videoTrack.kind
        entry[PROP_LANGUAGE] = videoTrack.language
        entry[PROP_LABEL] = videoTrack.label
        entry[PROP_QUALITIES] = []          // empty: qualities are not being exposed on iOS
        //entry[PROP_ACTIVE_QUALITY] =      // undefined: qualities are not being exposed on iOS
        //entry[PROP_TARGET_QUALITY] =      // undefined: qualities are not being exposed on iOS
        return entry
    }

    private class func selectedVideoTrack(videoTracks: VideoTrackList) -> Int {
        guard videoTracks.count > 0 else {
            return 0
        }
        for i in 0...videoTracks.count-1 {
            let videoTrack: MediaTrack = videoTracks.get(i)
            if videoTracks.get(i).enabled {
                return videoTrack.uid
            }
        }
        return 0
    }
    
    class func aggregatedMetadataTrackInfo(metadataTrackDescriptions: [TextTrackDescription], completed: (([[String:Any]]) -> Void)? ) {
        var trackIndex = 0
        var tracksInfo: [[String:Any]] = []
        for trackDescription in metadataTrackDescriptions {
            guard trackDescription.kind == .metadata, trackDescription.format == .WebVTT else { continue }
            
            let urlString = trackDescription.src.absoluteString
            THEOplayerRCTSideloadedMetadataProcessor.parseVtt(urlString) { cueArray in
                if let cues = cueArray {
                    var track: [String:Any] = [:]
                    let trackUid = 1000 + trackIndex
                    track[PROP_ID] = UUID().uuidString
                    track[PROP_UID] = trackUid
                    track[PROP_KIND] = trackDescription.kind?._rawValue
                    track[PROP_LANGUAGE] = trackDescription.srclang
                    track[PROP_MODE] = "hidden"
                    track[PROP_LABEL] = trackDescription.label ?? "no label"
                    track[PROP_TYPE] = "webvtt"
                    track[PROP_SRC] = trackDescription.src.absoluteString
                    var cueList: [[String:Any]] = []
                    var cueIndex = 0
                    for c in cues {
                        //print("[CUE] \(c.startTime) --> \(c.endTime): \(c.cueContent)")
                        var cue: [String:Any] = [:]
                        cue[PROP_ID] = cueIndex
                        cue[PROP_UID] = (trackUid * 1000000) + cueIndex
                        cue[PROP_STARTTIME] = c.startTime
                        cue[PROP_ENDTIME] = c.endTime
                        cue[PROP_CUE_CONTENT] = c.cueContent
                        cueList.append(cue)
                        cueIndex += 1
                    }
                    track[PROP_CUES] = cueList
                    tracksInfo.append(track)
                    if tracksInfo.count == metadataTrackDescriptions.count {
                        completed?(tracksInfo)
                    }
                }
            }
            trackIndex += 1
        }
    }
}
