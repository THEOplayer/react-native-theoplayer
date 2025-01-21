//
//  THEORCTAdsModule+Omid.swift
//

extension THEORCTAdsModule {
    
    @objc(addFriendlyObstruction:obstruction:)
    func addFriendlyObstruction(_ node: NSNumber, obstruction: NSDictionary) {
        DispatchQueue.main.async {
            if let obstructionNode = obstruction[PROP_OMID_VIEW] as? NSNumber,
               let obstructionView = self.view(for: obstructionNode) {
                self.adsAPI.addFriendlyObstruction(self.view(for: node), obstructionView: obstructionView, obstruction: obstruction)
            }
        }
    }
    
    @objc(removeAllFriendlyObstructions:)
    func removeAllFriendlyObstructions(_ node: NSNumber) {
        DispatchQueue.main.async {
            self.adsAPI.removeAllFriendlyObstructions(self.view(for: node))
        }
    }
}
