// THEOplayerRCTSourceDescriptionBuilder.swift

import Foundation
import THEOplayerSDK
import UIKit

#if canImport(THEOplayerConnectorSideloadedSubtitle)
import THEOplayerConnectorSideloadedSubtitle
#endif

let SD_PROP_SOURCES: String = "sources"
let SD_PROP_POSTER: String = "poster"
let SD_PROP_TEXTTRACKS: String = "textTracks"
let SD_PROP_METADATA: String = "metadata"
let SD_PROP_METADATA_CACHINGTASK_ID: String = "cachingTaskId"
let SD_PROP_METADATAKEYS: String = "metadataKeys"
let SD_PROP_SRC: String = "src"
let SD_PROP_TYPE: String = "type"
let SD_PROP_SSAI: String = "ssai"
let SD_PROP_INTEGRATION: String = "integration"
let SD_PROP_INTEGRATION_PARAMETERS: String = "integrationParameters"
let SD_PROP_AVAILABILITY_TYPE: String = "availabilityType"
let SD_PROP_AUTH_TOKEN: String = "authToken"
let SD_PROP_STREAM_ACTIVITY_MONITOR_ID: String = "streamActivityMonitorID"
let SD_PROP_STREAM_ACTIVITY_MONITOR_ID_THEOADS: String = "streamActivityMonitorId"
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
let SD_PROP_FAIRPLAY: String = "fairplay"
let SD_PROP_WIDEVINE: String = "widevine"
let SD_PROP_CERTIFICATE: String = "certificate"
let SD_PROP_CERTIFICATE_URL: String = "certificateURL"
let SD_PROP_LICENSE_URL: String = "licenseAcquisitionURL"
let SD_PROP_HEADERS: String = "headers"
let SD_PROP_LICENSE_TYPE: String = "licenseType"
let SD_PROP_METADATA_IMAGES: String = "images"
let SD_PROP_METADATA_IMAGE_HEIGHT: String = "height"
let SD_PROP_METADATA_IMAGE_WIDTH: String = "width"
let SD_PROP_METADATA_RELEASE_DATE: String = "releaseDate"
let SD_PROP_METADATA_RELEASE_YEAR: String = "releaseYear"
let SD_PROP_METADATA_TITLE: String = "title"
let SD_PROP_METADATA_SUBTITLE: String = "subtitle"
let SD_PROP_PTS: String = "subtitlePTS"
let SD_PROP_LOCALTIME: String = "subtitleLocaltime"
let SD_PROP_NETWORK_CODE: String = "networkCode"
let SD_PROP_SSE_ENDPOINT: String = "sseEndpoint"
let SD_PROP_CUSTOM_ASSET_KEY: String = "customAssetKey"
let SD_PROP_BACKDROP_DOUBLE_BOX: String = "backdropDoubleBox"
let SD_PROP_BACKDROP_L_SHAPE: String = "backdropLShape"
let SD_PROP_OVERRIDE_LAYOUT: String = "overrideLayout"
let SD_PROP_OVERRIDE_AD_SRC: String = "overrideAdSrc"
let SD_PROP_USE_ID3: String = "useId3"
let SD_PROP_RETRIEVE_POD_ID_URI: String = "retrievePodIdURI"
let SD_PROP_INITIALIZATION_DELAY: String = "initializationDelay"
let SD_PROP_HLS_DATE_RANGE: String = "hlsDateRange"
let SD_PROP_CMCD: String = "cmcd"
let SD_PROP_QUERY_PARAMETERS: String = "queryParameters"

let EXTENSION_HLS: String = ".m3u8"
let EXTENSION_MP4: String = ".mp4"
let EXTENSION_MP3: String = ".mp3"
let EXTENSION_M4A: String = ".m4a"

let MIMETYPE_HLS = "application/x-mpegurl"
let MIMETYPE_MP4 = "video/mp4"
let MIMETYPE_MP3 = "audio/mpeg"
let MIMETYPE_M4A = "audio/mp4"

let DRM_INTEGRATION_ID_EZDRM = "ezdrm"
let DRM_INTEGRATION_ID_KEYOS = "keyos"
let DRM_INTEGRATION_ID_VERIMATRIX = "verimatrix"

