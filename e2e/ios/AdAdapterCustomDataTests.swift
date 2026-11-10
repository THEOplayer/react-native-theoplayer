import XCTest
import THEOplayerSDK
@testable import react_native_theoplayer

final class AdAdapterCustomDataTests: XCTestCase {
    private let metadata: [String: Any] = [
        "campaign": "example",
        "nested": ["enabled": true],
        "values": [1.5, NSNull(), 2],
        "optional": NSNull()
    ]

    func testAdCustomDataRoundTrips() throws {
        let ad = try XCTUnwrap(THEOplayerRCTAdAdapter.toAd(adData: [
            "type": "linear", "integration": "custom", "customData": metadata
        ]))
        XCTAssertEqual(ad.customData as NSDictionary?, metadata as NSDictionary)
        let payload = THEOplayerRCTAdAdapter.fromAd(ad: ad)
        XCTAssertEqual(payload["customData"] as? NSDictionary, metadata as NSDictionary)
        XCTAssertTrue(JSONSerialization.isValidJSONObject(payload))
    }

    func testAdBreakCustomDataRoundTrips() {
        let adBreak = THEOplayerRCTAdAdapter.toAdBreak(adBreakData: [
            "integration": "custom", "customData": metadata
        ])
        XCTAssertEqual(adBreak.customData as NSDictionary?, metadata as NSDictionary)
        let payload = THEOplayerRCTAdAdapter.fromAdBreak(adBreak: adBreak)
        XCTAssertEqual(payload["customData"] as? NSDictionary, metadata as NSDictionary)
        XCTAssertTrue(JSONSerialization.isValidJSONObject(payload))
    }

    func testNestedAdsKeepIndependentCustomDataWithoutRecursiveAdBreaks() throws {
        let adBreak = THEOplayerRCTAdAdapter.toAdBreak(adBreakData: [
            "integration": "custom",
            "customData": ["break": "metadata"],
            "ads": [["type": "linear", "integration": "custom", "customData": metadata]]
        ])
        let payload = THEOplayerRCTAdAdapter.fromAdBreak(adBreak: adBreak)
        let ads = try XCTUnwrap(payload["ads"] as? [[String: Any]])
        XCTAssertEqual(payload["customData"] as? NSDictionary, ["break": "metadata"])
        XCTAssertEqual(ads.first?["customData"] as? NSDictionary, metadata as NSDictionary)
        XCTAssertNil(ads.first?["adBreak"])
    }

    func testBroadcastAdAndAdBreakEventsExposeCustomDataToNativeListeners() throws {
        let payload: [String: Any] = ["type": "linear", "integration": "custom", "customData": metadata]
        let adEvent = try XCTUnwrap(THEOplayerRCTAdEventAdapter.toAdEvent(eventData: [
            "subType": "adbegin", "ad": payload
        ]) as? AdBeginEvent)
        let breakEvent = try XCTUnwrap(THEOplayerRCTAdEventAdapter.toAdEvent(eventData: [
            "subType": "adbreakbegin", "ad": payload
        ]) as? AdBreakBeginEvent)
        XCTAssertEqual(adEvent.ad?.customData as NSDictionary?, metadata as NSDictionary)
        XCTAssertEqual(breakEvent.ad?.customData as NSDictionary?, metadata as NSDictionary)
    }

    func testMissingNullAndEmptyCustomData() throws {
        for payload: [String: Any] in [[:], ["customData": NSNull()]] {
            let ad = try XCTUnwrap(THEOplayerRCTAdAdapter.toAd(adData: payload))
            let adBreak = THEOplayerRCTAdAdapter.toAdBreak(adBreakData: payload)
            XCTAssertNil(ad.customData)
            XCTAssertNil(adBreak.customData)
            XCTAssertNil(THEOplayerRCTAdAdapter.fromAd(ad: ad)["customData"])
            XCTAssertNil(THEOplayerRCTAdAdapter.fromAdBreak(adBreak: adBreak)["customData"])
        }
        let payload: [String: Any] = ["customData": [String: Any]()]
        let ad = try XCTUnwrap(THEOplayerRCTAdAdapter.toAd(adData: payload))
        let adBreak = THEOplayerRCTAdAdapter.toAdBreak(adBreakData: payload)
        XCTAssertEqual(ad.customData as NSDictionary?, NSDictionary())
        XCTAssertEqual(adBreak.customData as NSDictionary?, NSDictionary())
    }
}
