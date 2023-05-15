//
//  Printing.swift
//  THEOliveSDK
//
//  Created by William van Haevre on 21/06/2021.
//

import Foundation

class PrintUtils {
    static func printLog(logText: String) {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss.SSS"
        print(formatter.string(from: Date()), logText)
    }
}
