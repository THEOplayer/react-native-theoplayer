import type { EdgeStyle, TextTrackStyle, THEOplayerView } from 'react-native-theoplayer';

export class TextTrackStyleAdapter implements TextTrackStyle {
  // @ts-ignore
  constructor(private readonly _player: THEOplayerView) {}

  get backgroundColor(): string | undefined {
    // NYI
    return undefined;
  }

  set backgroundColor(_: string | undefined) {
    // NYI
  }

  get edgeStyle(): EdgeStyle | undefined {
    return undefined;
  }

  set edgeStyle(_: EdgeStyle | undefined) {
    // NYI
  }

  get fontColor(): string | undefined {
    return undefined;
  }

  set fontColor(_: string | undefined) {
    // NYI
  }

  get fontFamily(): string | undefined {
    return undefined;
  }

  set fontFamily(_: string | undefined) {
    // NYI
  }

  get fontSize(): string | undefined {
    return undefined;
  }

  set fontSize(_: string | undefined) {
    // NYI
  }

  get windowColor(): string | undefined {
    return undefined;
  }

  set windowColor(_: string | undefined) {
    // NYI
  }
}
