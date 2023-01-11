import { Modal, Platform, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewProps, ViewStyle } from 'react-native';
import React from 'react';
import { PlayerStyleContext, VideoPlayerStyle } from '../../style/VideoPlayerStyle';

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
        <PlayerStyleContext.Consumer>
          {(styleContext: VideoPlayerStyle) => (
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
                  style={styleContext.containerModalMenu}
                  onPress={() => {
                    if (onRequestClose) {
                      onRequestClose();
                    }
                  }}>
                  <View style={[styleContext.modal, style]}>
                    {title && <Text style={[styleContext.title, titleStyle, { color: 'black', backgroundColor: '#ffc50f' }]}>{title}</Text>}
                    <View style={styleContext.rowContainer}>{children}</View>
                  </View>
                </TouchableOpacity>
              )}

              {Platform.isTV && (
                <View style={styleContext.containerModalMenu}>
                  <View style={[styleContext.modal, style]}>
                    {title && <Text style={[styleContext.title, titleStyle, { color: 'black', backgroundColor: '#ffc50f' }]}>{title}</Text>}
                    <View style={styleContext.rowContainer}>{children}</View>
                  </View>
                </View>
              )}
            </Modal>
          )}
        </PlayerStyleContext.Consumer>
      )}
    </>
  );
};