class THEOplayerRCTSourceDescriptionBuilder {

    /**
     Builds a THEOplayer SourceDescription that can be passed as a source for the THEOplayer.
     - returns: a THEOplayer TypedSource and an array containing possible sideloaded metadataTracks. In case of SSAI we  support GoogleDAITypedSource with GoogleDAIVodConfiguration or GoogleDAILiveConfiguration
     */
    static func buildSourceDescription(_ sourceData: NSDictionary) -> (SourceDescription?, [TextTrackDescription]?) {
        // 1. Extract "sources"
        guard let sourcesData = sourceData[SD_PROP_SOURCES] else {
            return (nil, nil)
        }
        
#if os(iOS)
        if let metadataData = sourceData[SD_PROP_METADATA] as? [String:Any],
           let cachingTaskId = metadataData[SD_PROP_METADATA_CACHINGTASK_ID] as? String {
            // this is a MediaCache src, so fetch the original SourceDescription from the MediaCache
            let cachingTaskWithId = THEOplayer.cache.tasks.first { cachingTask in
                cachingTask.id == cachingTaskId
            }
            if let foundTask = cachingTaskWithId {
                return (foundTask.source, nil)
            }
        }
#endif

        var typedSources: [TypedSource] = []
        // case: array of source objects
        if let sourcesDataArray = sourcesData as? [[String:Any]] {
            for typedSourceData in sourcesDataArray {
                if let typedSource = THEOplayerRCTSourceDescriptionBuilder.buildTypedSource(typedSourceData) {
                    typedSources.append(typedSource)
                } else {
                    if DEBUG_SOURCE_DESCRIPTION_BUILDER {
                        PrintUtils.printLog(logText: "[NATIVE] Could not create THEOplayer TypedSource from sourceData array")
                    }
                    return (nil, nil)
                }
            }
        }
        // case: single source object
        else if let typedSourceData = sourcesData as? [String:Any] {
            if let typedSource = THEOplayerRCTSourceDescriptionBuilder.buildTypedSource(typedSourceData) {
                typedSources.append(typedSource)
            } else {
                if DEBUG_SOURCE_DESCRIPTION_BUILDER {
                    PrintUtils.printLog(logText: "[NATIVE] Could not create THEOplayer TypedSource from sourceData")
                }
                return (nil, nil)
            }
        }

        // 2. extract 'poster'
        let poster = sourceData[SD_PROP_POSTER] as? String

        // 3. extract 'textTracks'
        var textTrackDescriptions: [TextTrackDescription]?
        var metadataAndChapterTrackDescriptions: [TextTrackDescription]?
        if let textTracksDataArray = sourceData[SD_PROP_TEXTTRACKS] as? [[String:Any]] {
            textTrackDescriptions = []
          metadataAndChapterTrackDescriptions = []
            for textTracksData in textTracksDataArray {
                if let textTrackDescription = THEOplayerRCTSourceDescriptionBuilder.buildTextTrackDescriptions(textTracksData) {
                  if textTrackDescription.kind == .chapters || textTrackDescription.kind == .metadata {
                      metadataAndChapterTrackDescriptions?.append(textTrackDescription)
                    } else {
                        textTrackDescriptions?.append(textTrackDescription)
                    }
                } else {
                    if DEBUG_SOURCE_DESCRIPTION_BUILDER {
                        PrintUtils.printLog(logText: "[NATIVE] Could not create THEOplayer TextTrackDescription from textTrackData array")
                    }
                    return (nil, nil)
                }
            }

        }

        // 4. extract Google IMA "ads"
        let adsDescriptions: [AdDescription]? = self.buildAdDescriptions(sourceData) // Ads Extension

        // 5. extract metadata
        var metadataDescription: MetadataDescription?
        if let metadataData = sourceData[SD_PROP_METADATA] as? [String:Any] {
            metadataDescription = THEOplayerRCTSourceDescriptionBuilder.buildMetaDataDescription(metadataData)
        }
      
        // 6. configure CMCD
        let cmcd = sourceData[SD_PROP_CMCD] as? [String:Any]
        if cmcd != nil {
          typedSources.forEach { typedSource in
            typedSource.cmcd = true;
          }
        }

        // 7. construct the SourceDescription
        let sourceDescription = SourceDescription(sources: typedSources,
                                 textTracks: textTrackDescriptions,
                                 ads: adsDescriptions,
                                 poster: poster,
                                 metadata: metadataDescription)
        
        return (sourceDescription, metadataAndChapterTrackDescriptions)
    }

