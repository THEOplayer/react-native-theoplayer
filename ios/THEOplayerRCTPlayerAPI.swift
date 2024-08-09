//
//  THEOplayerRCTPlayerAPI.swift
//

import Foundation
import UIKit
import THEOplayerSDK

#if canImport(THEOplayerConnectorSideloadedSubtitle)
import THEOplayerConnectorSideloadedSubtitle
#endif

let ERROR_MESSAGE_PLAYER_QUALITY_UNSUPPORTED_FEATURE: String = "Setting a target video quality is not supported on iOS/tvOS."

let TTS_PROP_BACKGROUND_COLOR = "backgroundColor"
let TTS_PROP_EDGE_STYLE = "edgeStyle"
let TTS_PROP_FONT_COLOR = "fontColor"
let TTS_PROP_FONT_FAMILY = "fontFamily"
let TTS_PROP_FONT_SIZE = "fontSize"
let TTS_PROP_MARGIN_LEFT = "marginLeft"
let TTS_PROP_MARGIN_TOP = "marginTop"
let TTS_PROP_COLOR_R = "r"
let TTS_PROP_COLOR_G = "g"
let TTS_PROP_COLOR_B = "b"
let TTS_PROP_COLOR_A = "a"

@objc(THEOplayerRCTPlayerAPI)
class THEOplayerRCTPlayerAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    static func moduleName() -> String! {
        return "THEORCTPlayerModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(setPaused:paused:)
    func setPaused(_ node: NSNumber, paused: Bool) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                if paused && !player.paused {
                    if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Triggering pause on TheoPlayer") }
                    player.pause()
                } else if !paused && player.paused {
                    if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Triggering play on TheoPlayer") }
                    player.play()
                }
            }
        }
    }

    @objc(setSource:src:)
    func setSource(_ node: NSNumber, src: NSDictionary) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView {
                let (sourceDescription, metadataTrackDescriptions) = THEOplayerRCTSourceDescriptionBuilder.buildSourceDescription(src)
                if let player = theView.player {
                    self.triggerViewHierarchyValidation(player)
                    self.setNewSourceDescription(player: player, srcDescription: sourceDescription)
                    theView.processMetadataTracks(metadataTrackDescriptions: metadataTrackDescriptions)
                }
            } else {
                if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Failed to update THEOplayer source.") }
            }
        }
    }
    
    private func triggerViewHierarchyValidation(_ player: THEOplayer) {
        // TEMP: trigger a ViewController Hierarchy revalidation for IMA on the iOS THEOplayer SDK
#if canImport(THEOplayerGoogleIMAIntegration)
        let originalFrame = player.frame
        player.frame.size.width -= 1
        player.frame = originalFrame
#endif
    }

    private func setNewSourceDescription(player: THEOplayer, srcDescription: SourceDescription?) {
        if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Setting new source on TheoPlayer") }
#if canImport(THEOplayerConnectorSideloadedSubtitle)
        player.setSourceWithSubtitles(source: srcDescription)
#else
        player.source = srcDescription
#endif
    }

    @objc(setABRConfig:abrConfig:)
    func setABRConfig(_ node: NSNumber, abrConfig: NSDictionary) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Setting abrConfig on TheoPlayer") }
                if let configuredTargetBuffer = abrConfig["targetBuffer"] as? Double {
                    player.abr.targetBuffer = configuredTargetBuffer
                } else if let configuredTargetBuffer = abrConfig["targetBuffer"] as? Int {
                    player.abr.targetBuffer = Double(configuredTargetBuffer)
                }
                if let configuredPreferredPeakBitRate = abrConfig["preferredPeakBitRate"] as? Double {
                    player.abr.preferredPeakBitRate = configuredPreferredPeakBitRate
                } else if let configuredPreferredPeakBitRate = abrConfig["preferredPeakBitRate"] as? Int {
                    player.abr.preferredPeakBitRate = Double(configuredPreferredPeakBitRate)
                }
                if let configuredPreferredMaximumResolution = abrConfig["preferredMaximumResolution"] as? [String:Double] {
                    if let width = configuredPreferredMaximumResolution["width"],
                       let height = configuredPreferredMaximumResolution["height"] {
                        player.abr.preferredMaximumResolution = CGSize(width: width, height: height)
                    }
                } else if let configuredPreferredMaximumResolution = abrConfig["preferredMaximumResolution"] as? [String:Int] {
                    if let width = configuredPreferredMaximumResolution["width"],
                       let height = configuredPreferredMaximumResolution["height"] {
                        player.abr.preferredMaximumResolution = CGSize(width: Double(width), height: Double(height))
                    }
                }
            }
        }
    }

    @objc(setCurrentTime:time:)
    func setCurrentTime(_ node: NSNumber, time: NSNumber) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let timeValue = time.doubleValue * 0.001
                if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Seeking to \(timeValue) on TheoPlayer") }
                player.setCurrentTime(timeValue)
            }
        }
    }

    @objc(setMuted:muted:)
    func setMuted(_ node: NSNumber, muted: Bool) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                if player.muted != muted {
                    if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Changing TheoPlayer to \(muted ? "muted" : "not muted")") }
                    player.muted = muted
                }
            }
        }
    }
    
    @objc(setVolume:volume:)
    func setVolume(_ node: NSNumber, volume: NSNumber) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let newVolume = Float(truncating: volume)
                if player.volume != newVolume {
                    if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Changing TheoPlayer volume to \(newVolume)")}
                    player.volume = newVolume
                }
            }
        }
    }

    @objc(setPlaybackRate:playbackRate:)
    func setPlaybackRate(_ node: NSNumber, playbackRate: NSNumber) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let playbackRateValue = playbackRate.doubleValue
                if player.playbackRate != playbackRateValue {
                    if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Setting playbackRate on TheoPlayer to \(playbackRateValue)") }
                    player.playbackRate = playbackRateValue
                }
            }
        }
    }

    @objc(setPresentationMode:presentationMode:)
    func setPresentationMode(_ node: NSNumber, presentationMode: String) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView {
                let newPresentationMode: PresentationMode = THEOplayerRCTTypeUtils.presentationModeFromString(presentationMode)
                theView.setPresentationMode(newPresentationMode: newPresentationMode)
            }
        }
    }

    @objc(setAspectRatio:ratio:)
        func setAspectRatio(_ node: NSNumber, ratio: String) -> Void {
            DispatchQueue.main.async {
                let newAspectRatio: AspectRatio = THEOplayerRCTTypeUtils.aspectRatioFromString(ratio)
                if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
                   let player = theView.player {
                    if player.aspectRatio != newAspectRatio {
                        if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Changing TheoPlayer's aspectRatio to \(ratio)") }
                        player.aspectRatio = newAspectRatio
                    }
                }
            }
        }

    @objc(setPipConfig:pipConfig:)
    func setPipConfig(_ node: NSNumber, pipConfig: NSDictionary) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView {
                let pipConfig = self.parsePipConfig(configDict: pipConfig)
                theView.pipConfig = pipConfig
            }
        }
    }

    private func parsePipConfig(configDict: NSDictionary) -> PipConfig {
        var pipConfig = PipConfig()
        pipConfig.canStartPictureInPictureAutomaticallyFromInline = configDict["startsAutomatically"] as? Bool ?? false
        return pipConfig
    }

    @objc(setBackgroundAudioConfig:backgroundAudioConfig:)
    func setBackgroundAudioConfig(_ node: NSNumber, backgroundAudioConfig: NSDictionary) -> Void {
        DispatchQueue.main.async {
            let newBackgroundAudioConfig: BackgroundAudioConfig = self.parseBackgroundAudioConfig(configDict: backgroundAudioConfig)
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView {
               theView.backgroundAudioConfig = newBackgroundAudioConfig
            }
        }
    }

    private func parseBackgroundAudioConfig(configDict: NSDictionary) -> BackgroundAudioConfig {
        var backgroundAudio = BackgroundAudioConfig()
        backgroundAudio.enabled = configDict["enabled"] as? Bool ?? false
        backgroundAudio.shouldResumeAfterInterruption = configDict["shouldResumeAfterInterruption"] as? Bool ?? false
        return backgroundAudio
    }

    @objc(setSelectedTextTrack:uid:)
    func setSelectedTextTrack(_ node: NSNumber, uid: NSNumber) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let uidValue = uid.intValue
                let textTracks: TextTrackList = player.textTracks
                guard textTracks.count > 0 else {
                    return
                }
                if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Showing textTrack \(uidValue) on TheoPlayer") }
                for i in 0...textTracks.count-1 {
                    var textTrack: TextTrack = textTracks.get(i)
                    if textTrack.uid == uidValue {
                        textTrack.mode = TextTrackMode.showing
                    } else if textTrack.mode == TextTrackMode.showing {
                        textTrack.mode = TextTrackMode.disabled
                    }
                }
            }
        }
    }

    @objc(setSelectedAudioTrack:uid:)
    func setSelectedAudioTrack(_ node: NSNumber, uid: NSNumber) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let uidValue = uid.intValue
                let audioTracks: AudioTrackList = player.audioTracks
                guard audioTracks.count > 0 else {
                    return
                }
                if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Enabling audioTrack \(uidValue) on TheoPlayer") }
                for i in 0...audioTracks.count-1 {
                    var audioTrack: MediaTrack = audioTracks.get(i)
                    audioTrack.enabled = (audioTrack.uid == uidValue)
                }
            }
        }
    }

    @objc(setSelectedVideoTrack:uid:)
    func setSelectedVideoTrack(_ node: NSNumber, uid: NSNumber) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let uidValue = uid.intValue
                let videoTracks: VideoTrackList = player.videoTracks
                guard videoTracks.count > 0 else {
                    return
                }
                if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Enabling videoTrack \(uidValue) on TheoPlayer") }
                for i in 0...videoTracks.count-1 {
                    var videoTrack: MediaTrack = videoTracks.get(i)
                    videoTrack.enabled = (videoTrack.uid == uidValue)
                }
            }
        }
    }

    @objc(setTargetVideoQuality:uid:)
    func setTargetVideoQuality(_ node: NSNumber, uid: [NSNumber]) -> Void {
        if DEBUG_PLAYER_API { print(ERROR_MESSAGE_PLAYER_QUALITY_UNSUPPORTED_FEATURE) }
        return
    }

    @objc(setPreload:type:)
    func setPreload(_ node: NSNumber, type: String) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let preloadType = THEOplayerRCTTypeUtils.preloadTypeFromString(type)
                if player.preload != preloadType {
                    if DEBUG_PLAYER_API { PrintUtils.printLog(logText: "[NATIVE] Changing TheoPlayer preload type to \(type)") }
                    player.preload = preloadType
                }
            }
        }
    }

    @objc(setTextTrackStyle:textTrackStyle:)
    func setTextTrackStyle(_ node: NSNumber, textTrackStyle: NSDictionary) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                if let bgColorMap = textTrackStyle[TTS_PROP_BACKGROUND_COLOR] as? [String:Any],
                   let r = bgColorMap[TTS_PROP_COLOR_R] as? Int,
                   let g = bgColorMap[TTS_PROP_COLOR_G] as? Int,
                   let b = bgColorMap[TTS_PROP_COLOR_B] as? Int,
                   let a = bgColorMap[TTS_PROP_COLOR_A] as? Int {
                    let bgColor = UIColor(red: CGFloat(r)/255.0, green: CGFloat(g)/255.0, blue: CGFloat(b)/255.0, alpha: CGFloat(a)/255.0)
                    player.textTrackStyle?.backgroundColor = [TextTrackStyleRuleColor(bgColor)]
                }
                if let fontColorMap = textTrackStyle[TTS_PROP_FONT_COLOR] as? [String:Any],
                   let r = fontColorMap[TTS_PROP_COLOR_R] as? Int,
                   let g = fontColorMap[TTS_PROP_COLOR_G] as? Int,
                   let b = fontColorMap[TTS_PROP_COLOR_B] as? Int,
                   let a = fontColorMap[TTS_PROP_COLOR_A] as? Int {
                    let fontColor = UIColor(red: CGFloat(r)/255.0, green: CGFloat(g)/255.0, blue: CGFloat(b)/255.0, alpha: CGFloat(a)/255.0)
                    player.textTrackStyle?.fontColor = [TextTrackStyleRuleColor(fontColor)]
                }
                if let edgeStyle = textTrackStyle[TTS_PROP_EDGE_STYLE] as? String {
                    player.textTrackStyle?.edgeStyle = [TextTrackStyleRuleString(THEOplayerRCTTypeUtils.textTrackEdgeStyleStringFromString(edgeStyle))]
                }
                if let fontFamily = textTrackStyle[TTS_PROP_FONT_FAMILY] as? String {
                    player.textTrackStyle?.fontFamily = [TextTrackStyleRuleString(fontFamily)]
                }
                if let fontSize = textTrackStyle[TTS_PROP_FONT_SIZE] as? Int {
                    player.textTrackStyle?.fontSize = [TextTrackStyleRuleNumber(fontSize)]
                }
                if let marginTop = textTrackStyle[TTS_PROP_MARGIN_TOP] as? Int {
                    player.textTrackStyle?.marginTop = [TextTrackStyleRuleNumber(marginTop)]
                }
                if let marginLeft = textTrackStyle[TTS_PROP_MARGIN_LEFT] as? Int {
                    player.textTrackStyle?.marginLeft = [TextTrackStyleRuleNumber(marginLeft)]
                }
            }
        }
    }

}
