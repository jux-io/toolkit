import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      customCss: ['./src/styles/custom.css'],
      title: 'Jux Toolkit',
      components: {
        Header: './src/components/Header.astro',
      },
      favicon: '/favicon.ico',
      logo: {
        src: './src/assets/JuxButtonWhite.png',
        replacesTitle: true,
      },
      social: {
        github: 'https://github.com/jux-io/toolkit',
        discord: 'https://discord.gg/xa4PR7T9',
      },
      sidebar: [
        {
          label: 'Why Jux',
          link: '/',
        },
        {
          label: 'Quickstart',
          link: '/developers/quickstart',
        },
        {
          label: 'Technical Overview',
          link: '/developers/technical-overview',
        },
        {
          label: 'Working with Jux Editor',
          link: '/developers/jux-editor/',
        },
        {
          label: 'TypeScript',
          link: '/developers/typescript',
        },
        {
          label: 'Getting Started',
          items: [
            {
              label: 'PostCSS',
              link: '/developers/getting-started/postcss',
            },
            {
              label: 'Next.js',
              link: '/developers/getting-started/nextjs',
            },
            {
              label: 'Astro',
              link: '/developers/getting-started/astro',
            },
            {
              label: 'Vite',
              link: '/developers/getting-started/vite',
            },
          ],
        },
        {
          label: 'Jux concepts',
          items: [
            {
              label: 'Styling',
              link: '/developers/jux-concepts/styling',
            },
            {
              label: 'Compositions',
              link: '/developers/jux-concepts/compositions',
            },
            {
              label: 'Nested selectors',
              link: '/developers/jux-concepts/nested-selectors',
            },
          ],
        },
        {
          label: 'Customization',
          items: [
            {
              label: 'Configuration',
              link: '/developers/customization/config',
            },
            {
              label: 'Tokens & Themes',
              link: '/developers/customization/tokens-and-themes',
            },
            {
              label: 'Screens (Responsive Design)',
              link: '/developers/customization/screens',
            },
            {
              label: 'Utilities',
              link: '/developers/customization/utilities',
            },
            {
              label: 'Presets',
              link: '/developers/customization/presets',
            },
          ],
        },
        {
          label: 'Recipes',
          items: [
            {
              label: 'Multi-projects environment',
              link: '/developers/recipes/monorepo',
            },
          ],
        },
        {
          label: 'References',
          items: [
            {
              label: 'CLI',
              link: '/developers/reference/cli',
            },
            {
              label: 'Preflight Styles',
              link: '/developers/reference/preflight-styles',
            },
          ],
        },
      ],
    }),
    react(),
  ],
});