    // MARK: Private build methods

    /**
     Creates a THEOplayer TypedSource. This requires a source property for non SSAI strreams (either as a string or as an object contiaining a src property). For SSAI streams the TypeSource can be created from the ssai property.
     - returns: a THEOplayer TypedSource. In case of SSAI we  support GoogleDAITypedSource with GoogleDAIVodConfiguration or GoogleDAILiveConfiguration
     */
    private static func buildTypedSource(_ typedSourceData: [String:Any]) -> TypedSource? {
        let contentProtection = extractDrmConfiguration(from: typedSourceData)
        let integration = typedSourceData[SD_PROP_INTEGRATION] as? String
        let type = typedSourceData[SD_PROP_TYPE] as? String
        
        if integration == "theolive" || type == "theolive" {
            return THEOplayerRCTSourceDescriptionBuilder.buildTHEOliveDescription(typedSourceData, contentProtection: contentProtection)
        }

        if type == "millicast" {
            return THEOplayerRCTSourceDescriptionBuilder.buildMillicastDescription(typedSourceData)
        }

        if let src = typedSourceData[SD_PROP_SRC] as? String {
        // extract the type
            let type = typedSourceData[SD_PROP_TYPE] as? String ?? THEOplayerRCTSourceDescriptionBuilder.extractMimeType(src)
            let headers = typedSourceData[SD_PROP_HEADERS] as? [String:String]
            let hlsDateRange = typedSourceData[SD_PROP_HLS_DATE_RANGE] as? Bool

            return TypedSource(src: src,
                               type: type,
                               drm: contentProtection,
                               hlsDateRange: hlsDateRange,
                               headers: headers)
        }

        // Check if we can extract a DAI source
        if let daiSource = self.buildDAITypedSource(typedSourceData, contentProtection: contentProtection) {
            return daiSource
        }

        if DEBUG_SOURCE_DESCRIPTION_BUILDER {
            PrintUtils.printLog(logText: "[NATIVE] THEOplayer TypedSource requires 'src' property in 'sources' description")
        }
        return nil
    }

    private static func extractDrmConfiguration(from typedSourceData: [String:Any]) -> MultiplatformDRMConfiguration? {
        // check for a contentProtection
        guard let contentProtectionData = typedSourceData[SD_PROP_CONTENT_PROTECTION] as? [String:Any] else {
            return nil
        }
        return THEOplayerRCTSourceDescriptionBuilder.buildContentProtection(contentProtectionData)
    }

    /**
     Creates a THEOplayer TextTrackDescription. This requires a textTracks property in the RN source description.
     - returns: a THEOplayer TextTrackDescription
     */
    private static func buildTextTrackDescriptions(_ textTracksData: [String:Any]) -> TextTrackDescription? {
        if let textTrackSrc = textTracksData[SD_PROP_SRC] as? String {
            let textTrackSrcLang = textTracksData[SD_PROP_SRC_LANG] as? String ?? ""
            let textTrackIsDefault = textTracksData[SD_PROP_DEFAULT] as? Bool
            let textTrackLabel = textTracksData[SD_PROP_LABEL] as? String
            let textTrackKind = THEOplayerRCTSourceDescriptionBuilder.extractTextTrackKind(textTracksData[SD_PROP_KIND] as? String)
            let textTrackFormat = THEOplayerRCTSourceDescriptionBuilder.extractTextTrackFormat(textTracksData[SD_PROP_FORMAT] as? String)
            let textTrackPTS = textTracksData[SD_PROP_PTS] as? String
            let textTrackLocalTime = textTracksData[SD_PROP_LOCALTIME] as? String ?? "00:00:00.000"
            
#if canImport(THEOplayerConnectorSideloadedSubtitle)
            let ttDescription = SSTextTrackDescription(src: textTrackSrc,
                                                       srclang: textTrackSrcLang,
                                                       isDefault: textTrackIsDefault,
                                                       kind: textTrackKind,
                                                       label: textTrackLabel,
                                                       format: textTrackFormat)
            if let pts = textTrackPTS {
                ttDescription.vttTimestamp = .init(pts: pts, localTime: textTrackLocalTime)
            }
#else
            let ttDescription = TextTrackDescription(src: textTrackSrc,
                                                       srclang: textTrackSrcLang,
                                                       isDefault: textTrackIsDefault,
                                                       kind: textTrackKind,
                                                       label: textTrackLabel,
                                                       format: textTrackFormat)
#endif
            return ttDescription
        }
        return nil
    }

