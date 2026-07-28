import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { MediaControlAction, THEOplayer } from 'react-native-theoplayer';
import type { Source } from '../custom/Source';

export interface Playlist {
  /**
   * The list of sources in the playlist, filtered based on the `includeWithLicense` flag and platform support.
   */
  sources: Source[];

  /**
   * The currently selected source in the playlist.
   */
  currentSource: Source;

  /**
   * The index of the currently selected source in the playlist.
   */
  currentIndex: number;

  /**
   * Function to set the current source in the playlist by its index. It updates the THEOplayer source and the
   * current index state.
   */
  setSourceByIndex: (index: number | undefined) => void;
}

export interface PlaylistProviderProps {
  /**
   * The THEOplayer instance to control, or undefined while the player is not ready yet.
   */
  player: THEOplayer | undefined;

  /**
   * The list of sources to include in the playlist.
   */
  sources: Source[];

  /**
   * The index of the initially selected source in the playlist. If undefined, the first source is selected.
   */
  initialIndex?: number;

  /**
   * Whether to include sources that require a license in the playlist. Defaults to false.
   */
  includeWithLicense?: boolean;

  children: ReactNode;
}

const PlaylistContext = createContext<Playlist | undefined>(undefined);

/**
 * Owns the playlist for the app and shares it with the UI through the {@link usePlaylist} hook.
 *
 * The provider filters the given sources, applies the selected source to the player and installs media
 * control handlers so the playlist can be navigated using the media session API (e.g. lock screen
 * controls, bluetooth controls, etc.).
 *
 * Mount it once, high up in the tree: short-lived components such as menus would otherwise duplicate the
 * playlist state and remove the media control handlers again when they unmount.
 */
export const PlaylistProvider = ({ player, sources, initialIndex, includeWithLicense = false, children }: PlaylistProviderProps) => {
  const filteredSources = useMemo(
    () =>
      sources.filter((source) => {
        // Only keep sources that don't require a license or if the includeWithLicense flag is set.
        const filteredOutOnLicense = source.needsLicense && !includeWithLicense;
        // Only keep sources that are supported on the current platform.
        const filteredOutOnPlatform = source.os.indexOf(Platform.OS) < 0;
        return !filteredOutOnLicense && !filteredOutOnPlatform;
      }),
    [sources, includeWithLicense],
  );
  // Determine the initially selected index against the filtered list. Prefer matching the player's
  // current source, since an index into the unfiltered list would diverge once sources are filtered
  // out (by platform or license). Fall back to the provided initialIndex, then to the first source.
  const matchedIndex = player ? filteredSources.findIndex((source) => source.source === player.source) : -1;
  const initialValidIndex =
    matchedIndex >= 0 ? matchedIndex : initialIndex !== undefined && initialIndex >= 0 && initialIndex < filteredSources.length ? initialIndex : 0;
  const [currentIndex, setCurrentIndex] = useState<number>(initialValidIndex);
  const currentSource = filteredSources[currentIndex];

  // Apply the selected source to a player that doesn't have one yet.
  useEffect(() => {
    if (!player || player.source !== undefined) return;
    // eslint-disable-next-line react-hooks/immutability
    player.source = currentSource?.source;
  }, [player, currentSource]);

  useEffect(() => {
    if (!player) return;

    const handleNext = () => {
      setCurrentIndex((index) => {
        const newIndex = (index + 1) % filteredSources.length;
        player.source = filteredSources[newIndex].source;
        return newIndex;
      });
    };

    const handlePrevious = () => {
      setCurrentIndex((index) => {
        const newIndex = (index - 1 + filteredSources.length) % filteredSources.length;
        player.source = filteredSources[newIndex].source;
        return newIndex;
      });
    };

    // Install handlers for media control actions to enable playlist navigation using the media session API (e.g. lock
    // screen controls, bluetooth controls, etc.)
    player.mediaControl?.setHandler(MediaControlAction.SKIP_TO_NEXT, handleNext);
    player.mediaControl?.setHandler(MediaControlAction.SKIP_TO_PREVIOUS, handlePrevious);

    // Remove the handlers again, restoring the player's default behaviour.
    return () => {
      player.mediaControl?.setHandler(MediaControlAction.SKIP_TO_NEXT, undefined);
      player.mediaControl?.setHandler(MediaControlAction.SKIP_TO_PREVIOUS, undefined);
    };
  }, [player, filteredSources]);

  const setSourceByIndex = (index: number | undefined) => {
    if (index !== undefined && index >= 0 && index < filteredSources.length) {
      if (!player) return;
      // eslint-disable-next-line react-hooks/immutability
      player.source = filteredSources[index].source;
      setCurrentIndex(index);
    }
  };

  const playlist: Playlist = {
    sources: filteredSources,
    currentSource,
    currentIndex,
    setSourceByIndex,
  };

  return <PlaylistContext.Provider value={playlist}>{children}</PlaylistContext.Provider>;
};

/**
 * Provides access to the playlist owned by the closest {@link PlaylistProvider}.
 */
export const usePlaylist = (): Playlist => {
  const playlist = useContext(PlaylistContext);
  if (playlist === undefined) {
    throw new Error('usePlaylist must be used inside a PlaylistProvider');
  }
  return playlist;
};
