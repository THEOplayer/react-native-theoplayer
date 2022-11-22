/**
 * The Google DAI API.
 *
 * @public
 */
export interface GoogleDAI {
  /**
   * Returns the content time without ads for a given stream time. Returns the given stream time for live streams.
   *
   * @param time - The stream time with inserted ads (in seconds).
   */
  contentTimeForStreamTime(time: number): Promise<number>;

  /**
   * Returns the stream time with ads for a given content time. Returns the given content time for live streams.
   *
   * @param time - The content time without any ads (in seconds).
   */
  streamTimeForContentTime(time: number): Promise<number>;

  /**
   * Whether snapback is enabled. When enabled and the user seeks over multiple ad breaks, the last ad break that was seeked past will be played.
   *
   * @defaultValue `true`
   */
  readonly snapback: Promise<boolean>;

  /**
   * Set snapback value. When enabled and the user seeks over multiple ad breaks, the last ad break that was seeked past will be played.
   */
  setSnapback(enabled: boolean): void;
}
