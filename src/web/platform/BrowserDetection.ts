declare global {
  interface Window {
    ActiveXObject?: any;
    DocumentTouch?: any;
  }
}
const userAgent = navigator ? navigator.userAgent : '';

class BrowserDetection {
  static readonly instance_: BrowserDetection = new BrowserDetection();

  private readonly _isWindowsPhone: boolean = /windows phone (8|8\.1)/i.test(userAgent);
  private readonly _isIphone: boolean = /iPhone/i.test(userAgent);
  private readonly _isIpad: boolean = /iPad/i.test(userAgent);
  private readonly _isIpod: boolean = /iPod/i.test(userAgent);
  private readonly _isMac: boolean = ( /(mac\sos\sx)\s?([\w\s.]+\w)*/i.test(userAgent)
    || /(macintosh|mac(?=_powerpc)\s)/i.test(userAgent) );
  private readonly _isTizen: boolean = /SMART-TV.*Tizen/i.test(userAgent);
  private readonly _isTouch: boolean = Boolean(( 'ontouchstart' in self )
    || ( self.DocumentTouch && document instanceof self.DocumentTouch )
    || ( navigator && navigator.msMaxTouchPoints ));
  private readonly _isIpadOs: boolean = this._isMac && this._isTouch && !this._isIpad;
  private readonly _isIos: boolean = ( this._isIphone || this._isIpad || this._isIpadOs || this._isIpod )
    && !this._isWindowsPhone;
  private readonly _isSafari: boolean = /Safari/i.test(userAgent)
    && !( /Chrome/i.test(userAgent) ) && !this._isWindowsPhone && !this._isTizen;


  get IS_IOS_(): boolean {
    return this._isIos;
  }

  get IS_SAFARI_(): boolean {
    return this._isSafari;
  }
}

export const browserDetection: BrowserDetection = BrowserDetection.instance_;
