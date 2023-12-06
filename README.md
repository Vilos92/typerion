<a name="readme-top"></a>

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

`typerion-cli`

<ul>
  <li><a href="https://badge.fury.io/js/typerion-cli"><img src="https://badge.fury.io/js/typerion-cli.svg" alt="npm version" height="18"></a></li>
</ul>

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Vilos92/typerion">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Vilos92/typerion/raw/main/images/typerionLogoMarkDark.svg">
      <img src="https://github.com/Vilos92/typerion/raw/main/images/typerionLogoMark.svg" alt="Logo" height="100">
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
    <li><a href="#roadmap">Roadmap</a></li>
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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Quick Start

A local instance of Typerion can be started with `npx`:

```sh
npx typerion-cli
```

### Pre-Requisites

1. Install pnpm
   - https://pnpm.io/installation
2. Install turborepo

```sh
pnpm install turbo --global
```

### Install and Run

1. Clone the repo
   ```sh
   git clone https://github.com/Vilos92/typerion.git
   ```
2. Install packages
   ```sh
   pnpm install
   ```
3. Run in development mode
   ```sh
   turbo run dev
   ```

After the last command, the Typerion app can be accessed at http://localhost:5173/

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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Improved README.
- [ ] Better dynamic imports of packages.
- [ ] Simpler passing of global context between cells.
- [ ] Improved output logging for cells.
- [ ] Web application hosted on typerion.dev
- [ ] The ability for each cell to interact with its own DOM.

See the [open issues](https://github.com/Vilos92/typerion/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are **greatly appreciated**. This project is intended to be fully open-source, and the support and feedback from other developers are fully welcome.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Gregory Linscheid - [Website](https://greglinscheid.com) - linscheid.greg@gmail.com

Project Link: [https://github.com/Vilos92/typerion](https://github.com/Vilos92/typerion)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- Byron Barmby - Design contributions for the logo.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the Apache 2.0 License. See [`LICENSE`][license-url] for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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
