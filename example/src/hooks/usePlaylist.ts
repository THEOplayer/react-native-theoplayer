import type { Source } from '../custom/Source';
import { useEffect, useMemo, useState } from 'react';
import { MediaControlAction, THEOplayer } from 'react-native-theoplayer';
import { Platform } from 'react-native';

export interface PlaylistResult {
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

/**
 * Custom hook to manage a playlist of sources for THEOplayer.
 * It filters the provided sources based on the `includeWithLicense` flag and sets up handlers for media control
 * actions to enable playlist navigation using the media session API (e.g. lock screen controls, bluetooth controls, etc.).
 *
 * @param player The THEOplayer instance to control.
 * @param sources The list of sources to include in the playlist.
 * @param initialIndex The index of the initially selected source in the playlist. If undefined, the first source will be selected by default.
 * @param includeWithLicense Whether to include sources that require a license in the playlist. Defaults to false.
 * @return An array containing the current source and the list of filtered sources in the playlist.
 */
export const usePlaylist = (
  player: THEOplayer | undefined,
  sources: Source[],
  initialIndex: number | undefined = undefined,
  includeWithLicense: boolean = false,
): PlaylistResult => {
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
  const initialValidIndex = initialIndex !== undefined && initialIndex < filteredSources.length ? initialIndex : 0;
  const [currentIndex, setCurrentIndex] = useState<number>(initialValidIndex);

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
  }, [player, filteredSources]);

  const setSourceByIndex = (index: number | undefined) => {
    if (index !== undefined && index >= 0 && index < filteredSources.length) {
      if (!player) return;
      // eslint-disable-next-line react-hooks/immutability
      player.source = filteredSources[index].source;
      setCurrentIndex(index);
    }
  };

  return {
    sources: filteredSources,
    currentSource: filteredSources[currentIndex],
    currentIndex,
    setSourceByIndex,
  };
};
