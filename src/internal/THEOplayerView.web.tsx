import React, { PureComponent } from 'react';
import type { THEOplayerViewProps } from 'react-native-theoplayer';
import * as THEOplayer from 'theoplayer';
import { THEOplayerWebAdapter } from './adapter/THEOplayerWebAdapter';
import uuid from 'react-native-uuid';

export class THEOplayerView extends PureComponent<THEOplayerViewProps> {
  private _facade: THEOplayerWebAdapter | undefined;
  private _player: THEOplayer.ChromelessPlayer | null = null;
  private readonly _containerId: string;

  constructor(props: THEOplayerViewProps) {
    super(props);
    this._facade = undefined;
    this._containerId = `theoplayer-container-${uuid.v4().toString()}`;
  }

  componentDidMount() {
    const { config, onPlayerReady } = this.props;
    const container = document.querySelector(`#${this._containerId}`) as HTMLElement;
    if (config?.chromeless === true || config?.chromeless === undefined) {
      this._player = new THEOplayer.ChromelessPlayer(container, config);
    } else {
      this._player = new THEOplayer.Player(container, {
        ...config,
        ui: {
          fluid: true,
        },
      });
    }

    this._player.prepareWithUserAction();
    this._facade = new THEOplayerWebAdapter(this._player);
    onPlayerReady?.(this._facade);
  }

  componentWillUnmount() {
    if (this._player) {
      this._player.destroy();
      this._facade?.destroy();
    }
  }

  public render(): JSX.Element {
    const { config } = this.props;
    const chromeless = config?.chromeless === undefined || config?.chromeless === true;
    return <div id={this._containerId} className={chromeless ? 'theoplayer-container' : 'theoplayer-container video-js theoplayer-skin'} />;
  }
}
