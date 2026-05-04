import React, { useContext } from 'react';
import { ListSvg, MenuButton, MenuRadioButton, MenuView, PlayerContext, ScrollableMenu } from '@theoplayer/react-native-ui';
import type { Source } from './Source';
import { usePlaylist } from '../hooks/usePlaylist';

export interface SourceMenuButtonProps {
  sources: Source[];

  includeWithLicense?: boolean | undefined;
}

export const SourceMenuButton = (props: SourceMenuButtonProps) => {
  const createMenu = () => {
    return <SourceMenuView sources={props.sources} includeWithLicense />;
  };
  return <MenuButton svg={<ListSvg />} menuConstructor={createMenu} />;
};

export const SourceMenuView = ({ sources, includeWithLicense }: { sources: Source[]; includeWithLicense: boolean | undefined }) => {
  const { player, ui } = useContext(PlayerContext);
  const initialIndex = sources.findIndex((source) => source.source === player?.source);
  const { sources: filteredSources, currentIndex, setSourceByIndex } = usePlaylist(player, sources, initialIndex, includeWithLicense);

  const selectSource = (id: number | undefined) => {
    setSourceByIndex(id);
    ui.closeCurrentMenu_();
  };
  return (
    <MenuView
      menu={
        <ScrollableMenu
          title={'Source'}
          items={filteredSources.map((source, id) => (
            <MenuRadioButton key={id} label={source.name} uid={id} onSelect={selectSource} selected={id === currentIndex}></MenuRadioButton>
          ))}
        />
      }
    />
  );
};
