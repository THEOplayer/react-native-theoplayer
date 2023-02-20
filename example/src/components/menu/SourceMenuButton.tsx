import React, { useContext, useState } from 'react';
import type { Source } from '../../utils/source/Source';
import { Platform } from 'react-native';
import ALL_SOURCES from '../../res/sources.json';
import { PlayerContext } from '../util/PlayerContext';
import { ListSvg } from '../button/svg/ListSvg';
import { MenuButton } from './menuview/MenuButton';
import { MenuRadioButton } from './menuview/MenuRadioButton';
import { ScrollableMenu } from './menuview/ScrollableMenu';

const SOURCES = ALL_SOURCES.filter((source) => source.os.indexOf(Platform.OS) >= 0) as Source[];

export const SourceMenuButton = () => {
  const context = useContext(PlayerContext);
  const [selectedSourceId, setSelectedSourceId] = useState<number | undefined>(undefined);

  const onSelectSource = (id: number) => {
    context.player.source = SOURCES[id].source;
    setSelectedSourceId(id);
    context.ui.setMenu_(undefined);
  };

  if (!(SOURCES && SOURCES.length > 0)) {
    return <></>;
  }

  return (
    <MenuButton
      svg={<ListSvg />}
      menu={
        <ScrollableMenu
          title={'Select a source:'}
          items={SOURCES.map((source, id) => (
            <MenuRadioButton key={id} label={source.name} id={id} onSelect={onSelectSource} selected={id === selectedSourceId}></MenuRadioButton>
          ))}
        />
      }
    />
  );
};
