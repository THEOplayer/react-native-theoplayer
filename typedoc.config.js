/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['src/index.tsx'],
  tsconfig: 'tsconfig.build.json',
  out: 'api',
  sitemapBaseUrl: 'https://theoplayer.github.io/react-native-theoplayer/api/',
  name: 'React Native THEOplayer',
  readme: 'none',
  navigationLinks: {
    Docs: 'https://www.theoplayer.com/docs/',
    'THEOplayer.com': 'https://www.theoplayer.com/',
  },
  githubPages: true,
  excludePrivate: true,
  excludeExternals: true,
};
