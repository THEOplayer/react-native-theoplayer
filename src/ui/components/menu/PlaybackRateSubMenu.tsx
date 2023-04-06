import React, { useContext, useState } from 'react';
import { PlayerContext } from '../util/PlayerContext';
import { MenuView } from './common/MenuView';
import { ScrollableMenu } from './common/ScrollableMenu';
import { MenuRadioButton } from './common/MenuRadioButton';
import { SubMenuWithButton } from './common/SubMenuWithButton';
import type { StyleProp, ViewStyle } from 'react-native';

export interface PlaybackRateValue {
  /**
   * The playbackRate value.
   */
  readonly value: number;
  /**
   * The label of the playbackRate value.
   */
  readonly label: string;
}

/**
 * The default playback rate values for the menu.
 */
export const DEFAULT_PLAYBACK_RATE_MENU_VALUES: PlaybackRateValue[] = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 1, label: 'Normal' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
];

interface PlaybackRateSubMenuProps {
  /**
   * Overrides for the default playbackRate values.
   */
  values?: PlaybackRateValue[];
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;
}

/**
 * A button component that opens a playbackRate selection menu for the `react-native-theoplayer` UI.
 */
export const PlaybackRateSubMenu = (props: PlaybackRateSubMenuProps) => {
  const { values, menuStyle } = props;
  const selectedValues: PlaybackRateValue[] = values ?? DEFAULT_PLAYBACK_RATE_MENU_VALUES;
  const player = useContext(PlayerContext).player;

  const createMenu = () => {
    return <PlaybackSelectionView values={selectedValues} menuStyle={menuStyle} />;
  };
  const preview = selectedValues.find((value) => value.value === player.playbackRate)?.label ?? player.playbackRate.toString() + 'x';

  return <SubMenuWithButton menuConstructor={createMenu} label={'Speed'} preview={preview} />;
};

interface PlaybackSelectionViewProps {
  menuStyle?: StyleProp<ViewStyle>;
  values: PlaybackRateValue[];
}

export const PlaybackSelectionView = (props: PlaybackSelectionViewProps) => {
  const { values, menuStyle } = props;
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
      style={menuStyle}
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
