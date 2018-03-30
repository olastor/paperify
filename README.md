# paperify

[![Build Status](https://travis-ci.org/olastor/paperify.svg?branch=master)](https://travis-ci.org/olastor/paperify)
[![dependencies Status](https://david-dm.org/olastor/paperify/status.svg)](https://david-dm.org/olastor/paperify)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/paperifyorg?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## About

This is a web client for editing and previewing documents, which are generated with [Pandoc](https://pandoc.org/). Please visit [paperify.org](https://www.paperify.org) for a demo.

## Developement

After cloning this repository the following steps are required to start the developement server:

1. Make sure the URL in `src/api.config.ts` points to the correct server (i.e. `http://localhost:3002`)
2. Run `yarn install` (optionally `npm install`)
3. Run `yarn start`
4. Navigate browser to `http://localhost:4200`

For more information visit [https://cli.angular.io/](https://cli.angular.io/).

## Building for production

1. Run `yarn install`
2. Run `yarn build`
3. Copy the build from `dist/` to your webserver 
