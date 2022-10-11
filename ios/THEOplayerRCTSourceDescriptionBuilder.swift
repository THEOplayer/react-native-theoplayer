// THEOplayerRCTSourceDescriptionBuilder.swift

import Foundation
import THEOplayerSDK
import UIKit

let SD_PROP_SOURCES: String = "sources"
let SD_PROP_POSTER: String = "poster"
let SD_PROP_TEXTTRACKS: String = "textTracks"
let SD_PROP_ADS: String = "ads"
let SD_PROP_SRC: String = "src"
let SD_PROP_TYPE: String = "type"
let SD_PROP_SSAI: String = "ssai"
let SD_PROP_INTEGRATION: String = "integration"
let SD_PROP_AVAILABILITY_TYPE: String = "availabilityType"
let SD_PROP_AUTH_TOKEN: String = "authToken"
let SD_PROP_STREAM_ACTIVITY_MONITOR_ID: String = "streamActivityMonitorID"
let SD_PROP_AD_TAG_PARAMETERS: String = "adTagParameters"
let SD_PROP_APIKEY: String = "apiKey"
let SD_PROP_VIDEOID: String = "videoID"
let SD_PROP_CONTENT_SOURCE_ID: String = "contentSourceID"
let SD_PROP_ASSET_KEY: String = "assetKey"
let SD_PROP_TIME_OFFSET: String = "timeOffset"
let SD_PROP_SRC_LANG: String = "srclang"
let SD_PROP_DEFAULT: String = "default"
let SD_PROP_LABEL: String = "label"
let SD_PROP_KIND: String = "kind"
let SD_PROP_FORMAT: String = "format"
let SD_PROP_CONTENT_PROTECTION: String = "contentProtection"

let EXTENSION_HLS: String = ".m3u8"
let EXTENSION_MP4: String = ".mp4"
let EXTENSION_MP3: String = ".mp3"

let MIMETYPE_HLS = "application/x-mpegurl"
let MIMETYPE_MP4 = "video/mp4"
let MIMETYPE_MP3 = "audio/mpeg"

let DRM_INTEGRATION_ID_EZDRM = "ezdrm"
let DRM_INTEGRATION_ID_KEYOS = "keyos"
let DRM_INTEGRATION_ID_VERIMATRIX = "verimatrix"

class THEOplayerRCTSourceDescriptionBuilder {
    
