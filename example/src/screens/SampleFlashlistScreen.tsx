import * as React from 'react';
import { THEOplayer } from 'react-native-theoplayer';
import { SOURCES } from '../custom/SourceMenuButton';
import { Source } from '../custom/Source';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useContext } from 'react';
import { PlayerOverlay, PlayListData, VideoPlayer } from './Flashlist';
import { FlashList, ViewToken } from '@shopify/flash-list';

const LOG_TAG = '[EXAMPLE - FLASHLIST SAMPLE]';
const LIST_WIDTH = Math.min(Dimensions.get('screen').width, 400.0);
const LIST_HEIGHT = Dimensions.get('screen').height * 0.85;

function generateMockPlaylist(n: number): PlayListData[] {
  const entries = new Array(n);
  const flashlistSources: Source[] = (SOURCES as Source[]).filter((source) => source.name.startsWith('HLS - VOD - CLEAR'));
  for (let i = 0; i < n; i++) {
    const source: Source = flashlistSources[i % flashlistSources.length];
    entries[i] = {
      index: i,
      name: source.name,
      bookmark: 0,
      source: source.source,
      playerId: -1,
      playerRef: undefined,
      viewable: false,
    };
  }
  return entries;
}

const DataContext = React.createContext<{ items: PlayListData[] }>({
  items: generateMockPlaylist(50),
});

export const SampleFlashlistScreen = () => {
  const store = useContext(DataContext);

  const itemHeight = () => {
    const reelMode = false;
    return reelMode ? LIST_HEIGHT : (LIST_WIDTH * 9.0) / 16.0;
  };

  // Given type and data, return the view component.
  // Do not add key prop to the output of rowRenderer. Adding it will stop recycling and cause random mounts/unmounts.
  const rowRenderer = React.useCallback((props: { item: PlayListData }) => {
    return (
      <View style={{ height: itemHeight(), width: LIST_WIDTH, borderWidth: 1, borderColor: '#333' }}>
        <VideoPlayer
          source={props.item.source}
          onPlayerReady={(player: THEOplayer | undefined, playerId: number) => {
            props.item.playerRef = player;
            props.item.playerId = playerId;
            console.log(LOG_TAG, 'List item', props.item.index, 'is now using player', playerId);
            if (props.item.viewable && props.item.playerRef != undefined) {
              props.item.playerRef.play();
            }
          }}
        />

        <PlayerOverlay data={props.item} />
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
            console.log(LOG_TAG, 'List item', currentData.index, 'is now viewable and should play.');
            // apply bookmark
            // currentData.player.currentTime = currentData.bookmark
            currentData.playerRef.play();
          }
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
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      ]}>
      <View
        style={{
          width: LIST_WIDTH,
          height: LIST_HEIGHT,
        }}>
        <FlashList
          // A plain array of items of a given type.
          data={store.items}
          // Takes an item from data and renders it into the list.
          renderItem={rowRenderer}
          snapToInterval={itemHeight()}
          decelerationRate={'fast'}
          disableIntervalMomentum={false}
          // A single numeric value that hints FlashList about the approximate size of the items before they're rendered.
          estimatedItemSize={itemHeight()}
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
          drawDistance={1.5 * itemHeight()}
        />
      </View>
    </View>
  );
};
