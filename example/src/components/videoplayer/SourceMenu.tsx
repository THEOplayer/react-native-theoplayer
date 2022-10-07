import { ListIcon } from '../../res/images';
import { MenuItem } from '../modalmenu/MenuItem';
import { MenuButton } from '../menubutton/MenuButton';
import React from 'react';
import type { Source } from '../../utils/source/Source';

export interface SourceMenuProps {
  sources: Source[];
  selectedSourceIndex: number;
  onSelectSource?: (index: number) => void;
}

export function SourceMenu(props: SourceMenuProps) {
  const { sources, selectedSourceIndex } = props;
  if (!(sources && sources.length > 0)) {
    return <></>;
  }

  const selectSource = (index: number) => {
    const { onSelectSource } = props;
    if (onSelectSource) {
      onSelectSource(index);
    }
  };

  return (
    <MenuButton
      title={'Source'}
      icon={ListIcon}
      data={sources.map((source) => new MenuItem(source.name))}
      onItemSelected={selectSource}
      selectedItem={selectedSourceIndex}
      keyExtractor={(index: number) => `src${index}`}
    />
  );
}
