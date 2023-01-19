import React, { PureComponent } from 'react';

import type { THEOplayerViewProps } from 'react-native-theoplayer';
import * as THEOplayer from 'theoplayer';
import { THEOplayerWebAdapter } from './exposed/THEOplayerWebAdapter';

export class THEOplayerView extends PureComponent<THEOplayerViewProps> {
  private _facade: THEOplayerWebAdapter | undefined;
  private _player: THEOplayer.ChromelessPlayer | null = null;

  constructor(props: THEOplayerViewProps) {
    super(props);
    this._facade = undefined;
  }

  componentDidMount() {
    const { config, onPlayerReady } = this.props;
    const element = document.querySelector('.theoplayer-container') as HTMLElement;
    if (config?.chromeless === true || config?.chromeless === undefined) {
      this._player = new THEOplayer.ChromelessPlayer(element, {
        libraryLocation: 'node_modules/theoplayer',
        ...config,
      });
    } else {
      this._player = new THEOplayer.Player(element, {
        libraryLocation: 'node_modules/theoplayer',
        ...config,
        ui: {
          fluid: true,
        },
      });
    }

    // Object.assign(this._player.abr, abr); // TODO
    this._player.prepareWithUserAction();
    // this._player.source = source; // TODO
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

    return (
      <div id={'theoplayer-wrapper'}>
        <div className={chromeless ? 'theoplayer-container' : 'theoplayer-container video-js theoplayer-skin'} />
      </div>
    );
  }
}
