// THEOplayerRCTSourceDescriptionBuilder+Millicast.swift

import Foundation
import THEOplayerSDK
import UIKit

#if canImport(THEOplayerMillicastIntegration)
import MillicastSDK
import THEOplayerMillicastIntegration
#endif

let SD_PROP_ACCOUNTID: String = "streamAccountId"
let SD_PROP_SUBSCRIBERTOKEN: String = "subscriberToken"
let SD_PROP_CONNECTOPTIONS: String = "connectOptions"

extension THEOplayerRCTSourceDescriptionBuilder {

    /**
     Builds a THEOplayer SourceDescription that can be passed as a source for the THEOplayer.
     - returns: a Millicast TypedSource.
     */
    static func buildMillicastDescription(_ millicastData: [String:Any]) -> TypedSource? {
#if canImport(THEOplayerMillicastIntegration)
      if let src = millicastData[SD_PROP_SRC] as? String,
         let accountID = millicastData[SD_PROP_ACCOUNTID] as? String {
        let subscriberToken = millicastData[SD_PROP_SUBSCRIBERTOKEN] as? String;
        
        if millicastData[SD_PROP_CONNECTOPTIONS] == nil {
          return MillicastSource(src: src, streamAccountId: accountID, subscriberToken: subscriberToken)
        }
        
        let dict = millicastData[SD_PROP_CONNECTOPTIONS] as? NSDictionary;
        let connectOptions = buildConnectOptions(dict)
        return MillicastSource(src: src, streamAccountId: accountID, subscriberToken: nil, connectOptions: connectOptions)
      }
#endif
      return nil
    }

#if canImport(THEOplayerMillicastIntegration)
  static func buildConnectOptions(_ connectOptions: NSDictionary?) -> MCClientOptions {
    let result: MCClientOptions = .init()
    if let bweMonitorDurationUs = connectOptions?["bweMonitorDurationUs"] as? NSNumber {
      result.bweMonitorDurationUs = bweMonitorDurationUs
    }
    if let bweRateChangePercentage = connectOptions?["bweRateChangePercentage"] as? NSNumber {
      result.bweRateChangePercentage = bweRateChangePercentage
    }
    if let degradationPreferences = connectOptions?["degradationPreferences"] as? String {
      switch degradationPreferences {
      case "balanced":
        result.degradationPreferences = MCDegradationPreferences.balanced
      case "disabled":
        result.degradationPreferences = MCDegradationPreferences.disabled
      case "maintainFrameRate":
        result.degradationPreferences = MCDegradationPreferences.maintainFrameRate
      case "maintainResolution":
        result.degradationPreferences = MCDegradationPreferences.maintainResolution
      default:
        result.degradationPreferences = MCDegradationPreferences.default
      }
    }
    if let disableAudio = connectOptions?["disableAudio"] as? Bool {
      result.disableAudio = disableAudio
    }
    if let dtx = connectOptions?["dtx"] as? Bool {
      result.dtx = dtx
    }
    if let excludedSourceId = connectOptions?["excludedSourceIds"] as? [Any] {
      result.excludedSourceId = excludedSourceId
    }
    if let forcePlayoutDelayDict = connectOptions?["forcePlayoutDelay"] as? NSDictionary,
       let maximum = forcePlayoutDelayDict["max"] as? Int32,
       let minimum = forcePlayoutDelayDict["min"] as? Int32 {
      let forcePlayoutDelay: MCForcePlayoutDelay = .init(min: minimum, max: maximum)
      result.forcePlayoutDelay = forcePlayoutDelay
    }
    if let forceSmooth = connectOptions?["forceSmooth"] as? Bool {
      result.forceSmooth = forceSmooth
    }
    if let jitterMinimumDelayMs = connectOptions?["jitterMinimumDelayMs"] as? Int32 {
      result.jitterMinimumDelayMs = jitterMinimumDelayMs
    }
    if let maximumBitrate = connectOptions?["maximumBitrate"] as? NSNumber {
      result.maximumBitrate = maximumBitrate
    }
    if let multiplexedAudioTrack = connectOptions?["multiplexedAudioTracks"] as? Int32 {
      result.multiplexedAudioTrack = multiplexedAudioTrack
    }
    if let pinnedSourceId = connectOptions?["pinnedSourceId"] as? String {
      result.pinnedSourceId = pinnedSourceId
    }
    if let priority = connectOptions?["priority"] as? NSNumber {
      result.priority = priority
    }
    if let recordStream = connectOptions?["recordStream"] as? Bool {
      result.recordStream = recordStream
    }
    if let rtcEventLogOutputPath = connectOptions?["rtcEventLogOutputPath"] as? String {
      result.rtcEventLogOutputPath = rtcEventLogOutputPath
    }
    if let simulcast = connectOptions?["simulcast"] as? Bool {
      result.simulcast = simulcast
    }
    if let sourceId = connectOptions?["sourceId"] as? String {
      result.sourceId = sourceId
    }
    if let statsDelayMs = connectOptions?["statsDelayMs"] as? Int32 {
      result.statsDelayMs = statsDelayMs
    }
    if let stereo = connectOptions?["stereo"] as? Bool {
      result.stereo = stereo
    }
    if let svcMode = connectOptions?["svcMode"] as? String {
      switch svcMode {
      case "l1t2":
        result.svcMode = MCScalabilityMode.l1t2
      case "l1t2h":
        result.svcMode = MCScalabilityMode.l1t2h
      case "l1t3":
        result.svcMode = MCScalabilityMode.l1t3
      case "l1t3h":
        result.svcMode = MCScalabilityMode.l1t3h
      case "l2t1":
        result.svcMode = MCScalabilityMode.l2t1
      case "l2t1Key":
        result.svcMode = MCScalabilityMode.l2t1Key
      case "l2t1h":
        result.svcMode = MCScalabilityMode.l2t1h
      case "l2t2":
        result.svcMode = MCScalabilityMode.l2t2
      case "l2t2Key":
        result.svcMode = MCScalabilityMode.l2t2Key
      case "l2t2KeyShift":
        result.svcMode = MCScalabilityMode.l2t2KeyShift
      case "l2t2h":
        result.svcMode = MCScalabilityMode.l2t2h
      case "l2t3":
        result.svcMode = MCScalabilityMode.l2t3
      case "l2t3h":
        result.svcMode = MCScalabilityMode.l2t3h
      case "l3t1":
        result.svcMode = MCScalabilityMode.l3t1
      case "l3t2":
        result.svcMode = MCScalabilityMode.l3t2
      case "l3t3":
        result.svcMode = MCScalabilityMode.l3t3
      case "l3t3Key":
        result.svcMode = MCScalabilityMode.l3t3Key
      case "none":
        result.svcMode = MCScalabilityMode.none
      case "s2t1":
        result.svcMode = MCScalabilityMode.s2t1
      case "s2t1h":
        result.svcMode = MCScalabilityMode.s2t1h
      case "s2t2":
        result.svcMode = MCScalabilityMode.s2t2
      case "s2t2h":
        result.svcMode = MCScalabilityMode.s2t2h
      case "s2t3":
        result.svcMode = MCScalabilityMode.s2t3
      case "s2t3h":
        result.svcMode = MCScalabilityMode.s2t3h
      case "s3t1":
        result.svcMode = MCScalabilityMode.s3t1
      case "s3t1h":
        result.svcMode = MCScalabilityMode.s3t1h
      case "s3t2":
        result.svcMode = MCScalabilityMode.s3t2
      case "s3t2h":
        result.svcMode = MCScalabilityMode.s3t2h
      case "s3t3":
        result.svcMode = MCScalabilityMode.s3t3
      case "s3t3h":
        result.svcMode = MCScalabilityMode.s3t3h
      default:
        break
      }
    }
    if let upwardsLayerWaitTimeMs = connectOptions?["upwardsLayerWaitTimeMs"] as? NSNumber {
      result.upwardsLayerWaitTimeMs = upwardsLayerWaitTimeMs
    }
    if let videoCodec = connectOptions?["videoCodec"] as? String {
      result.videoCodec = videoCodec
    }
    return result
  }
#endif
}