    /**
     Creates a THEOplayer MetadataDescription. This requires a metadata property in the RN source description.
     - returns: a THEOplayer MetadataDescription
     */
    static func buildMetaDataDescription(_ metadataData: [String:Any]) -> MetadataDescription? {
        // first extract explicit casting metadata:
#if os(iOS)
        var images: [ChromecastMetadataImage]?
        if let metadataImagesArrayData = metadataData[SD_PROP_METADATA_IMAGES] as? [[String:Any]] {
            images = THEOplayerRCTSourceDescriptionBuilder.buildChromecastMetaDataImagesArray(metadataImagesArrayData)
        }
        let type = THEOplayerRCTSourceDescriptionBuilder.buildChromecastMetadataType(metadataData[SD_PROP_TYPE] as? String)
        let releaseDate = metadataData[SD_PROP_METADATA_RELEASE_DATE] as? String
        let releaseYear = metadataData[SD_PROP_METADATA_RELEASE_YEAR] as? Int
        let title = metadataData[SD_PROP_METADATA_TITLE] as? String
        let subtitle = metadataData[SD_PROP_METADATA_SUBTITLE] as? String
        // all the non-casting related metadata goes in the metadataKeys:
        let metadataKeys = metadataData.filter { metadataElement in
            !(metadataElement.key == SD_PROP_TYPE || metadataElement.key == SD_PROP_METADATA_IMAGES)
        }
        return ChromecastMetadataDescription(images: images,
                                             releaseDate: releaseDate,
                                             releaseYear: releaseYear,
                                             title: title,
                                             subtitle: subtitle,
                                             type: type,
                                             metadataKeys: metadataKeys)
#else
        let title = metadataData[SD_PROP_METADATA_TITLE] as? String
        return MetadataDescription(metadataKeys: metadataData, title: title)
#endif
    }

#if os(iOS)
    static func buildChromecastMetadataType(_ metadataType: String?) -> ChromecastMetadataType {
        guard let typeString = metadataType else {
            return ChromecastMetadataType.GENERIC
        }
        switch typeString {
        case "none": return ChromecastMetadataType.NONE
        case "audio": return ChromecastMetadataType.AUDIO
        case "tv-show": return ChromecastMetadataType.TV_SHOW
        case "generic": return ChromecastMetadataType.GENERIC
        case "movie": return ChromecastMetadataType.MOVIE
        default: return ChromecastMetadataType.GENERIC
        }
    }

    static func buildChromecastMetaDataImagesArray(_ metadataImagesArrayData: [[String:Any]]) -> [ChromecastMetadataImage]? {
        var images: [ChromecastMetadataImage] = []
        for metadataImageData in metadataImagesArrayData {
            if let image: ChromecastMetadataImage = THEOplayerRCTSourceDescriptionBuilder.buildChromecastMetaDataImage(metadataImageData) {
                images.append(image)
            }
        }
        return images.count > 0 ? images : nil
    }

    static func buildChromecastMetaDataImage(_ metadataImageData: [String:Any]) -> ChromecastMetadataImage? {
        if let src = metadataImageData[SD_PROP_SRC] as? String,
           let width = metadataImageData[SD_PROP_METADATA_IMAGE_WIDTH] as? Int,
           let height = metadataImageData[SD_PROP_METADATA_IMAGE_HEIGHT] as? Int {
            return ChromecastMetadataImage(src: src, width: width, height: height)
        }
        return nil
    }
#endif