    /**
     Builds a THEOplayer SourceDescription that can be passed as a source for the THEOplayer.
     - returns: a THEOplayer TypedSource. In case of SSAI we  support GoogleDAITypedSource with GoogleDAIVodConfiguration or GoogleDAILiveConfiguration
     */
    static func buildSourceDescription(_ sourceData: NSDictionary) -> SourceDescription? {
        // 1. Extract "sources"
        guard let sourcesData = sourceData[SD_PROP_SOURCES] else {
            return nil
        }
        
        var typedSources: [TypedSource] = []
        // case: array of source objects
        if let sourcesDataArray = sourcesData as? [[String:Any]] {
            for typedSourceData in sourcesDataArray {
                if let typedSource = THEOplayerRCTSourceDescriptionBuilder.buildTypedSource(typedSourceData) {
                    typedSources.append(typedSource)
                } else {
                    if DEBUG_SOURCE_DESCRIPTION_BUIDER {
                        print("[NATIVE] Could not create THEOplayer TypedSource from sourceData array")
                    }
                    return nil
                }
            }
        }
        // case: single source object
        else if let typedSourceData = sourcesData as? [String:Any] {
            if let typedSource = THEOplayerRCTSourceDescriptionBuilder.buildTypedSource(typedSourceData) {
                typedSources.append(typedSource)
            } else {
                if DEBUG_SOURCE_DESCRIPTION_BUIDER {
                    print("[NATIVE] Could not create THEOplayer TypedSource from sourceData")
                }
                return nil
            }
        }
        
        // 2. extract 'poster'
        let poster = sourceData[SD_PROP_POSTER] as? String
        
        // 3. extract 'textTracks'
        var textTrackDescriptions: [TextTrackDescription]?
        if let textTracksDataArray = sourceData[SD_PROP_TEXTTRACKS] as? [[String:Any]] {
            textTrackDescriptions = []
            for textTracksData in textTracksDataArray {
                if let textTrackDescription = THEOplayerRCTSourceDescriptionBuilder.buildTextTrackDescriptions(textTracksData) {
                    textTrackDescriptions?.append(textTrackDescription)
                } else {
                    if DEBUG_SOURCE_DESCRIPTION_BUIDER {
                        print("[NATIVE] Could not create THEOplayer TextTrackDescription from textTrackData array")
                    }
                    return nil
                }
            }
            
        }
        
        // 4. extract Google IMA "ads"
        var adsDescriptions: [AdDescription]?
        
#if ADS && GOOGLE_IMA
        if let ads = sourceData[SD_PROP_ADS] {
            adsDescriptions = []
            // case: array of ads objects
            if let adsDataArray = ads as? [[String:Any]] {
                for adsData in adsDataArray {
                    if let adDescription = THEOplayerRCTSourceDescriptionBuilder.buildAdDescription(adsData) {
                        adsDescriptions?.append(adDescription)
                    } else {
                        if DEBUG_SOURCE_DESCRIPTION_BUIDER {
                            print("[NATIVE] Could not create THEOplayer GoogleImaAdDescription from adsData array")
                        }
                        return nil
                    }
                }
            }
            // case: single ads object
            else if let adsData = ads as? [String:Any] {
                if let adDescription = THEOplayerRCTSourceDescriptionBuilder.buildAdDescription(adsData) {
                    adsDescriptions?.append(adDescription)
                } else {
                    if DEBUG_SOURCE_DESCRIPTION_BUIDER {
                        print("[NATIVE] Could not create THEOplayer GoogleImaAdDescription from adsData")
                    }
                    return nil
                }
            }
        }
#endif
        
        // 5. construct and return SourceDescription
        return SourceDescription(sources: typedSources,
                                 textTracks: textTrackDescriptions,
                                 poster: poster,
                                 metadata: nil)     // TODO
    }
    
    // MARK: Private build methods
    
