import type { VerizonMediaExternalId } from 'react-native-theoplayer';
import { hasOwnProperty, isString } from '../../../internal/utils/TypeUtils';

export function isVerizonMediaExternalId(id: unknown): id is VerizonMediaExternalId {
  if (hasOwnProperty.call(id, 'externalId') && hasOwnProperty.call(id, 'userId')) {
    return isString((id as VerizonMediaExternalId).userId);
  }
  return false;
}
