/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['src/index.tsx'],
  tsconfig: 'tsconfig.build.json',
  out: 'api',
  sitemapBaseUrl: 'https://theoplayer.github.io/react-native-theoplayer/api/',
  name: 'React Native THEOplayer',
  readme: 'none',
  plugin: ['typedoc-plugin-external-resolver', 'typedoc-plugin-mdn-links', './plugins/typedoc-platform-icons/dist/index.js'],
  navigationLinks: {
    Docs: 'https://www.theoplayer.com/docs/',
    'THEOplayer.com': 'https://www.theoplayer.com/',
  },
  githubPages: true,
  excludePrivate: true,
  excludeExternals: true,
  externalDocumentation: {
    theoplayer: {
      dtsPath: '~/THEOplayer.d.ts',
      externalBaseURL: 'https://www.theoplayer.com/docs/theoplayer/v7/api-reference/web',
    },
  }
};
