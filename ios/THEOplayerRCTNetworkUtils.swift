//
//  THEOplayerRCTNetworkUtils.swift
//  Theoplayer
//
//  Created by William van Haevre on 14/11/2022.
//

import Foundation

class THEOplayerRCTNetworkUtils: NSObject, URLSessionDataDelegate {
    // singleton setup
    static let shared = THEOplayerRCTNetworkUtils()
    
    private var defaultUrlSession: URLSession!
    private var defaultOperationQueue = OperationQueue()
    
    private override init() {
        super.init()
        let defaultConfig: URLSessionConfiguration = URLSessionConfiguration.default
        defaultConfig.networkServiceType = NSURLRequest.NetworkServiceType.default
        self.defaultOperationQueue.maxConcurrentOperationCount = 16
        self.defaultOperationQueue.qualityOfService = .userInteractive
        self.defaultUrlSession = URLSession(configuration: defaultConfig, delegate: nil, delegateQueue: self.defaultOperationQueue)
    }
    
    func requestFromUrl(url: URL, method: String, body: Data?, headers: [String:String], completion:((Data?, Int, [String:String], Error?) -> Void)?) {
        var request = URLRequest(url: url)
        request.httpMethod = method
        for (key, value) in headers {
            request.addValue(value, forHTTPHeaderField: key)
        }
        request.httpBody = body
        let task = self.defaultUrlSession.dataTask(with: request) { data, response, error in
            if let error = error {
                PrintUtils.printLog(logText: "request Error: \(error.localizedDescription)")
                return
            }
            if let urlResponse = response as? HTTPURLResponse {
                let statusCode = urlResponse.statusCode
                let responseHeaders = urlResponse.allHeaderFields
                var allHeaders: [String:String] = [:]
                for (key, value) in responseHeaders {
                    if let headerKey = key as? String,
                       let headerValue = value as? String {
                        allHeaders[headerKey] = headerValue
                    }
                }
                completion?(data, statusCode, allHeaders, error)
            }
        }
        // start the task
        task.resume()
    }
}
