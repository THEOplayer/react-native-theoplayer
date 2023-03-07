import type { ReactNode } from 'react';

export type MenuContructor = () => ReactNode;

export interface UiControls {
  /*
   * Whether the UI buttons are enabled.
   */
  readonly buttonsEnabled_: boolean;

  /*
   * Used to notify the UI that a user pressed did an action, so the UI can be faded in.
   */
  onUserAction_: () => void;

  /*
   * Sets the user as "active" and does not allow the UI to be faded out.
   */
  setUserActive_: () => number;

  /*
   * Sets the user as "idle" and allows the UI to fade out again.
   */
  setUserIdle_: (id: number) => void;

  /*
   * Opens a new menu on top of the player.
   */
  openMenu_: (menuConstructor: MenuContructor) => void;

  /*
   * Closes the current menu. If this was a sub-menu, the parent menu will re-open.
   */
  closeCurrentMenu_: () => void;
}
