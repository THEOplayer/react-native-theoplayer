//
//  THEORCTPlayerModule.swift
//

@objc(THEORCTPlayerModule)
class THEORCTPlayerModule: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    let playerAPI = THEOplayerRCTPlayerAPI()
    
    static func moduleName() -> String! {
        return "THEORCTPlayerModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    func view(for node: NSNumber) -> THEOplayerRCTView? {
        return self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
    }
    
    @objc(version:rejecter:)
    func version(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        resolve(self.playerAPI.version())
    }
    
    @objc(setPaused:paused:)
    func setPaused(_ node: NSNumber, paused: Bool) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setPaused(self.view(for: node), paused: paused)
        }
    }
    
    @objc(setSource:src:)
    func setSource(_ node: NSNumber, src: NSDictionary) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setSource(self.view(for: node), src: src);
        }
    }
    
    @objc(setABRConfig:abrConfig:)
    func setABRConfig(_ node: NSNumber, abrConfig: NSDictionary) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setABRConfig(self.view(for: node), abrConfig: abrConfig)
        }
    }
    
    @objc(setCurrentTime:time:)
    func setCurrentTime(_ node: NSNumber, time: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setCurrentTime(self.view(for: node), time: time)
        }
    }
    
    @objc(setMuted:muted:)
    func setMuted(_ node: NSNumber, muted: Bool) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setMuted(self.view(for: node), muted: muted)
        }
    }
    
    @objc(setVolume:volume:)
    func setVolume(_ node: NSNumber, volume: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setVolume(self.view(for: node), volume: volume)
        }
    }
    
    @objc(setPlaybackRate:playbackRate:)
    func setPlaybackRate(_ node: NSNumber, playbackRate: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setPlaybackRate(self.view(for: node), playbackRate: playbackRate)
        }
    }
    
    @objc(setPresentationMode:presentationMode:)
    func setPresentationMode(_ node: NSNumber, presentationMode: String) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setPresentationMode(self.view(for: node), presentationMode: presentationMode)
        }
    }
    
    @objc(setAspectRatio:ratio:)
    func setAspectRatio(_ node: NSNumber, ratio: String) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setAspectRatio(self.view(for: node), ratio: ratio)
        }
    }
    
    @objc(setPipConfig:pipConfig:)
    func setPipConfig(_ node: NSNumber, pipConfig: NSDictionary) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setPipConfig(self.view(for: node), pipConfig: pipConfig)
        }
    }
    
    @objc(setBackgroundAudioConfig:backgroundAudioConfig:)
    func setBackgroundAudioConfig(_ node: NSNumber, backgroundAudioConfig: NSDictionary) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setBackgroundAudioConfig(self.view(for: node), backgroundAudioConfig: backgroundAudioConfig)
        }
    }
    
    @objc(setSelectedTextTrack:uid:)
    func setSelectedTextTrack(_ node: NSNumber, uid: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setSelectedTextTrack(self.view(for: node), uid: uid)
        }
    }
    
    @objc(setSelectedAudioTrack:uid:)
    func setSelectedAudioTrack(_ node: NSNumber, uid: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setSelectedAudioTrack(self.view(for: node), uid: uid)
        }
    }
    
    @objc(setSelectedVideoTrack:uid:)
    func setSelectedVideoTrack(_ node: NSNumber, uid: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setSelectedVideoTrack(self.view(for: node), uid: uid)
        }
    }
    
    @objc(setTargetVideoQuality:uid:)
    func setTargetVideoQuality(_ node: NSNumber, uid: [NSNumber]) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setTargetVideoQuality(self.view(for: node), uid: uid)
        }
    }
    
    @objc(setPreload:type:)
    func setPreload(_ node: NSNumber, type: String) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setPreload(self.view(for: node), type: type)
        }
    }
    
    @objc(setTextTrackStyle:textTrackStyle:)
    func setTextTrackStyle(_ node: NSNumber, textTrackStyle: NSDictionary) -> Void {
        DispatchQueue.main.async {
            self.playerAPI.setTextTrackStyle(self.view(for: node), textTrackStyle: textTrackStyle)
        }
    }
}
