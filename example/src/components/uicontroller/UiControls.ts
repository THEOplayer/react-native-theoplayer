import type { ReactNode } from 'react';

export interface UiControls {
  readonly buttonsEnabled_: boolean;

  onUserAction_: () => void;

  setUserActive_: () => number;

  setUserIdle_: (id: number) => void;

  /**
   * Sets the current menu overlay on the UI, and returns the previous menu in case you need to go back.
   */
  setMenu_: (menu: ReactNode | undefined) => ReactNode | undefined;
}
