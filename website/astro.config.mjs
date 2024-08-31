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
        discord: 'https://www.discord.com',
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
          ],
        },
        {
          label: 'Working with Jux Editor',
          items: [
            {
              label: 'Pull tokens and themes',
              link: '/developers/editor/tokens',
            },
            {
              label: 'Pull Components',
              link: '/developers/reference/cli',
            },
          ],
        },
        {
          label: 'References',
          items: [
            {
              label: 'Configuration reference',
              link: '/developers/reference/config',
            },
            {
              label: 'CLI Reference',
              link: '/developers/reference/cli',
            },
          ],
        },
      ],
    }),
    react(),
  ],
});
