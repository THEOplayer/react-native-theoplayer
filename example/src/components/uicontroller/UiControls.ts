import type { ReactNode } from 'react';

export type MenuContructor = () => ReactNode;

export interface UiControls {
  readonly buttonsEnabled_: boolean;

  onUserAction_: () => void;

  setUserActive_: () => number;

  setUserIdle_: (id: number) => void;

  openMenu_: (menuConstructor: MenuContructor) => void;

  closeCurrentMenu_: () => void;
}
