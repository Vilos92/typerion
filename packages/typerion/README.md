<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Apache 2.0 License][license-shield]][license-url]

<!-- NPM BADGES -->

`typerion`

<ul>
  <li><a href="https://badge.fury.io/js/typerion"><img src="https://badge.fury.io/js/typerion.svg" alt="npm version" height="18"></a></li>
</ul>

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Vilos92/typerion">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Vilos92/typerion/raw/main/images/screencapDark.gif">
      <img src="https://github.com/Vilos92/typerion/raw/main/images/screencap.gif" alt="Typerion Screen Capture" height="480">
    </picture>
  </a>
</p>

<h3 align="center">Typerion</h3>

<p align="center">
  A Typescript notebook for developing, prototyping, and sharing software.
  <br />
  <a href="https://github.com/Vilos92/typerion"><strong>Explore the docs »</strong></a>
  <br />
  <br />
  <a href="https://typerion.dev">Web App</a>
  ·
  <a href="https://github.com/Vilos92/typerion/issues">Report Bug</a>
  ·
  <a href="https://github.com/Vilos92/typerion/issues">Request Feature</a>
</p>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#pre-requisites">Pre-requisites</a></li>
        <li><a href="#install-and-run">Install and Run</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Vilos92/typerion/raw/main/images/screenshotDark.png">
    <img src="https://github.com/Vilos92/typerion/raw/main/images/screenshot.png" alt="Typerion Screen Shot" height="480">
  </picture>
</p>

This is an interactive TypeScript notebook that can be used to develop, prototype, and share software. Typerion is entirely open-source, with a focus on low-barrier-to-use and ease-of-sharing results with other developers.

The Typerion notebook:

- Has a rich code editor with syntax highlighting.
- Supports dynamically importing modules that are loaded from [https://unpkg.com/](https://unpkg.com/).
- Allows passing context forward between code cells.
- Provides saving and loading behavior so that results can be persisted and shared.

<!-- GETTING STARTED -->

## Getting Started

### Quick Start

A local instance of Typerion can be started with `npx`:

```sh
npx typerion-cli
```

### Pre-Requisites

Install `pnpm`

- https://pnpm.io/installation

### Install and Run

1. Clone the repo
   ```sh
   git clone https://github.com/Vilos92/typerion.git
   ```
2. Navigate to the `typerion` package.
   ```sh
   cd packages/typerion
   ```
3. Install packages
   ```sh
   pnpm install
   ```
4. Run in development mode
   ```sh
   pnpm dev
   ```

After the last command, the Typerion app can be accessed at http://localhost:5173/

### Imports

There are two components that can be imported from `typerion`.

```js
import {Notebook, Pad} from 'typerion';
```

Type definitions are included in the `typerion` package.

<!-- USAGE EXAMPLES -->

### Usage

The Notebook header contains controls to:

- Create cells above and below the current cell.
- Run all cells in the Notebook.
- Save the current Notebook state to a file.
- Load the Notebook state from a file.

Some keyboard shortcuts include:

- `CMD` + `Enter`
  - Run the currently focused cell.
- `Shift` + `Enter`
  - Run the currently focused cell, and then move to the next cell.
  - If the last cell is currently selected, a new cell is created.
- `CMD` + `Up` / `Down`
  - Move focus up and down the cells in the Notebook.

<!-- CONTRIBUTING -->

## Contributing

Contributions are **greatly appreciated**. This project is intended to be fully open-source, and the support and feedback from other developers are fully welcome.

<!-- CONTACT -->

## Contact

Gregory Linscheid - [Website](https://greglinscheid.com) - linscheid.greg@gmail.com

Project Link: [https://github.com/Vilos92/typerion](https://github.com/Vilos92/typerion)

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- Byron Barmby - Design contributions for the logo.

<!-- LICENSE -->

## License

Distributed under the Apache 2.0 License. See [`LICENSE`][license-url] for more information.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/Vilos92/typerion.svg?style=for-the-badge
[contributors-url]: https://github.com/Vilos92/typerion/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Vilos92/typerion.svg?style=for-the-badge
[forks-url]: https://github.com/Vilos92/typerion/network/members
[stars-shield]: https://img.shields.io/github/stars/Vilos92/typerion.svg?style=for-the-badge
[stars-url]: https://github.com/Vilos92/typerion/stargazers
[issues-shield]: https://img.shields.io/github/issues/Vilos92/typerion.svg?style=for-the-badge
[issues-url]: https://github.com/Vilos92/typerion/issues
[license-shield]: https://img.shields.io/github/license/Vilos92/typerion.svg?style=for-the-badge
[license-url]: https://github.com/Vilos92/typerion/blob/master/LICENSE
