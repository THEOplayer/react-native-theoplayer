import * as React from 'react';
import { THEOplayer } from 'react-native-theoplayer';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useContext } from 'react';
import { generateMockPlaylist, PlayerOverlay, PlayListData, VideoPlayer } from './Flashlist';
import { FlashList, ViewToken } from '@shopify/flash-list';
import { RootStackParamList } from '../navigators/SamplesStackNavigator';
import { StackScreenProps } from '@react-navigation/stack';

const LOG_TAG = '[EXAMPLE - FLASHLIST SAMPLE]';
const LIST_WIDTH = Math.min(Dimensions.get('screen').width, 400.0);
const LIST_HEIGHT = Dimensions.get('screen').height * 0.85;

const DataContext = React.createContext<{ items: PlayListData[] }>({
  items: generateMockPlaylist(50),
});

type SampleFlashlistScreenProps = StackScreenProps<RootStackParamList, 'SampleFlashlist'>;
export const SampleFlashlistScreen = ({ route }: SampleFlashlistScreenProps) => {
  const store = useContext(DataContext);
  const { reelMode } = route.params;
  const rowWidth = LIST_WIDTH;
  const rowHeight = reelMode ? LIST_HEIGHT : (rowWidth * 9.0) / 16.0;

  const rowRenderer = React.useCallback((row: { item: PlayListData }) => {
    return (
      <View style={{ height: rowHeight, width: rowWidth, borderWidth: 1, borderColor: '#333' }}>
        <VideoPlayer
          source={row.item.source}
          onPlayerReady={(player: THEOplayer | undefined, playerId: number) => {
            row.item.playerRef = player;
            row.item.playerId = playerId;
            console.log(LOG_TAG, 'List item', row.item.index, 'is now using player', playerId);
            if (row.item.viewable && row.item.playerRef != undefined) {
              row.item.playerRef.play();
            }
          }}
        />
        <PlayerOverlay data={row.item} />
      </View>
    );
  }, []);

  const onViewableItemsChanged = React.useCallback((info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
    // Update viewable items.
    info.viewableItems.forEach((token) => {
      if (token.index != null) {
        const currentData = store.items[token.index];
        currentData.viewable = true;
      }
    });
    // Play/pause based on viewable state.
    info.changed.forEach((token) => {
      if (token.index != null) {
        const currentData = store.items[token.index];
        if (currentData.playerRef !== undefined) {
          if (!token.isViewable) {
            console.log(LOG_TAG, 'List item', currentData.index, 'is no longer viewable and should pause.');
            currentData.playerRef.pause();
            // store bookmark
            //currentData.bookmark = currentData.player.currentTime;
          } else {
            console.log(LOG_TAG, 'List item', currentData.index, 'became viewable and should play.');
            // apply bookmark
            // currentData.player.currentTime = currentData.bookmark
            currentData.playerRef.play();
          }
        } else {
          console.log(LOG_TAG, 'List item', currentData.index, 'has no playerRef.');
        }
      }
    });
  }, []);

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <View
        style={{
          width: LIST_WIDTH,
          height: LIST_HEIGHT,
          borderWidth: 2,
          borderColor: 'grey',
        }}>
        <FlashList
          // A plain array of items of a given type.
          data={store.items}
          // Takes an item from data and renders it into the list.
          renderItem={rowRenderer}
          snapToInterval={rowHeight}
          decelerationRate={'fast'}
          disableIntervalMomentum={false}
          // A single numeric value that hints FlashList about the approximate size of the items before they're rendered.
          estimatedItemSize={rowHeight}
          // Called when the viewability of rows changes.
          onViewableItemsChanged={onViewableItemsChanged}
          // Configuration for determining whether items are viewable.
          viewabilityConfig={{
            // Minimum amount of time (in milliseconds) that an item must be physically viewable before the viewability callback will be fired.
            minimumViewTime: 750,
            // Nothing is considered viewable until the user scrolls or recordInteraction is called after render.
            waitForInteraction: false,
            // Percent of the item that must be visible for a partially occluded item to count as "viewable", 0-100.
            itemVisiblePercentThreshold: 25,
          }}
          // Draw distance for advanced rendering (in dp/px).
          // Platform default: 250
          drawDistance={0.5 * rowHeight}
        />
      </View>
    </View>
  );
};
