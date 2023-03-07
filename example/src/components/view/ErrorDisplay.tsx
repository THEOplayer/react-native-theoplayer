import React from 'react';
import { Text, View } from 'react-native';
import type { PlayerError } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { SvgContext } from '../button/svg/SvgUtils';
import { ErrorSvg } from '../button/svg/ErrorSvg';

interface ErrorDisplayProps {
  error: PlayerError;
}

export function ErrorDisplay(props: ErrorDisplayProps) {
  const { error } = props;
  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <View style={[context.style.fullScreenCenter, { backgroundColor: context.style.colors.secondary }]}>
          <View style={{ flexDirection: 'row' }}>
            <SvgContext.Provider
              value={{
                fill: context.style.colors.primary,
                height: '100%',
                width: '100%',
              }}>
              <View style={[context.style.controlBar.buttonIcon]}>
                <ErrorSvg />
              </View>
            </SvgContext.Provider>
            <Text style={[context.style.text, { color: context.style.colors.text, alignSelf: 'center', paddingLeft: 5 }]}>Error:</Text>
          </View>
          <Text style={[context.style.text, { color: context.style.colors.text, backgroundColor: context.style.colors.secondary }]}>
            {error.errorMessage}
          </Text>
        </View>
      )}
    </PlayerContext.Consumer>
  );
}
