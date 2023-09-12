//
//  Printing.swift
//  THEOliveSDK
//
import Foundation

class PrintUtils {
    static func printLog(logText: String) {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss.SSS"
        print(formatter.string(from: Date()), logText)
    }
}
