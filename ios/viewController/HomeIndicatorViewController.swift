// HomeIndicatorViewController.swift

import UIKit

@objc
public class HomeIndicatorViewController: UIViewController {
  public var prefersAutoHidden = false
  
#if !os(tvOS)
  public override var prefersHomeIndicatorAutoHidden: Bool {
    get {
      return self.prefersAutoHidden
    }
  }
#endif
}
