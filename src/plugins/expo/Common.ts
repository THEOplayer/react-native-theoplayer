export type Extension = 'ima' | 'dai' | 'cast' | 'theoads' | 'millicast' | 'sideloaded-texttracks';

export interface THEOplayerPluginAndroidProps {
  extensions?: Extension[];
}

export interface THEOplayerPluginIOSProps {
  extensions?: Extension[];
}

export interface THEOplayerPluginProps {
  // Top-level extensions
  extensions?: Extension[];

  // Per-platform extensions, specific for Android
  android?: THEOplayerPluginAndroidProps;

  // Per-platform extensions, specific for iOS
  ios?: THEOplayerPluginIOSProps;
}
