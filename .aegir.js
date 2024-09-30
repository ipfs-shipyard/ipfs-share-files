/** @type {import('aegir').PartialOptions} */
const options = {
  lint: {
    paths: [
      'src',
      'test'
    ]
  },
  build: {
    bundle: false,
    /**
     * esbuild options:
     */
    config: {
      loader: {
        '.js': 'jsx',
        '.ts': 'ts',
        '.tsx': 'tsx'
      }
    }
  },
  test: {
    build: false, // we trigger aegir build in package.json
    files: [
      'aegir-build/test/**/*.spec.js'
    ],
    before: ({runner}) => {
      // if (runner === 'node') {
      //   process.exit(0)
      // }
      //   // skip tests
    }
  },
  dependencyCheck: {
    ignore: [
      'tachyons', // we import tachyons in App.css

      // aegir dep-check doesn't check tsx files properly:
      '@helia/mfs',
      '@libp2p/devtools-metrics',
      'classnames',
      'helia',
      'ipfs-css',
      'qrcode.react',
      'react-circular-progressbar',
      'react-copy-to-clipboard',
      'react-dnd',
      'react-dnd-html5-backend',
      'react-dom',
      'react-helmet',
      'react-i18next',
      'react-loader-spinner',
      'react-modal',
      '@multiformats/multiaddr-matcher',

      // error when testing without this dep
      'node-datachannel'
    ],
    productionIgnorePatterns: [
      '.storybook',
      'vite.config.ts',
      'test',
      '**/*.stories.*',
      'dist',
      'aegir-build'
    ],
    developmentIgnorePatterns: [
      'dist',
      'aegir-build'
    ]
  }
}
export default options
