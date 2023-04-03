import type { ReactNode } from 'react';

/**
 * A callback function to render a menu when needed.
 */
export type MenuConstructor = () => ReactNode;

/**
 * The API provided to all UI components in `react-native-theoplayer` so they can communicate with the UI.
 */
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
   * Opens a new menu on top of the player.
   */
  openMenu_: (menuConstructor: MenuConstructor) => void;

  /*
   * Closes the current menu. If this was a sub-menu, the parent menu will re-open.
   */
  closeCurrentMenu_: () => void;
}
