// THEOplayerRCTSourceDescriptionBuilder.swift

import Foundation
import THEOplayerSDK
import UIKit

let SD_PROP_SOURCES: String = "sources"
let SD_PROP_POSTER: String = "poster"
let SD_PROP_TEXTTRACKS: String = "textTracks"
let SD_PROP_METADATA: String = "metadata"
let SD_PROP_SRC: String = "src"
let SD_PROP_TYPE: String = "type"
let SD_PROP_SSAI: String = "ssai"
let SD_PROP_INTEGRATION: String = "integration"
let SD_PROP_INTEGRATION_PARAMETERS: String = "integrationParameters"
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
                        PrintUtils.printLog(logText: "[NATIVE] Could not create THEOplayer TypedSource from sourceData array")
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
                    PrintUtils.printLog(logText: "[NATIVE] Could not create THEOplayer TypedSource from sourceData")
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
                        PrintUtils.printLog(logText: "[NATIVE] Could not create THEOplayer TextTrackDescription from textTrackData array")
                    }
                    return nil
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

        // 6. construct and return SourceDescription
        return SourceDescription(sources: typedSources,
                                 textTracks: textTrackDescriptions,
                                 ads: adsDescriptions,
                                 poster: poster,
                                 metadata: metadataDescription)
    }

    // MARK: Private build methods

    /**
     Creates a THEOplayer TypedSource. This requires a source property for non SSAI strreams (either as a string or as an object contiaining a src property). For SSAI streams the TypeSource can be created from the ssai property.
     - returns: a THEOplayer TypedSource. In case of SSAI we  support GoogleDAITypedSource with GoogleDAIVodConfiguration or GoogleDAILiveConfiguration
     */
    private static func buildTypedSource(_ typedSourceData: [String:Any]) -> TypedSource? {
        let contentProtection = extractDrmConfiguration(from: typedSourceData)
        if let src = typedSourceData[SD_PROP_SRC] as? String {
            // extract the type
            let type = typedSourceData[SD_PROP_TYPE] as? String ?? THEOplayerRCTSourceDescriptionBuilder.extractMimeType(src)
            return TypedSource(src: src,
                               type: type,
                               drm: contentProtection)
        }

        // Check if we can extract a DAI source
        if let daiSource = self.buildDAITypedSource(typedSourceData, contentProtection: contentProtection) {
            return daiSource
        }

        if DEBUG_SOURCE_DESCRIPTION_BUIDER {
            PrintUtils.printLog(logText: "[NATIVE] THEOplayer TypedSource requires 'src' property in 'sources' description")
        }
        return nil
    }

    private static func extractDrmConfiguration(from typedSourceData: [String:Any]) -> MultiplatformDRMConfiguration? {
        // check for a contentProtection
        guard let contentProtectionData = typedSourceData[SD_PROP_CONTENT_PROTECTION] as? [String:Any] else {
            return nil
        }
        let sanitisedContentProtectionData = THEOplayerRCTSourceDescriptionBuilder.sanitiseContentProtectionData(contentProtectionData)
        return THEOplayerRCTSourceDescriptionBuilder.buildContentProtection(sanitisedContentProtectionData)
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
     Updates the contentProtectionData to a valid iOS SDK contentProtectionData, flattening out cross SDK differences
     - returns: a THEOplayer valid contentProtection data map
     */
    private static func sanitiseContentProtectionData(_ contentProtectionData: [String:Any]) -> [String:Any] {
        var sanitisedContentProtectionData: [String:Any] = contentProtectionData
        // fairplay update
        if let fairplayData = contentProtectionData[SD_PROP_FAIRPLAY] as? [String:Any] {
            var sanitisedFairplayData: [String:Any] = [:]
            // certificateUrl
            if let certificateUrl = fairplayData[SD_PROP_CERTIFICATE_URL] as? String {
                sanitisedFairplayData[SD_PROP_CERTIFICATE_URL] = certificateUrl
            }
            // convert certificate into certificateUrl with marker prefix (also supported by THEOplayer Web SDK)
            if let certificate = fairplayData[SD_PROP_CERTIFICATE] as? String {
                sanitisedFairplayData[SD_PROP_CERTIFICATE_URL] = "\(CERTIFICATE_MARKER)\(certificate)"
            }
            // licenseAcquisitionURL
            if let licenseAcquisitionURL = fairplayData[SD_PROP_LICENSE_URL] as? String {
                sanitisedFairplayData[SD_PROP_LICENSE_URL] = licenseAcquisitionURL
            }
            // headers
            if let headers = fairplayData[SD_PROP_HEADERS] as? [String:String] {
                sanitisedFairplayData[SD_PROP_HEADERS] = headers
            }
            // licenseType
            if let licenseType = fairplayData[SD_PROP_LICENSE_TYPE] as? String {
                sanitisedFairplayData[SD_PROP_LICENSE_TYPE] = licenseType
            }
            sanitisedContentProtectionData[SD_PROP_FAIRPLAY] = sanitisedFairplayData
        }
        // widevine update
        if let widevineData = contentProtectionData[SD_PROP_WIDEVINE] as? [String:Any] {
            var sanitisedWidevineData: [String:Any] = [:]
            // certificateUrl
            if let certificateUrl = widevineData[SD_PROP_CERTIFICATE_URL] as? String {
                sanitisedWidevineData[SD_PROP_CERTIFICATE_URL] = certificateUrl
            }
            // convert certificate into certificateUrl with marker prefix (also supported by THEOplayer Web SDK)
            if let certificate = widevineData[SD_PROP_CERTIFICATE] as? String {
                sanitisedWidevineData[SD_PROP_CERTIFICATE_URL] = "\(CERTIFICATE_MARKER)\(certificate)"
            }
            // licenseAcquisitionURL
            if let licenseAcquisitionURL = widevineData[SD_PROP_LICENSE_URL] as? String {
                sanitisedWidevineData[SD_PROP_LICENSE_URL] = licenseAcquisitionURL
            }
            // headers
            if let headers = widevineData[SD_PROP_HEADERS] as? [String:String] {
                sanitisedWidevineData[SD_PROP_HEADERS] = headers
            }
            // licenseType
            if let licenseType = widevineData[SD_PROP_LICENSE_TYPE] as? String {
                sanitisedWidevineData[SD_PROP_LICENSE_TYPE] = licenseType
            }
            sanitisedContentProtectionData[SD_PROP_WIDEVINE] = sanitisedWidevineData
        }
        return sanitisedContentProtectionData
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
                default: return try JSONDecoder().decode(MultiplatformDRMConfiguration.self, from: data)
                }
            } else {
                PrintUtils.printLog(logText: "[NATIVE] integration type not specified... trying default drm integration")
                return try JSONDecoder().decode(MultiplatformDRMConfiguration.self, from: data)
            }
        } catch {
            PrintUtils.printLog(logText: "[NATIVE] unsupported contentProtection data format")
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
        } else if format == "srt" {
            return THEOplayerSDK.TextTrackFormat.SRT
        } else {
            return THEOplayerSDK.TextTrackFormat.none
        }
    }
}
