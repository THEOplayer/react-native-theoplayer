import type { Event } from 'react-native-theoplayer';

export class BaseEvent<TType extends string = string> implements Event<TType> {
  constructor(readonly type: TType, readonly date: Date = new Date()) {}
}