    /**
     Creates a THEOplayer DRMConfiguration. This requires a contentProtection property in the RN source description.
     - returns: a THEOplayer DRMConfiguration
     */
    static func buildContentProtection(_ contentProtectionData: [String:Any]) -> MultiplatformDRMConfiguration? {
        let customIntegrationId = contentProtectionData[SD_PROP_INTEGRATION] as? String ?? "internal"
        
        // fairplay
        var fairplayKeySystem: THEOplayerSDK.KeySystemConfiguration? = nil
        if let fairplayData = contentProtectionData[SD_PROP_FAIRPLAY] as? [String:Any] {
            // certificateUrl
            var certificateUrl = fairplayData[SD_PROP_CERTIFICATE_URL] as? String
            if let certificate = fairplayData[SD_PROP_CERTIFICATE] as? String {
                certificateUrl = "\(CERTIFICATE_MARKER)\(certificate)"
            }
            let licenseAcquisitionURL = fairplayData[SD_PROP_LICENSE_URL] as? String
            let headers = fairplayData[SD_PROP_HEADERS] as? [String:String]
            let licenseType = fairplayData[SD_PROP_LICENSE_TYPE] as? String
            let queryParameters = fairplayData[SD_PROP_QUERY_PARAMETERS] as? [String:String]
                
            fairplayKeySystem = KeySystemConfiguration(
                licenseAcquisitionURL: licenseAcquisitionURL,
                certificateURL: certificateUrl,
                licenseType: licenseType == "persistent" ? LicenseType.persistent : LicenseType.temporary,
                headers: headers,
                queryParameters: queryParameters
            )
        }
        
        // widevine
        var widevineKeySystem: THEOplayerSDK.KeySystemConfiguration? = nil
        if let widevineData = contentProtectionData[SD_PROP_WIDEVINE] as? [String:Any] {
            // certificateUrl
            var certificateUrl = widevineData[SD_PROP_CERTIFICATE_URL] as? String
            if let certificate = widevineData[SD_PROP_CERTIFICATE] as? String {
                certificateUrl = "\(CERTIFICATE_MARKER)\(certificate)"
            }
            let licenseAcquisitionURL = widevineData[SD_PROP_LICENSE_URL] as? String
            let headers = widevineData[SD_PROP_HEADERS] as? [String:String]
            let licenseType = widevineData[SD_PROP_LICENSE_TYPE] as? String
            let queryParameters = widevineData[SD_PROP_QUERY_PARAMETERS] as? [String:String]
                
            widevineKeySystem = KeySystemConfiguration(
                licenseAcquisitionURL: licenseAcquisitionURL,
                certificateURL: certificateUrl,
                licenseType: licenseType == "persistent" ? LicenseType.persistent : LicenseType.temporary,
                headers: headers,
                queryParameters: queryParameters
            )
        }
        
        // global query parameters
        let queryParameters = contentProtectionData[SD_PROP_QUERY_PARAMETERS] as? [String:String]
        let integrationParameters = contentProtectionData[SD_PROP_INTEGRATION_PARAMETERS] as? [String:Any] ?? [:]
        
        return MultiplatformDRMConfiguration(
            customIntegrationId: customIntegrationId,
            integrationParameters: integrationParameters,
            keySystemConfigurations: KeySystemConfigurationCollection(fairplay: fairplayKeySystem, widevine: widevineKeySystem),
            queryParameters: queryParameters
        )
    }


    // MARK: Helper methods

    private static func extractMimeType(_ src: String) -> String {
        if src.suffix(5) == EXTENSION_HLS {
            return MIMETYPE_HLS
        } else if src.suffix(4) == EXTENSION_MP4 {
            return MIMETYPE_MP4
        } else if src.suffix(4) == EXTENSION_MP3 {
            return MIMETYPE_MP3
        } else if src.suffix(4) == EXTENSION_M4A {
            return MIMETYPE_M4A
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
        } else if format == "srt" {
            return THEOplayerSDK.TextTrackFormat.SRT
        } else {
            return THEOplayerSDK.TextTrackFormat.none
        }
    }
}
