import React, { useContext, useState } from 'react';
import type { Source } from '../../utils/source/Source';
import { Platform } from 'react-native';
import ALL_SOURCES from '../../res/sources.json';
import { PlayerContext } from '../util/PlayerContext';
import { ListSvg } from '../button/svg/ListSvg';
import { MenuButton } from './common/MenuButton';
import { MenuRadioButton } from './common/MenuRadioButton';
import { ScrollableMenu } from './common/ScrollableMenu';
import { MenuView } from './common/MenuView';

export const SOURCES = ALL_SOURCES.filter((source) => source.os.indexOf(Platform.OS) >= 0) as Source[];

export const SourceMenuButton = () => {
  if (!(SOURCES && SOURCES.length > 0)) {
    return <></>;
  }
  const createMenu = () => {
    return <SourceMenuView />;
  };
  return <MenuButton svg={<ListSvg />} menuConstructor={createMenu} />;
};

export const SourceMenuView = () => {
  const context = useContext(PlayerContext);
  const selectedSource = SOURCES.find((source) => source.source === context.player.source);
  const [localSourceId, setLocalSourceId] = useState<number | undefined>(selectedSource ? SOURCES.indexOf(selectedSource) : undefined);

  const selectSource = (id: number) => {
    setLocalSourceId(id);
    const newSource = SOURCES[id];
    context.player.source = newSource.source;
  };
  return (
    <MenuView
      menu={
        <ScrollableMenu
          title={'Source'}
          items={SOURCES.map((source, id) => (
            <MenuRadioButton key={id} label={source.name} id={id} onSelect={selectSource} selected={id === localSourceId}></MenuRadioButton>
          ))}
        />
      }
    />
  );
};