    /**
     Creates a THEOplayer TypedSource. This requires a source property for non SSAI strreams (either as a string or as an object contiaining a src property). For SSAI streams the TypeSource can be created from the ssai property.
     - returns: a THEOplayer TypedSource. In case of SSAI we  support GoogleDAITypedSource with GoogleDAIVodConfiguration or GoogleDAILiveConfiguration
     */
    private static func buildTypedSource(_ typedSourceData: [String:Any]) -> TypedSource? {
        if let src = typedSourceData[SD_PROP_SRC] as? String {
            // extract the type
            let type = typedSourceData[SD_PROP_TYPE] as? String ?? THEOplayerRCTSourceDescriptionBuilder.extractMimeType(src)
            // check for a contentProtection
            var contentProtection: MultiplatformDRMConfiguration?
            if let contentProtectionData = typedSourceData[SD_PROP_CONTENT_PROTECTION] as? [String:Any] {
                contentProtection = THEOplayerRCTSourceDescriptionBuilder.buildContentProtection(contentProtectionData)
            }
            
            return TypedSource(src: src,
                               type: type,
                               drm: contentProtection)
        }
        
#if ADS && GOOGLE_DAI
        // check for alternative Google DAI SSAI
        if let ssaiData = typedSourceData[SD_PROP_SSAI] as? [String:Any] {
            if let integration = ssaiData[SD_PROP_INTEGRATION] as? String,
               integration == SSAIIntegrationId.GoogleDAISSAIIntegrationID._rawValue {
                if let availabilityType = ssaiData[SD_PROP_AVAILABILITY_TYPE] as? String {
                    // build a GoogleDAIConfiguration
                    var googleDaiConfig: GoogleDAIConfiguration?
                    let authToken = ssaiData[SD_PROP_AUTH_TOKEN] as? String
                    let streamActivityMonitorID = ssaiData[SD_PROP_STREAM_ACTIVITY_MONITOR_ID] as? String
                    let adTagParameters = ssaiData[SD_PROP_AD_TAG_PARAMETERS] as? [String:String]
                    let apiKey = ssaiData[SD_PROP_APIKEY] as? String ?? ""
                    switch availabilityType {
                    case StreamType.vod._rawValue:
                        if let videoId = ssaiData[SD_PROP_VIDEOID] as? String,
                           let contentSourceID = ssaiData[SD_PROP_CONTENT_SOURCE_ID] as? String {
                            googleDaiConfig = GoogleDAIVodConfiguration(videoID: videoId,
                                                                        contentSourceID: contentSourceID,
                                                                        apiKey: apiKey,
                                                                        authToken: authToken,
                                                                        streamActivityMonitorID: streamActivityMonitorID,
                                                                        adTagParameters: adTagParameters)
                        }
                    case StreamType.live._rawValue:
                        if let assetKey = ssaiData[SD_PROP_ASSET_KEY] as? String {
                            googleDaiConfig = GoogleDAILiveConfiguration(assetKey: assetKey,
                                                                         apiKey: apiKey,
                                                                         authToken: authToken,
                                                                         streamActivityMonitorID: streamActivityMonitorID,
                                                                         adTagParameters: adTagParameters)
                        }
                    default:
                        if DEBUG_SOURCE_DESCRIPTION_BUIDER {
                            print("[NATIVE] THEOplayer ssai 'availabilityType' must be 'live' or 'vod'")
                        }
                        return nil
                    }
                    // when valid, create a GoolgeDAITypedSource from the GoogleDAIConfiguration
                    if let config = googleDaiConfig {
                        return GoogleDAITypedSource(ssai: config)
                    }
                }
            }
        }
#endif
        if DEBUG_SOURCE_DESCRIPTION_BUIDER {
            print("[NATIVE] THEOplayer TypedSource requires 'src' property in 'sources' description")
        }
        return nil
    }
    
    /**
     Creates a THEOplayer TextTrackDescription. This requires a textTracks property in the RN source description.
     - returns: a THEOplayer TextTrackDescription
     */
    private static func buildTextTrackDescriptions(_ textTracksData: [String:Any]) -> TextTrackDescription? {
        if let textTrackSrc = textTracksData[SD_PROP_SRC] as? String,
           let textTrackSrcLang = textTracksData[SD_PROP_SRC_LANG] as? String {
            let textTrackIsDefault = textTracksData[SD_PROP_DEFAULT] as? Bool
            let textTrackLabel = textTracksData[SD_PROP_LABEL] as? String
            let textTrackKind = THEOplayerRCTSourceDescriptionBuilder.extractTextTrackKind(textTracksData[SD_PROP_KIND] as? String)
            let textTrackFormat = THEOplayerRCTSourceDescriptionBuilder.extractTextTrackFormat(textTracksData[SD_PROP_FORMAT] as? String)
            return TextTrackDescription(src: textTrackSrc,
                                        srclang: textTrackSrcLang,
                                        isDefault: textTrackIsDefault,
                                        kind: textTrackKind,
                                        label: textTrackLabel,
                                        format: textTrackFormat)
        }
        return nil
    }
    
#if ADS && GOOGLE_IMA
    /**
     Creates a THEOplayer GoogleImaAdDescription. This requires an ads property in the RN source description.
     - returns: a THEOplayer GoogleImaAdDescription
     */
    static func buildAdDescription(_ adsData: [String:Any]) -> AdDescription? {
        if let integration = adsData[SD_PROP_INTEGRATION] as? String,
           integration == AdIntegration.google_ima._rawValue {
            // timeOffset can be Int or String: 10, "01:32:54.78", "1234.56", "start", "end", "10%", ...
            let timeOffset = adsData[SD_PROP_TIME_OFFSET] as? String ?? String(adsData[SD_PROP_TIME_OFFSET] as? Int ?? 0)
            var srcString: String?
            if let sourcesData = adsData[SD_PROP_SOURCES] as? [String:Any] {
                srcString = sourcesData[SD_PROP_SRC] as? String
            } else if let sourcesData = adsData[SD_PROP_SOURCES] as? String {
                srcString = sourcesData
            }
            if let src = srcString {
                return GoogleImaAdDescription(src: src, timeOffset: timeOffset)
            } else {
                if DEBUG_SOURCE_DESCRIPTION_BUIDER  { print("[NATIVE] AdDescription requires 'src' property in 'ads' description.") }
            }
        }
        if DEBUG_SOURCE_DESCRIPTION_BUIDER  { print("[NATIVE] We currently require and only support the 'google-ima' integration in the 'ads' description.") }
        return nil
    }
#endif
    
