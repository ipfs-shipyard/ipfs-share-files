# IPFS Share Files

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg)](https://protocol.ai/) [![](https://img.shields.io/badge/project-IPFS-blue.svg)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg)](http://webchat.freenode.net/?channels=%23ipfs)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-blue.svg)](http://standardjs.com/)

> Share files via IPFS

## Background

### This is pre-release software.

This repo is part of the IPFS GUI redesign project, described here: https://github.com/ipfs-shipyard/pm-ipfs-gui

The app accesses a local IPFS daemon via [`window.ipfs-fallback`](https://github.com/tableflip/window.ipfs-fallback). It will use the `window.ipfs` api provided by the [IPFS Companion](https://github.com/ipfs-shipyard/ipfs-companion) web-extension where available, and fallback to using [js-ipfs-api](https://github.com/ipfs/js-ipfs-api).

This app is built with [`create-react-app`](https://github.com/facebook/create-react-app). Please read the [docs](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents).

## Install

```sh
> npm install
```

## Usage

To run the app in development mode:

```sh
> npm run start
# Go to http://localhost:3000
```

To run the storybook:

```sh
> npm run storybook
# Go to http://localhost:9009
```

## Lint

To validate the code using [StandardJS](https://standardjs.com/) run:

```sh
> npm run lint
```

## Build

To build the app for production to the `build` folder:

```sh
> npm run build
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/ipfs-shipyard/ipfs-share-files/issues/new) or submit PRs.

To contribute to IPFS in general, see the [contributing guide](https://github.com/ipfs/community/blob/master/contributing.md).

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/contributing.md)

## License

[MIT](LICENSE)
