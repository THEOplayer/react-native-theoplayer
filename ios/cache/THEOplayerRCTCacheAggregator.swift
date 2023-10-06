// THEOplayerRCTContentProtectionAggregator.swift

import Foundation
import THEOplayerSDK

let CACHETASK_PROP_ID: String = "id"
let CACHETASK_PROP_STATUS: String = "status"
let CACHETASK_PROP_SOURCE: String = "source"
let CACHETASK_PROP_PARAMETERS: String = "parameters"
let CACHETASK_PROP_DURATION: String = "duration"
let CACHETASK_PROP_CACHED: String = "cached"
let CACHETASK_PROP_SECONDS_CACHED: String = "secondsCached"
let CACHETASK_PROP_PERCENTAGE_CACHED: String = "percentageCached"
let CACHETASK_PROP_BYTES: String = "bytes"
let CACHETASK_PROP_BYTES_CACHED: String = "bytesCached"
let CACHETASK_PROP_PARAMETERS_AMOUNT: String = "amount"
let CACHETASK_PROP_PARAMETERS_BANDWIDTH: String = "bandwidth"
let CACHETASK_PROP_PARAMETERS_EXPIRATION_DATE: String = "expirationDate"
let CACHETASK_PROP_TIMERANGE_START: String = "start"
let CACHETASK_PROP_TIMERANGE_END: String = "end"
let CACHETASK_PROP_PARAMETERS_CELLULAR: String = "allowsCellularAccess"
let CACHETASK_PROP_PARAMETERS_TRACK_SELECTION: String = "preferredTrackSelection"
let CACHETASK_PROP_PARAMETERS_AUDIO_TRACK_SELECTION: String = "audioTrackSelection"
let CACHETASK_PROP_PARAMETERS_TEXT_TRACK_SELECTION: String = "textTrackSelection"

let CACHE_AGGREGATOR_TAG: String = "[CacheAggregator]"

class THEOplayerRCTCacheAggregator {
    
    class func aggregateCacheTasks(tasks: [CachingTask]) -> [[String:Any]] {
        var aggregatedData: [[String:Any]] = []
        tasks.forEach { task in
            aggregatedData.append(THEOplayerRCTCacheAggregator.aggregateCacheTask(task: task))
        }
        return aggregatedData
    }
    
    class func aggregateCacheTask(task: CachingTask) -> [String:Any] {
        var aggregatedData: [String:Any] = [:]
        aggregatedData[CACHETASK_PROP_ID] = task.id
        aggregatedData[CACHETASK_PROP_STATUS] = THEOplayerRCTTypeUtils.cachingTaskStatusToString(task.status)
        aggregatedData[CACHETASK_PROP_PARAMETERS] = THEOplayerRCTCacheAggregator.aggregateCacheTaskParameters(params: task.parameters)
        aggregatedData[CACHETASK_PROP_SOURCE] = THEOplayerRCTSourceDescriptionAggregator.aggregateCacheTaskSourceDescription(sourceDescription: task.source)
        for (key, value) in THEOplayerRCTCacheAggregator.aggregateCacheTaskProgress(task: task) {
            aggregatedData[key] = value
        }
        return aggregatedData
    }
                                                     
    class func aggregateCacheTaskProgress(task: CachingTask) -> [String:Any] {
        var aggregatedData: [String:Any] = [:]
        aggregatedData[CACHETASK_PROP_DURATION] = task.duration // in sec
        aggregatedData[CACHETASK_PROP_CACHED] = THEOplayerRCTCacheAggregator.aggregateCachedTimeRanges(ranges: task.cached)
        aggregatedData[CACHETASK_PROP_SECONDS_CACHED] = task.secondsCached
        aggregatedData[CACHETASK_PROP_PERCENTAGE_CACHED] = task.percentageCached
        aggregatedData[CACHETASK_PROP_BYTES] = -1 // default setting, as iOS does not provide estimate yet.
        aggregatedData[CACHETASK_PROP_BYTES_CACHED] = task.bytesCached
        return aggregatedData
        
    }
    
    private class func aggregateCacheTaskParameters(params: CachingParameters) -> [String:Any] {
        var aggregatedData: [String:Any] = [:]
        aggregatedData[CACHETASK_PROP_PARAMETERS_AMOUNT] = "100%"
        if let bandwidthValue = params.bandwidth {
            aggregatedData[CACHETASK_PROP_PARAMETERS_BANDWIDTH] = bandwidthValue
        }
        aggregatedData[CACHETASK_PROP_PARAMETERS_EXPIRATION_DATE] = params.expirationDate.timeIntervalSince1970 * 1000 // sec -> msec
        aggregatedData[CACHETASK_PROP_PARAMETERS_CELLULAR] = params.allowsCellularAccess
        aggregatedData[CACHETASK_PROP_PARAMETERS_TRACK_SELECTION] = [
            CACHETASK_PROP_PARAMETERS_AUDIO_TRACK_SELECTION : params.preferredTrackSelection.audioTrackSelection,
            CACHETASK_PROP_PARAMETERS_TEXT_TRACK_SELECTION: params.preferredTrackSelection.textTrackSelection
        ]
        return aggregatedData
    }
    
    private class func aggregateCachedTimeRanges(ranges: [TimeRange]) -> [[String:Any]] {
        var aggregatedData: [[String:Any]] = []
        for timeRange in ranges {
            aggregatedData.append([
                CACHETASK_PROP_TIMERANGE_START : timeRange.start * 1000, // sec -> msec
                CACHETASK_PROP_TIMERANGE_END : timeRange.end * 1000 // sec -> msec
            ])
        }
        return aggregatedData
    }
}
