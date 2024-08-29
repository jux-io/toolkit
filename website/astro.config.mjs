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
          label: 'Getting started',
          link: '/developers/getting-started',
        },
        {
          label: 'Technical Overview',
          link: '/developers/technical-overview',
        },
        {
          label: 'Using Jux',
          items: [
            {
              label: 'PostCSS',
              link: '/developers/cli',
            },
          ],
        },
      ],
    }),
    react(),
  ],
});
