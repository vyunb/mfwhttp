export default (deps) => [
  ...Object.keys(deps || {}),
  '@mfhttp/router',
  'regexparam',
  'http',
  'url',
  'path',
  'crypto',
  'fs',
  'fs/promises',
  'net',
  'events',
  'querystring'
]
