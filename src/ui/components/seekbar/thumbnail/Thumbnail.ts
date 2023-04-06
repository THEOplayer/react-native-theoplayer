export function isTileMapThumbnail(thumbnail: Thumbnail): thumbnail is TileMapThumbnail {
  return thumbnail.tileX !== undefined && thumbnail.tileY !== undefined && thumbnail.tileWidth !== undefined && thumbnail.tileHeight !== undefined;
}

export function isImageThumbnail(thumbnail: Thumbnail): thumbnail is ImageThumbnail {
  return !isTileMapThumbnail(thumbnail);
}

/**
 * Description of a thumbnail, which can be either a full image or part of a tile map.
 */
export interface Thumbnail {
  /**
   * The url of the thumbnail image.
   */
  url: string;

  /**
   * Horizontal offset within the tile map in case the thumbnail is part of tile map.
   */
  tileX?: number;

  /**
   * Vertical offset within the tile map in case the thumbnail is part of tile map.
   */
  tileY?: number;

  /**
   * Width of a tile in case the thumbnail is part of tile map.
   */
  tileWidth?: number;

  /**
   * Height of a tile in case the thumbnail is part of tile map.
   */
  tileHeight?: number;
}

/**
 * Description of a tile-map thumbnail.
 */
export interface TileMapThumbnail extends Thumbnail {
  /**
   * The url of the thumbnail image.
   */
  url: string;

  /**
   * Horizontal offset within the tile map in case the thumbnail is part of tile map.
   */
  tileX: number;

  /**
   * Vertical offset within the tile map in case the thumbnail is part of tile map.
   */
  tileY: number;

  /**
   * Width of a tile in case the thumbnail is part of tile map.
   */
  tileWidth: number;

  /**
   * Height of a tile in case the thumbnail is part of tile map.
   */
  tileHeight: number;
}

/**
 * Description of a tile-map thumbnail.
 */
export type ImageThumbnail = Thumbnail;
