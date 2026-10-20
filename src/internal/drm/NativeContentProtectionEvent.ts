export interface NativeContentProtectionEvent {
  requestId: string;
  integrationId: string;
  keySystemId: string;
  /**
   * Unique identifier of the native content protection integration instance that emitted the event.
   * Absent on events emitted by native builds predating per-instance routing.
   */
  integrationInstanceId?: string;
}
