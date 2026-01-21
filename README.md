# IPFS Share

| Sender view  | Recipient view |
| ------------- | ------------- |
| ![Screenshot of IPFS Share sender view](https://gateway.ipfs.io/ipfs/QmPFxiRfnxucPbW9bXVKRPTn6ZvaDATjy4c3aPtmBHuGeJ)  | ![Screenshot of IPFS Share recipient view](https://gateway.ipfs.io/ipfs/QmYcitvEc1xsJDMQr7UpKfcYWddR6ocboBbVesp6Gp8cBo)  |

[![IPFS Project](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](https://ipfs.tech)
[![Discourse Forum](https://img.shields.io/discourse/posts?server=https%3A%2F%2Fdiscuss.ipfs.tech&style=flat-square)](https://discuss.ipfs.tech)
[![IPFS Community](https://img.shields.io/badge/community-join-blue.svg?style=flat-square)](https://docs.ipfs.tech/community/)
[![Code Style](https://img.shields.io/badge/code%20style-standard-blue.svg?style=flat-square)](http://standardjs.com/)

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
IPFS Share runs a [Helia](https://github.com/ipfs/helia) node directly in your browser. Files are shared peer-to-peer over WebRTC and WebTransport connections.

The app is built with React and [Vite](https://vite.dev/). Visual styling uses [Tachyons](http://tachyons.io/) with additional IPFS flavor via [`ipfs-css`](https://github.com/ipfs-shipyard/ipfs-css).

## For developers

It's easy to get a local copy of IPFS Share up and running, even if you don't have a local IPFS node installed.

### Installation

With Node.js LTS installed, run:

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

Changes merged to `main` are automatically deployed to [share.ipfs.io](https://share.ipfs.io).

## Translations

Contributing translations in your language is particularly valuable! We use Transifex to manage internationalization, which means you don't need to change a single line of code to add your translations:

- https://explore.transifex.com/ipfs/ipfs-share-files/

*Note for developers: English is the source of truth. Add new text to [`public/locales/en/translation.json`](./public/locales/en/translation.json) and it will automatically propagate to Transifex for other languages. Translations are synced back via CI workflow.*

### Manual sync (if CI is unavailable)

1. Install the [Transifex CLI](https://github.com/transifex/cli)
2. Download translations with `tx pull -a`
3. Regenerate languages list: `npx -q @olizilla/lol@2 public/locales > src/lib/languages.json`

## Contribute

Contributions are more than welcome! Check out the [currently open issues](https://github.com/ipfs-shipyard/ipfs-share-files/issues) and start hacking on anything that sounds interesting. Issues are labeled with a variety of tags to help you find a good fit — you may wish to start with the [`help-wanted`](https://github.com/ipfs-shipyard/ipfs-share-files/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) tag.

To contribute to IPFS in general, check out the wide variety of opportunities [here](https://docs.ipfs.tech/community/contribute/ways-to-contribute/).

The IPFS community believes that our mission is best served in an environment that is friendly, safe, and accepting, and free from intimidation or harassment. To that end, we ask that everyone involved in IPFS read and respect our [code of conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

## License

[MIT](LICENSE)
