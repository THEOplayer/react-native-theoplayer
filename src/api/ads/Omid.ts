import { NodeHandle } from 'react-native';

/**
 * The list of reasons for which an obstruction would be registered as friendly.
 *
 * @category Ads
 * @public
 */
export enum OmidFriendlyObstructionPurpose {
  /**
   * The video overlay is one of the video player's control button.
   */
  VIDEO_CONTROLS = 'videoControls',

  /**
   * The video overlay is for the purpose of closing the advertisement.
   */
  CLOSE_AD = 'closeAd',

  /**
   * The video overlay is transparent and will not affect viewability.
   */
  NOT_VISIBLE = 'notVisible',

  /**
   * The video overlay is meant for other purposes.
   */
  OTHER = 'other',
}

/**
 * Represents a friendly obstruction instance for OMID.
 *
 * @category Ads
 * @public
 */
export interface OmidFriendlyObstruction {
  /**
   * The View of the friendly obstruction.
   *
   * Use `React.findNodeHandle(component)` to get a component's native handle.
   */
  viewNodeHandle: NodeHandle | null;

  /**
   * The {@link OmidFriendlyObstructionPurpose} of the friendly obstruction.
   */
  purpose: OmidFriendlyObstructionPurpose;

  /**
   * The optional reason for the friendly obstruction.
   */
  reason?: string;
}

/**
 * The Omid API, which can be used to add as well as remove friendly video controls overlay obstructions.
 *
 * @category Ads
 * @public
 */
export interface Omid {

  /**
   * Adds an {@link OmidFriendlyObstruction}.
   *
   * @param obstruction
   */
  addFriendlyObstruction(obstruction: OmidFriendlyObstruction): void;

  /**
   * Removes all {@link OmidFriendlyObstruction}s.
   */
  removeAllFriendlyObstructions(): void;
}
