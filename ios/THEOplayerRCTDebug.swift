// THEOplayerRCTDebug.swift

// General debug flag, if set to false none of the debug prints will appear
let DEBUG = false

// Debug flag to monitor incoming Theoplayer events
let DEBUG_THEOPLAYER_EVENTS = DEBUG && false

// Debug flag to monitor eventhandler setup and breakdown
let DEBUG_EVENTHANDLER = DEBUG && false

// Debug flag to monitor the interactions for each view with its underlying theoplayer instance
let DEBUG_THEOPLAYER_INTERACTION = DEBUG && false

// Debug flag to monitor contentProtection integration handling
let DEBUG_CONTENT_PROTECTION_API = DEBUG && false

// Debug flag to monitor all updates made  on bridged properties
let DEBUG_VIEW = DEBUG && false

// Debug flag to monitor correct SourceDescription buildup
let DEBUG_SOURCE_DESCRIPTION_BUIDER = DEBUG && false

// Debug flag to monitor ads API usage
let DEBUG_ADS_API = DEBUG && false

// Debug flag to monitor cast API usage
let DEBUG_CAST_API = DEBUG && false

// Debug flag to monitor player API usage
let DEBUG_PLAYER_API = DEBUG && false

// Debug flag to monitor Now Playing Info updates
let DEBUG_NOWINFO = DEBUG && false
