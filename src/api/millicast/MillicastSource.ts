import { MillicastConnectOptions, TypedSource } from 'react-native-theoplayer';

/**
 * Represents a source for a {@link https://dolby.io/products/real-time-streaming/ | Millicast} live stream.
 *
 * @category Source
 * @category Millicast
 * @public
 */
export interface MillicastSource extends TypedSource {
  /**
   * The content type.
   *
   * Must be `"millicast"`.
   */
  type: 'millicast';

  /**
   * The name of the Millicast stream to subscribe to.
   *
   * @see https://millicast.github.io/millicast-sdk/global.html#DirectorSubscriberOptions
   */
  src: string;

  /**
   * The Millicast account identifier.
   *
   * @see https://millicast.github.io/millicast-sdk/global.html#DirectorSubscriberOptions
   */
  streamAccountId: string;

  /**
   * Token to subscribe to secure streams.
   *
   * - If you are subscribing to an unsecure stream, you can omit this param.
   *
   * @see https://millicast.github.io/millicast-sdk/global.html#DirectorSubscriberOptions
   */
  subscriberToken?: string;

  /**
   * An optional configuration object to set additional subscriber options.
   *
   * - The available options are listed in the link below.
   *
   * @see https://millicast.github.io/millicast-sdk/View.html#connect
   */
  connectOptions?: MillicastConnectOptions;

  /**
   * The URL of the API endpoint that the SDK communicates with for authentication.
   *
   * @see https://millicast.github.io/millicast-sdk/module-Director.html#~setEndpoint
   */
  apiUrl?: string;
}
