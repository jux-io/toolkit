<p align="center">
  <a href="https://www.jux.io" target="_blank">
    <img alt="Jux" src="website/src/assets/JuxButtonWhite.png" width="350">
  </a>
</p>

<p align="center">
A utility first, zero runtime CSS-in-JS framework with full design tokens and themes support.
</p>

<p align="center">
    <a href="https://github.com/jux-io/toolkit/actions"><img src="https://github.com/jux-io/toolkit/actions/workflows/release.yml/badge.svg" alt="Build Status"></a>
    <a href="https://www.npmjs.com/package/@juxio/cli"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="commitizen friendly"></a>
</p>

## Features

- Write CSS in JS, with **zero** runtime - all styles are extracted and calculated at build time
- Full support for design tokens and themes, using [@juxio/design-tokens](packages/design-tokens/README.md)
- Utility first - write utilities which can then be used to style your components
- CLI for easy management of your design tokens, themes, utilities and styles
- Type-safe - autocompletion for your design tokens, breakpoints, and utilities
- Full interpolation support when generating styles

## Documentation

For documentation, visit [docs.jux.io](https://docs.jux.io).

## Quickstart

Jux is a PostCSS plugin, so you can use it with any build tool that supports PostCSS.

Install Jux CLI:

```
npm install -D @juxio/cli postcss
```

Initialize a new project. This will install the necessary dependencies, and create `jux.config.ts` and `postcss.config.js` files in your project root.

```
npx jux init --postcss
```

Configure your include files:

```typescript
export default {
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{ts,tsx}'],
  exclude: [],

  /* The core tokens of your design system */
  core_tokens: {},

  /* The themes for your design system */
  themes: {},
};
```

Add Jux’s `@layer` directive to your main CSS file:

```css
@layer juxbase, juxtokens, juxutilities;
```

Start your build process and generate your CSS:

```
npx jux generate css -o styles.css
```

Include the generated CSS in your project:

```tsx
import './styles.css';

import { css } from '@juxio/css';

export default function Home() {
  return (
    <div
      className={css({
        color: 'violet',
        '&:hover': {
          color: 'darkviolet',
        },
      })}
    >
      Hello from Jux 🤖
    </div>
  );
}
```

## Community

Love the project? ♥️ Need help or have a question? Join our [Discord](https://discord.gg/BSXsahmyVQ) community or email us at [squad@jux.io](mailto:squad@jux.io) and say hi!
