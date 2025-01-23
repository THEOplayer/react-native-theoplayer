//
//  THEOplayerRCTBroadcastEventHandler.swift
//

import Foundation
import THEOplayerSDK

let EVENT_PROP_TYPE: String = "type"

public class THEOplayerRCTBroadcastEventHandler: DefaultEventDispatcher {
    public func broadcastEvent(eventData: NSDictionary) {
        if let nativeEvent = self.toEvent(eventData: eventData) {
            self.dispatchEvent(event: nativeEvent)
        }
    }
    
    private func toEvent(eventData: NSDictionary) -> THEOplayerSDK.EventProtocol? {
        if let type = eventData[EVENT_PROP_TYPE] as? String {
            switch (type) {
            case "adevent": return THEOplayerRCTAdEventAdapter.toAdEvent(eventData: eventData)
            // more cases to be added on demand...
            default: return nil
            }
        }

        return nil
    }
}

public class DefaultEventDispatcher: NSObject, THEOplayerSDK.EventDispatcherProtocol {
    private var eventListeners = [String: [EventListenerWrapper]]()
    
    public func addEventListener<E>(type: THEOplayerSDK.EventType<E>, listener: @escaping (_ : E) -> ()) -> THEOplayerSDK.EventListener {
        let eventListener = DefaultEventListenerWrapper(target: self, listener: listener)
        if self.eventListeners[type.name] != nil {
            self.eventListeners[type.name]?.append(eventListener)
        } else {
            self.eventListeners[type.name] = [eventListener]
        }
        return eventListener
    }

    public func removeEventListener<E>(type: THEOplayerSDK.EventType<E>, listener: THEOplayerSDK.EventListener) {
        guard let eventListener = listener as? EventListenerWrapper else { return }
        self.eventListeners[type.name]?.removeAll { $0 === eventListener }
    }

    public func dispatchEvent(event: THEOplayerSDK.EventProtocol) {
        if let listeners = self.eventListeners[event.type] {
            for listener in listeners {
                listener.invoke(event: event)
            }
        }
    }

    public func removeEventListeners() {
        for listeners in self.eventListeners.values {
            for listener in listeners {
                listener.destroy()
            }
        }
        self.eventListeners = [:]
    }

    func contains<E>(type: THEOplayerSDK.EventType<E>, listener: THEOplayerSDK.EventListener) -> Bool {
        guard let listeners: [EventListenerWrapper] = self.eventListeners[type.name] else {
            return false
        }

        return listeners.first { $0 === listener } != nil
    }
}

class DefaultEventListenerWrapper<T: DefaultEventDispatcher, E: THEOplayerSDK.EventProtocol>: EventListenerWrapper, THEOplayerSDK.EventListener {
    weak private var target: T?
    var listener: ((T) -> (E) -> ())?

    init(target: T, listener: @escaping (E) -> ()) {
        self.target = target
        func wrappedListener(_:T) -> (E) -> () { return listener }
        self.listener = wrappedListener
    }

    func invoke(event: THEOplayerSDK.EventProtocol) {
        if let target = self.target {
            listener?(target)(event as! E)
        }
    }

    func destroy() {
        self.listener = nil
    }
}

protocol EventListenerWrapper: AnyObject {
    func invoke(event: THEOplayerSDK.EventProtocol)
    func destroy()
}