    /**
     Creates a THEOplayer DRMConfiguration. This requires a contentProtection property in the RN source description.
     - returns: a THEOplayer DRMConfiguration
     */
    private static func buildContentProtection(_ contentProtectionData: [String:Any]) -> MultiplatformDRMConfiguration? {
        do {
            let data = try JSONSerialization.data(withJSONObject: contentProtectionData)
            if let integration = contentProtectionData[SD_PROP_INTEGRATION] as? String {
                switch integration {
                case DRM_INTEGRATION_ID_EZDRM: return try JSONDecoder().decode(EzdrmDRMConfiguration.self, from: data)
                case DRM_INTEGRATION_ID_KEYOS: return try JSONDecoder().decode(KeyOSDRMConfiguration.self, from: data)
                case DRM_INTEGRATION_ID_VERIMATRIX: return try JSONDecoder().decode(VerimatrixDRMConfiguration.self, from: data)
                default: print("[NATIVE] \(integration): unsupported drm integration")
                }
            } else {
                print("[NATIVE] integration type not specified... trying default drm integration")
                return try JSONDecoder().decode(MultiplatformDRMConfiguration.self, from: data)
            }
        } catch {
            print("[NATIVE] unsupported contentProtection data format")
        }
        return nil
    }
    
    
    // MARK: Helper methods
    
    private static func extractMimeType(_ src: String) -> String {
        if src.suffix(5) == EXTENSION_HLS {
            return MIMETYPE_HLS
        } else if src.suffix(4) == EXTENSION_MP4 {
            return MIMETYPE_MP4
        } else if src.suffix(4) == EXTENSION_MP3 {
            return MIMETYPE_MP3
        }
        return MIMETYPE_HLS
    }
    
    private static func extractTextTrackKind(_ kindString: String?) -> THEOplayerSDK.TextTrackKind {
        guard let kind = kindString else {
            return THEOplayerSDK.TextTrackKind.none
        }
        
        switch kind {
        case "subtitles": return THEOplayerSDK.TextTrackKind.subtitles
        case "captions": return THEOplayerSDK.TextTrackKind.captions
        case "description": return THEOplayerSDK.TextTrackKind.description
        case "chapters": return THEOplayerSDK.TextTrackKind.chapters
        case "metadata": return THEOplayerSDK.TextTrackKind.metadata
        default: return THEOplayerSDK.TextTrackKind.none
            
        }
    }
    
    private static func extractTextTrackFormat(_ formatString: String?) -> THEOplayerSDK.TextTrackFormat {
        guard let format = formatString else {
            return THEOplayerSDK.TextTrackFormat.none
        }
        
        if format == "webvtt" {
            return THEOplayerSDK.TextTrackFormat.WebVTT
        } else {
            return THEOplayerSDK.TextTrackFormat.none
        }
    }
}
