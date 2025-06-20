/**
 * Describes the configuration of an analytics integration as part of the SourceDescription.
 *
 * @category Analytics
 * @category Source
 * @public
 */
export interface AnalyticsDescription {
  /**
   * The identifier of the analytics integration.
   */
  integration: string;

  /**
   * Analytics extensions can define any custom set of fields.
   */
  [key: string]: unknown;
}
