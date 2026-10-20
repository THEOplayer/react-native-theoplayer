const theoplayerWebApi = 'https://www.theoplayer.com/docs/theoplayer/v10/api-reference/web';

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['src/index.tsx'],
  tsconfig: 'tsconfig.build.json',
  out: 'api',
  hostedBaseUrl: 'https://theoplayer.github.io/react-native-theoplayer/api/',
  name: 'React Native THEOplayer SDK',
  readme: 'none',
  plugin: ['typedoc-plugin-mdn-links', './lib/module/plugins/typedoc-platform-icons/src/index.js'],
  navigationLinks: {
    Docs: 'https://www.theoplayer.com/docs/',
    'THEOplayer.com': 'https://www.theoplayer.com/',
  },
  navigation: {
    includeCategories: true
  },
  githubPages: true,
  excludePrivate: true,
  excludeExternals: true,
  externalSymbolLinkMappings: {
    theoplayer: {
      CompanionAd: `${theoplayerWebApi}/interfaces/CompanionAd.html`,
      'TextTrackCue.track': `${theoplayerWebApi}/interfaces/TextTrackCue.html#track`,
      'SourceConfiguration.mutedAutoplay': `${theoplayerWebApi}/interfaces/SourceConfiguration.html#mutedAutoplay`,
      '*': `${theoplayerWebApi}/index.html`,
    },
  },
};
