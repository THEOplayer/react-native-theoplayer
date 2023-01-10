import { MenuItem } from './modalmenu/MenuItem';
import { MenuButton } from './menubutton/MenuButton';
import React, { PureComponent } from 'react';
import type { Source } from '../../utils/source/Source';
import type { THEOplayerInternal } from 'react-native-theoplayer';
import { Platform } from 'react-native';
import ALL_SOURCES from '../../res/sources.json';
import { PlayerContext } from '../util/Context';
import { ListSvg } from '../button/svg/ListSvg';

export interface SourceMenuState {
  sources: Source[];
  selectedSourceIndex: number;
}

const SOURCES = ALL_SOURCES.filter((source) => source.os.indexOf(Platform.OS) >= 0);

export class SourceMenu extends PureComponent<unknown, SourceMenuState> {
  private static initialState: SourceMenuState = {
    sources: SOURCES as Source[],
    selectedSourceIndex: 0,
  };

  constructor(props: unknown) {
    super(props);
    this.state = SourceMenu.initialState;
  }

  componentDidMount() {
    const { sources, selectedSourceIndex } = this.state;
    const player = this.context as THEOplayerInternal;
    player.source = sources[selectedSourceIndex].source;
  }

  private onSelectSource = (selectedSourceIndex: number) => {
    const { sources } = this.state;
    const player = this.context as THEOplayerInternal;
    player.source = sources[selectedSourceIndex].source;
    this.setState({ selectedSourceIndex });
  };

  render() {
    const { sources, selectedSourceIndex } = this.state;
    if (!(sources && sources.length > 0)) {
      return <></>;
    }

    return (
      <MenuButton
        title={'Source'}
        svg={<ListSvg />}
        data={sources.map((source) => new MenuItem(source.name))}
        onItemSelected={this.onSelectSource}
        selectedItem={selectedSourceIndex}
        keyExtractor={(index: number) => `src${index}`}
      />
    );
  }
}

SourceMenu.contextType = PlayerContext;
