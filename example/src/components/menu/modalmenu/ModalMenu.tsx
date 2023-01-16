import { Modal, Platform, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewProps, ViewStyle } from 'react-native';
import React from 'react';
import { PlayerContext, PlayerWithStyle } from '../../util/Context';

export interface ModalMenuProps extends ViewProps {
  title?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onRequestClose?: () => void;
  visible?: boolean;
}

export const ModalMenu = (props: ModalMenuProps) => {
  const { visible, style, children, title, titleStyle, onRequestClose } = props;

  return (
    <>
      {visible && (
        <PlayerContext.Consumer>
          {(context: PlayerWithStyle) => (
            <Modal
              animationType="fade"
              supportedOrientations={['portrait', 'landscape']}
              transparent={true}
              visible={visible}
              onRequestClose={() => {
                if (onRequestClose) {
                  onRequestClose();
                }
              }}>
              {!Platform.isTV && (
                <TouchableOpacity
                  style={context.style.modalMenu.containerModalMenu}
                  onPress={() => {
                    if (onRequestClose) {
                      onRequestClose();
                    }
                  }}>
                  <View style={[context.style.modalMenu.modal, style]}>
                    {title && (
                      <Text style={[context.style.modalMenu.title, titleStyle, { color: 'black', backgroundColor: '#ffc50f' }]}>{title}</Text>
                    )}
                    <View style={context.style.modalMenu.rowContainer}>{children}</View>
                  </View>
                </TouchableOpacity>
              )}

              {Platform.isTV && (
                <View style={context.style.modalMenu.containerModalMenu}>
                  <View style={[context.style.modalMenu.modal, style]}>
                    {title && (
                      <Text style={[context.style.modalMenu.title, titleStyle, { color: 'black', backgroundColor: '#ffc50f' }]}>{title}</Text>
                    )}
                    <View style={context.style.modalMenu.rowContainer}>{children}</View>
                  </View>
                </View>
              )}
            </Modal>
          )}
        </PlayerContext.Consumer>
      )}
    </>
  );
};
