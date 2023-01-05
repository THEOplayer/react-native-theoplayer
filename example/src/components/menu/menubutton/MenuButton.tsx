import type { ImageSourcePropType, ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import React, { useState } from 'react';
import { ActionButton } from '../../button/actionbutton/ActionButton';
import { ModalMenu } from '../modalmenu/ModalMenu';
import { MenuRow } from '../modalmenu/MenuRow';
import type { MenuItem } from '../modalmenu/MenuItem';
import { controlBarStyle } from '../../controlbar/ControlBar';

export interface MenuButtonProps {
  title: string;
  icon: ImageSourcePropType;
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
  const { icon, title, data, keyExtractor, onItemSelected, selectedItem, modalStyle, modalTitleStyle, style, minimumItems } = props;
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Don't show the menu if it has less items than the preset minimum.
  if (!data || data.length < minimumItems) {
    return <></>;
  }

  return (
    <>
      <ActionButton
        icon={icon}
        iconStyle={controlBarStyle.menuIcon}
        onPress={() => {
          setModalVisible(true);
        }}
        style={style}
        touchable={true}
      />

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
