import React from 'react';
import { Text, View } from 'react-native';
import type { PlayerError } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { SvgContext } from '../button/svg/SvgUtils';
import { ErrorSvg } from '../button/svg/ErrorSvg';
import { FULLSCREEN_CENTER_STYLE } from '../uicontroller/UiContainer';

export interface ErrorDisplayProps {
  /**
   * The error that will be displayed.
   */
  error: PlayerError;
}

/**
 * A fullscreen error component for the `react-native-theoplayer` UI.
 */
export function ErrorDisplay(props: ErrorDisplayProps) {
  const { error } = props;
  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <View style={[FULLSCREEN_CENTER_STYLE, { backgroundColor: context.style.colors.errorBackground }]}>
          <View style={{ flexDirection: 'row' }}>
            <SvgContext.Provider
              value={{
                fill: context.style.colors.icon,
                height: '100%',
                width: '100%',
              }}>
              <View style={{ height: context.style.dimensions.controlBarHeight, aspectRatio: 1, padding: 5 }}>
                <ErrorSvg />
              </View>
            </SvgContext.Provider>
            <Text style={[context.style.text, { color: context.style.colors.text, alignSelf: 'center', paddingLeft: 5 }]}>Error:</Text>
          </View>
          <Text style={[context.style.text, { color: context.style.colors.text }]}>{error.errorMessage}</Text>
        </View>
      )}
    </PlayerContext.Consumer>
  );
}
