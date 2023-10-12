// THEOplayerRCTSourceDescriptionBuilder.swift

import Foundation
import THEOplayerSDK
import UIKit

#if os(iOS)
class THEOplayerRCTSourceDescriptionAggregator {
    class func aggregateCacheTaskSourceDescription(sourceDescription: SourceDescription) -> [String:Any]? {
        do {
            let jsonEncoder = JSONEncoder()
            let data = try jsonEncoder.encode(sourceDescription)
            if let result = try? JSONSerialization.jsonObject(with: data, options: []) as? [String:Any] {
                return THEOplayerRCTSourceDescriptionAggregator.sanitiseSourceDescriptionMetadata(input: result)
            }
        } catch {
            if DEBUG { PrintUtils.printLog(logText: "[NATIVE] Could not aggregate sourceDescription for caching task: \(error.localizedDescription)")}
            return nil
        }
        return nil
    }
    
    private class func sanitiseSourceDescriptionMetadata(input: [String:Any]) -> [String:Any] {
        var output: [String:Any] = input
        if let metadata = output[SD_PROP_METADATA] as? [String:Any],
           let metadataKeys = metadata[SD_PROP_METADATAKEYS] as? [String:Any] {
            var newMetadata: [String:Any] = [:]
            // keep all but lower level metadataKeys
            for (key, value) in metadata {
                if (key != SD_PROP_METADATAKEYS) {
                    newMetadata[key] = value
                }
            }
            // now add metadataKeys at metadata level
            for (key, value) in metadataKeys {
                newMetadata[key] = value
            }
            output[SD_PROP_METADATA] = newMetadata
        }
        return output
    }
}
#endif
