/**
 * Describes the metadata of a source.
 *
 * @category Source
 * @public
 */
export interface MetadataDescription {
  [metadataKey: string]: any;

  /**
   * The title of the content.
   */
  readonly title?: string;
}
