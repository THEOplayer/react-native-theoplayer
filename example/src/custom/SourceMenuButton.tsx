import React, { useContext, useState } from 'react';
import { Platform } from 'react-native';
import { ListSvg, MenuButton, MenuRadioButton, MenuView, PlayerContext, ScrollableMenu } from '@theoplayer/react-native-ui';
import type { Source } from './Source';
import ALL_SOURCES from './sources.json';

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
  // @ts-ignore
  const context = useContext(PlayerContext);
  const selectedSource = SOURCES.find((source) => source.source === context.player.source);
  const [localSourceId, setLocalSourceId] = useState<number | undefined>(selectedSource ? SOURCES.indexOf(selectedSource) : undefined);

  const selectSource = (id: number | undefined) => {
    setLocalSourceId(id);
    context.player.source = id !== undefined ? SOURCES[id].source : undefined;
  };
  return (
    <MenuView
      menu={
        <ScrollableMenu
          title={'Source'}
          items={SOURCES.map((source, id) => (
            <MenuRadioButton key={id} label={source.name} uid={id} onSelect={selectSource} selected={id === localSourceId}></MenuRadioButton>
          ))}
        />
      }
    />
  );
};
