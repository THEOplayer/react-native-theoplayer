import type { EdgeStyle, TextTrackStyle, THEOplayerView } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import NamedColors from './NamedColors.json';

const namedColorsMap = NamedColors as { [name: string]: string };

export class TextTrackStyleAdapter implements TextTrackStyle {
  private _backgroundColor: string | undefined = undefined;
  private _edgeStyle: EdgeStyle | undefined = undefined;
  private _fontColor: string | undefined = undefined;
  private _fontFamily: string | undefined = undefined;
  private _fontSize: string | undefined = undefined;
  private _windowColor: string | undefined = undefined;
  private _marginBottom: number | undefined = undefined;
  private _marginTop: number | undefined = undefined;
  private _marginLeft: number | undefined = undefined;
  private _marginRight: number | undefined = undefined;

  constructor(private readonly _view: THEOplayerView) {}

  get backgroundColor(): string | undefined {
    return this._backgroundColor;
  }

  set backgroundColor(color: string | undefined) {
    this._backgroundColor = color;
    NativeModules.PlayerModule.setTextTrackStyle(this._view.nativeHandle, {
      backgroundColor: convertColorToRGBA(color),
    });
  }

  get edgeStyle(): EdgeStyle | undefined {
    return this._edgeStyle;
  }

  set edgeStyle(style: EdgeStyle | undefined) {
    this._edgeStyle = style;
    NativeModules.PlayerModule.setTextTrackStyle(this._view.nativeHandle, {
      edgeStyle: style,
    });
  }

  get fontColor(): string | undefined {
    return this._fontColor;
  }

  set fontColor(color: string | undefined) {
    this._fontColor = color;
    NativeModules.PlayerModule.setTextTrackStyle(this._view.nativeHandle, {
      fontColor: convertColorToRGBA(color),
    });
  }

  get fontFamily(): string | undefined {
    return this._fontFamily;
  }

  set fontFamily(family: string | undefined) {
    this._fontFamily = family;
    NativeModules.PlayerModule.setTextTrackStyle(this._view.nativeHandle, {
      fontFamily: family,
    });
  }

  get fontSize(): string | undefined {
    return this._fontSize;
  }

  set fontSize(size: string | undefined) {
    this._fontSize = size;
    NativeModules.PlayerModule.setTextTrackStyle(this._view.nativeHandle, {
      fontSize: fromPercentage(size),
    });
  }

  get windowColor(): string | undefined {
    return this._windowColor;
  }

  set windowColor(color: string | undefined) {
    this._windowColor = color;
    NativeModules.PlayerModule.setTextTrackStyle(this._view.nativeHandle, {
      windowColor: convertColorToRGBA(color),
    });
  }

  get marginBottom(): number | undefined {
    return this._marginBottom;
  }

  set marginBottom(margin: number | undefined) {
    this._marginBottom = margin;
    NativeModules.PlayerModule.setTextTrackStyle(this._view.nativeHandle, {
      marginBottom: margin,
    });
  }

  get marginLeft(): number | undefined {
    return this._marginLeft;
  }

  set marginLeft(margin: number | undefined) {
    this._marginLeft = margin;
    NativeModules.PlayerModule.setTextTrackStyle(this._view.nativeHandle, {
      marginLeft: margin,
    });
  }

  get marginRight(): number | undefined {
    return this._marginRight;
  }

  set marginRight(margin: number | undefined) {
    this._marginRight = margin;
    NativeModules.PlayerModule.setTextTrackStyle(this._view.nativeHandle, {
      marginRight: margin,
    });
  }

  get marginTop(): number | undefined {
    return this._marginTop;
  }

  set marginTop(margin: number | undefined) {
    this._marginTop = margin;
    NativeModules.PlayerModule.setTextTrackStyle(this._view.nativeHandle, {
      marginTop: margin,
    });
  }
}

interface BridgeColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

function convertColorToRGBA(color: string | undefined): BridgeColor | null {
  if (!color) {
    return null;
  }

  color = color.replace('#', '');

  if (namedColorsMap[color.toLowerCase()]) {
    color = namedColorsMap[color.toLowerCase()];
  }

  const colorPattern = /^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
  const match = color.match(colorPattern);

  if (!match) {
    return null;
  }

  const r = parseInt(match[1], 16);
  const g = parseInt(match[2], 16);
  const b = parseInt(match[3], 16);
  const a = match[4] ? parseInt(match[4], 16) : 255;
  return { r, g, b, a };
}

function fromPercentage(pct: string | undefined): number {
  return pct ? parseFloat(pct) : 100;
}
