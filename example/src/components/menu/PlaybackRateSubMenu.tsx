import React, { useContext, useState } from 'react';
import { PlayerContext } from '../util/PlayerContext';
import { MenuView } from './common/MenuView';
import { ScrollableMenu } from './common/ScrollableMenu';
import { MenuRadioButton } from './common/MenuRadioButton';
import { SubMenuWithButton } from './common/SubMenuWithButton';

export interface PlaybackRateValue {
  readonly value: number;
  readonly label: string;
}

const DEFAULT_VALUES: PlaybackRateValue[] = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 1, label: 'Normal' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
];

interface PlaybackRateSubMenuProps {
  values?: PlaybackRateValue[];
}

export const PlaybackRateSubMenu = (props: PlaybackRateSubMenuProps) => {
  const values: PlaybackRateValue[] = props.values ?? DEFAULT_VALUES;
  const player = useContext(PlayerContext).player;

  const createMenu = () => {
    return <PlaybackSelectionView values={values} />;
  };
  const preview = values.find((value) => value.value === player.playbackRate)?.label ?? player.playbackRate.toString() + 'x';

  return <SubMenuWithButton menuConstructor={createMenu} label={'Speed'} preview={preview} />;
};

interface PlaybackSelectionViewProps {
  values: PlaybackRateValue[];
}

export const PlaybackSelectionView = (props: PlaybackSelectionViewProps) => {
  const { values } = props;
  const player = useContext(PlayerContext).player;
  const [selectedPlaybackRate, setSelectedPlaybackRate] = useState(player.playbackRate);
  const onChangePlaybackRate = (playbackRate: number | undefined) => {
    if (playbackRate) {
      player.playbackRate = playbackRate;
      setSelectedPlaybackRate(playbackRate);
    }
  };

  return (
    <MenuView
      menu={
        <ScrollableMenu
          title={'Playback Rate'}
          items={values.map((playbackRateValue, id) => (
            <MenuRadioButton
              key={id}
              label={playbackRateValue.label}
              uid={playbackRateValue.value}
              onSelect={onChangePlaybackRate}
              selected={selectedPlaybackRate === playbackRateValue.value}></MenuRadioButton>
          ))}
        />
      }
    />
  );
};
