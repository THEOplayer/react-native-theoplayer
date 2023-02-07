export interface AnimationController {
  showing_: boolean;

  requestShowUi(): void;

  requestShowUiWithLock_(): number;

  releaseLock_(id: number): void;
}
