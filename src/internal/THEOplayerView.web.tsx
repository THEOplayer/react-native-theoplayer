import React, { useEffect, useRef } from 'react';
import type { THEOplayerViewProps } from 'react-native-theoplayer';
import { ChromelessPlayer } from 'theoplayer';
import { THEOplayerWebAdapter } from './adapter/THEOplayerWebAdapter';

export function THEOplayerView(props: React.PropsWithChildren<THEOplayerViewProps>) {
  const { config, children } = props;
  const player = useRef<ChromelessPlayer | null>(null);
  const adapter = useRef<THEOplayerWebAdapter | null>(null);
  const container = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // Create player inside container.
    if (container.current) {
      const ads = {
        ...config?.ads,
        googleIma: {
          ...config?.ads?.ima,
          useNativeIma: true,
          language: config?.ui?.language ?? 'en',
        },
      };
      const updatedConfig = {
        ...config,
        allowNativeFullscreen: true,
        ads,
      };
      player.current = new ChromelessPlayer(container.current, updatedConfig);

      // Adapt native player to react-native player.
      adapter.current = new THEOplayerWebAdapter(player.current, config);

      // Expose players for easy access
      // @ts-ignore
      window.player = adapter.current;

      // @ts-ignore
      window.nativePlayer = player;

      // Notify the player is ready
      props.onPlayerReady?.(adapter.current);
    }

    // Clean-up
    return () => {
      // Notify the player will be destroyed.
      const { onPlayerDestroy } = props;
      if (adapter?.current && onPlayerDestroy) {
        onPlayerDestroy(adapter?.current);
      }
      adapter?.current?.destroy();
    };
  }, [container]);

  if (!CSS.supports('aspect-ratio', '16/9')) {
    return (
      <div id={'theoplayer-root-container'} style={{ display: 'contents' }}>
        <div style={{ width: '100%', position: 'relative', paddingTop: '56.25%' }}>
          <div ref={container} style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%' }} />
        </div>
        {children}
      </div>
    );
  }

  return (
    // Note: display: contents causes an element's children to appear as if they were direct children of the element's parent,
    // ignoring the element itself.
    // It's necessary to make sure we do not interfere with the IMA container
    <div id={'theoplayer-root-container'} style={{ display: 'contents' }}>
      <div ref={container} style={styles.container} className={'theoplayer-container'} />
      {children}
    </div>
  );
}

const styles = {
  // by default stretch the video to cover the container.
  // Override using the 'theoplayer-container' class.
  container: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: '100%',
    maxHeight: '100vh',
    maxWidth: '100vw',
    aspectRatio: '16 / 9',
  } as React.CSSProperties,
};
