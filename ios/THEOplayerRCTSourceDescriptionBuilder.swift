// THEOplayerRCTSourceDescriptionBuilder.swift

import Foundation
import THEOplayerSDK
import UIKit

let SD_PROP_SOURCES: String = "sources"
let SD_PROP_POSTER: String = "poster"
let SD_PROP_TEXTTRACKS: String = "textTracks"
let SD_PROP_SRC: String = "src"
let SD_PROP_TYPE: String = "type"
let SD_PROP_INTEGRATION: String = "integration"
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
        
        // 4. construct and return SourceDescription
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
            print(textTrackKind._rawValue)
            print(textTrackFormat._rawValue)
            return TextTrackDescription(src: textTrackSrc,
                                        srclang: textTrackSrcLang,
                                        isDefault: textTrackIsDefault,
                                        kind: textTrackKind,
                                        label: textTrackLabel,
                                        format: textTrackFormat)
        }
        return nil
    }
    
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
