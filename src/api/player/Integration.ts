export interface Integration {
  getCurrentTime?(): number | null | undefined;
  setCurrentTime?(currentTime: number): boolean;
  play?(): boolean;
  pause?(): boolean;
  isPaused?(): boolean | null | undefined;
  getDuration?(): number | null | undefined;
}
