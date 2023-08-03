import type {
  CachingTaskParameters,
} from 'react-native-theoplayer';
import type { CachingPreferredTrackSelection } from "../../api/cache/CachingPreferredTrackSelection";

export interface NativeCachingTaskParameters {
  readonly amount: number | string;
  readonly expirationDate: number | undefined;
  readonly bandwidth: number | undefined;
  readonly preferredTrackSelection: CachingPreferredTrackSelection | undefined;
  readonly allowsCellularAccess: boolean | undefined;
}

export function fromNativeCachingTaskParameters(parameters: NativeCachingTaskParameters): CachingTaskParameters {
  return {
    amount: parameters.amount,
    expirationDate: parameters?.expirationDate? new Date(parameters?.expirationDate) : undefined,
    bandwidth: parameters.bandwidth,
    preferredTrackSelection: parameters.preferredTrackSelection,
    allowsCellularAccess: parameters.allowsCellularAccess
  }
}

export function toNativeCachingTaskParameters(parameters: CachingTaskParameters): NativeCachingTaskParameters {
  return {
    amount: parameters.amount,
    expirationDate: parameters?.expirationDate?.getTime(),
    bandwidth: parameters.bandwidth,
    preferredTrackSelection: parameters.preferredTrackSelection,
    allowsCellularAccess: parameters.allowsCellularAccess
  }
}
