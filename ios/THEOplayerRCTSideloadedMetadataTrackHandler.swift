// THEOplayerRCTMetadataAggregator.swift

import Foundation
import THEOplayerSDK

struct Cue {
    var startTime: Int64
    var endTime: Int64
    var cueContent: String
}

class THEOplayerRCTSideloadedMetadataTrackHandler {
    
    class func parseVtt(_ urlString: String, completion: @escaping ([Cue]?) -> Void) {
            guard let url = URL(string: urlString) else {
                completion(nil)
                return
            }
            
            let task = URLSession.shared.dataTask(with: url) { (data, response, error) in
                guard let data = data, error == nil else {
                    completion(nil)
                    return
                }
                
                if let vttString = String(data: data, encoding: .utf8) {
                    let cues = THEOplayerRCTSideloadedMetadataTrackHandler.parseVTTString(vttString)
                    completion(cues)
                } else {
                    completion(nil)
                }
            }
            
            task.resume()
        }

    private class func parseVTTString(_ vttString: String) -> [Cue] {
            var cues: [Cue] = []
            var currentCue: Cue?
            
        let separator = THEOplayerRCTSideloadedMetadataTrackHandler.separatorSequence(vttString)
        let lines = vttString.components(separatedBy: separator)
        for line in lines {
            if line.isEmpty {                                               // process unprocessed cue to list
                if let cue = currentCue {
                    cues.append(cue)
                    currentCue = nil
                }
            } else if currentCue == nil {
                let timeComponents = line.components(separatedBy: " --> ")  // start new cue with timestamps
                if timeComponents.count == 2 {
                    currentCue = Cue(startTime: Self.parseTimeToMsecs(timeComponents[0]) ?? 0,
                                     endTime: Self.parseTimeToMsecs(timeComponents[1]) ?? 0,
                                     cueContent: "")
                }
            } else {
                // Append to the content
                if currentCue!.cueContent.isEmpty {
                    currentCue!.cueContent = "\(line)"                      // set cue content
                } else {
                    currentCue!.cueContent += "\(separator)\(line)"         // append cue content
                }
            }
        }
        
        return cues
    }
    
    private class func separatorSequence(_ dataString: String) -> String {
        return dataString.contains("\r\n") ? "\r\n" : "\n"
    }
    
    private class func parseTimeToMsecs(_ timeString: String) -> Int64? {
        var tString = timeString
        let formatter = DateFormatter()
        formatter.dateFormat = "mm:ss.SSS"
        if formatter.date(from: timeString) != nil {
            tString = "00:\(tString)"
        }
        formatter.dateFormat = "HH:mm:ss.SSS"
        if formatter.date(from: tString) != nil {
            return Self.totalMilliSeconds(fromTimeIntervalString: tString)
        }
        return nil
    }
    
    private class func totalMilliSeconds(fromTimeIntervalString timeIntervalString: String) -> Int64? {
        let mainComponents = timeIntervalString.components(separatedBy: ".")
        // Ensure we have msecs
        guard mainComponents.count == 2 else {
            return nil
        }
        
        let components = mainComponents[0].components(separatedBy: ":")
        
        // Ensure we have at least minutes, seconds, and hours
        guard components.count == 3 else {
            return nil
        }
        
        // Parse hours, minutes, and seconds
        if let hours = Int64(components[0]), let minutes = Int64(components[1]), let seconds = Int64(components[2]) {
            let totalSeconds = hours * 3600 + minutes * 60 + seconds
            
            // If there are milliseconds, add them
            if let milliseconds = Int64(mainComponents[1]) {
                return (totalSeconds * 1000) + milliseconds
            }
        }
        
        return nil
    }
}
