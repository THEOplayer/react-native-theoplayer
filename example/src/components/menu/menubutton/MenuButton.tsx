import type { ImageSourcePropType, ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import React, { ReactNode, useState } from 'react';
import { ActionButton } from '../../button/actionbutton/ActionButton';
import { ModalMenu } from '../modalmenu/ModalMenu';
import { MenuRow } from '../modalmenu/MenuRow';
import type { MenuItem } from '../modalmenu/MenuItem';
import { PlayerContext, UiContext } from '../../util/PlayerContext';

export interface MenuButtonProps {
  title: string;
  icon?: ImageSourcePropType;
  svg?: ReactNode;
  keyExtractor?: (index: number) => string;
  data: MenuItem[];
  minimumItems: number;
  selectedItem?: number;
  onItemSelected: (index: number) => void;
  iconStyle?: StyleProp<ImageStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  modalTitleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const MenuButton = (props: MenuButtonProps) => {
  const { icon, svg, title, data, keyExtractor, onItemSelected, selectedItem, modalStyle, modalTitleStyle, style, minimumItems } = props;
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Don't show the menu if it has less items than the preset minimum.
  if (!data || data.length < minimumItems) {
    return <></>;
  }

  return (
    <>
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <ActionButton
            svg={svg}
            icon={icon}
            iconStyle={context.style.controlBar.buttonIcon}
            onPress={() => {
              setModalVisible(true);
            }}
            style={style}
            touchable={true}
          />
        )}
      </PlayerContext.Consumer>

      {modalVisible && (
        <ModalMenu
          visible={modalVisible}
          style={modalStyle}
          titleStyle={modalTitleStyle}
          onRequestClose={() => {
            setModalVisible(false);
          }}
          title={title}>
          {data.map((item: MenuItem, index: number) => (
            <MenuRow
              key={keyExtractor ? keyExtractor(index) : ''}
              onSelected={() => {
                if (onItemSelected) {
                  onItemSelected(index);
                }
                setModalVisible(false);
              }}
              selected={selectedItem === index}
              data={item}
            />
          ))}
        </ModalMenu>
      )}
    </>
  );
};

MenuButton.defaultProps = {
  minimumItems: 1,
};
