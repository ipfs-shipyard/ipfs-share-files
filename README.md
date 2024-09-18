# IPFS Share

| Sender view  | Recipient view |
| ------------- | ------------- |
| ![Screenshot of IPFS Share sender view](https://gateway.ipfs.io/ipfs/QmPFxiRfnxucPbW9bXVKRPTn6ZvaDATjy4c3aPtmBHuGeJ)  | ![Screenshot of IPFS Share recipient view](https://gateway.ipfs.io/ipfs/QmYcitvEc1xsJDMQr7UpKfcYWddR6ocboBbVesp6Gp8cBo)  |

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg)](https://protocol.ai/) [![](https://img.shields.io/badge/project-IPFS-blue.svg)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg)](http://webchat.freenode.net/?channels=%23ipfs)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-blue.svg)](http://standardjs.com/)

> Share files directly from your device's browser using IPFS — no cloud needed. Fast, free, easy file sharing for IPFS novices and veterans alike, available at https://share.ipfs.io.

## Maintainers

Maintainers welcome! This repo is not currently under active development, but issues are monitored as part of overall IPFS project issue monitoring.

## Table of Contents

- [About IPFS Share](#about-ipfs-share)
- [For Developers](#for-developers)
- [Translations](#translations)
- [Contribute](#contribute)
- [License](#license)

## About IPFS Share

[IPFS Share](https://share.ipfs.io) is a simple, easy-to-use tool for sharing files directly from your device without having to rely on third-party intermediaries like big corporate cloud providers. It's simple enough for anyone to use, but it's also a great under-the-hood demonstration of a common IPFS use case.

### Features

- Share and receive files using IPFS without needing to install a local node
- Upload or drag-and-drop individual files or entire directories
- For multiple-file uploads, generate share/download links for individual files or a single all-in-one link (downloads as a .tar file)
- Preview files in-browser (browser-supported formats only) before sharing or downloading
- Generates a QR code for share links for easy distribution
- Supports browser-specified language or manual choice of language via menu
- 100% mobile-friendly
- Supports installation as a mobile shortcut or desktop standalone app
- Includes brief explainers on how IPFS Share works, with links to more details for the curious

### How it works
IPFS Share uses [ipfs-provider](https://github.com/ipfs-shipyard/ipfs-provider) to connect to IPFS via multiple providers. If local IPFS node is not available (for example, if you're using IPFS Share on your phone, or due to CORS), an instance of [`js-ipfs`](https://github.com/ipfs/js-ipfs/) is created.

The app itself is built using [`create-react-app`](https://github.com/facebook/create-react-app), so if you're comfortable building ordinary React web apps, you'll feel right at home in this codebase. Not familiar with React or `create-react-app`? There are extensive [docs](https://create-react-app.dev/docs/getting-started/) available. Visual styling is done using [Tachyons](http://tachyons.io/) with additional IPFS flavor via [`ipfs-css`](https://github.com/ipfs-shipyard/ipfs-css).

## For developers

It's easy to get a local copy of IPFS Share up and running, even if you don't have a local IPFS node installed.

### Installation

With `node@14` and `npm@6.4.1` or greater installed, run:

```sh
> npm ci
```

### Usage

To run IPFS Share in development mode:

```sh
> npm start
# You can now view ipfs-share-files in the browser.
# Local: http://localhost:3000
```

### Using with a local IPFS node

If you have a local IPFS node, you may also want to run it simultaneously. Use [IPFS Desktop](https://github.com/ipfs-shipyard/ipfs-desktop) or start a daemon in the terminal:

```sh
> ipfs daemon
# API server listening on /ip4/127.0.0.1/tcp/5001
```

If you are running a local node, you must configure your IPFS API to allow [cross-origin (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) requests from you development server and the [share.ipfs.io](https://share.ipfs.io) domain.

You can either run the [cors-config.sh](./cors-config.sh) script:

```sh
> ./cors-config.sh
```

Or do it manually:

```sh
> ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000", "https://share.ipfs.io"]'
> ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST"]'
```

To reset the config to its default state, run:

```sh
> ipfs config --json API.HTTPHeaders {}
```

### Linting

To validate the code using [StandardJS](https://standardjs.com/), run:

```sh
> npm run lint
```

This is highly recommended to avoid automated CI failures when submitting a pull request to this repo.

### Building

To build IPFS Share for production to the `build` folder:

```sh
> npm run build
```

### Deployment

We use CI for automatic deployments when merged to the following branches:
- Branch `main` is automatically deployed to [dev.share.ipfs.io](https://dev.share.ipfs.io)
- Branch `production` is automatically deployed to [share.ipfs.io](https://share.ipfs.io)

If you just want to PR `main` to `production` for go-live, there's a handy shortcut for that [here](https://github.com/ipfs-shipyard/ipfs-share-files/compare/production...main?expand=1).

Note that it's always a good idea to clear one's caches when double-checking a successful deployment.

## Translations

The entire IPFS project, including IPFS Share, uses [Transifex](https://www.transifex.com/) to help us source and manage translations. We very much welcome your contributions! Simply go to the [project page on Transifex](https://www.transifex.com/ipfs/ipfs-share-files/translate/), create an account, pick a language and start translating.

On the app side, translations are stored in [`public/locales`](./public/locales), and the English version is the source of truth. Transifex automatically syncs new translations into that directory, so if you want to add translations, do so in Transifex — **not** this repo.

### To sync translations

1. Install and set up the [command-line client (` tx `)](https://docs.transifex.com/client/installing-the-client)
2. Download new translations from Transifex with `tx pull -a`
    - This creates/updates the files in [`public/locales/*`](./public/locales) that need to be committed
    - If a new language is created, remember to
      - add it to [`src/i18n.js`](./src/i18n.js)
      - run `npx -q @olizilla/lol public/locales > src/lib/languages.json`

### To add or update English source-of-truth translation keys

1. Change **only** the source file ([`public/locales/en/translation.json`](./public/locales/en/translation.json))
2. Commit your changes; changes from the `main` branch are fetched by Transifex automatically once a day

To learn more about internationalization on the IPFS project as a whole, or contribute translations to other IPFS repos, check out [ipfs/i18n](https://github.com/ipfs/i18n).

## REFRESH - TODO

### UI

1. Update the "progress bar" circular progress bar to be a loading indicator for record publishing
1. Disable share buttons when:
    * no listening webrtc address
    * CID is not published
1. Remove protocol labs footer -> replace with "powered by Helia"
1. Show the users what is actually happening in the background:
    * Finding closest peers
    * asking them to publish our provider record

### Functionality

1. publish directory CID
1. Make sure that when share.ipfs.io link with CID deeplink is shared, that browser retrieval client can get the file.
1. On self:update, we need to check if the listening webrtc address has changed, and republish all "files" and "directory" if so.
1. Ability to remove individual files from share list
1. Fix downloading the files filename

### debugging

1. Add libp2p-devtools


## Contribute

Contributions are more than welcome! Check out the [currently open issues](https://github.com/ipfs-shipyard/ipfs-share-files/issues) and start hacking on anything that sounds interesting. Issues are labeled with a variety of tags to help you find a good fit — you may wish to start with the [`help-wanted`](https://github.com/ipfs-shipyard/ipfs-share-files/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) tag.

To contribute to IPFS in general, check out the wide variety of opportunities [here](https://docs.ipfs.io/community/contribute/ways-to-contribute).

The IPFS community believes that our mission is best served in an environment that is friendly, safe, and accepting, and free from intimidation or harassment. To that end, we ask that everyone involved in IPFS read and respect our [code of conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

## License

[MIT](LICENSE)
