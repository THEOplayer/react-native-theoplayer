//
//  THEOplayerRCTSafeMap.swift
//  Theoplayer
//

import Foundation

class THEOplayerRCTSafeMap<K: Hashable,V>: Collection {
    private var unsafeMap: [K: V]
    private let concurrentQueue = DispatchQueue(label: "Safe Queue", attributes: .concurrent)
    
    var startIndex: Dictionary<K, V>.Index {
        self.concurrentQueue.sync {
            return self.unsafeMap.startIndex
        }
    }
    
    var endIndex: Dictionary<K, V>.Index {
        self.concurrentQueue.sync {
            return self.unsafeMap.endIndex
        }
    }
    
    init(dict: [K: V] = [K: V]()) {
        self.unsafeMap = dict
    }
    
    func index(after i: Dictionary<K, V>.Index) -> Dictionary<K, V>.Index {
        self.concurrentQueue.sync {
            return self.unsafeMap.index(after: i)
        }
    }
    
    subscript(key: K) -> V? {
        set(newValue) {
            self.concurrentQueue.sync(flags: .barrier) {[weak self] in
                self?.unsafeMap[key] = newValue
            }
        }
        get {
            self.concurrentQueue.sync {
                return self.unsafeMap[key]
            }
        }
    }
    
    subscript(index: Dictionary<K, V>.Index) -> Dictionary<K, V>.Element {
        self.concurrentQueue.sync {
            return self.unsafeMap[index]
        }
    }
    
    func removeValue(forKey key: K) -> V? {
        self.concurrentQueue.sync(flags: .barrier) {[weak self] in
            return self?.unsafeMap.removeValue(forKey: key)
        }
    }
    
    func removeAll() {
        self.concurrentQueue.sync(flags: .barrier) {[weak self] in
            self?.unsafeMap.removeAll()
        }
    }
}
