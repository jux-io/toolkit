import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import starlightLinksValidator from 'starlight-links-validator';
import vercel from '@astrojs/vercel/serverless';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enable: true },
  }),
  integrations: [
    starlight({
      plugins: [starlightImageZoom(), starlightLinksValidator()],

      customCss: ['./src/styles/custom.css'],
      title: 'Jux Docs',
      components: {
        Header: './src/components/Header.astro',
        Sidebar: './src/components/Sidebar/Sidebar.astro',
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
          label: 'developers',
          items: [
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
            {
              label: 'Community',
              link: '/developers/people-of-jux',
            },
          ],
        },
        {
          label: 'editor',
          items: [
            { label: 'Introduction', link: '/editor' },
            {
              label: 'Creating Components',
              link: '/editor/creating-components',
            },
            {
              label: 'Tokens',
              items: [
                {
                  label: 'Introduction',
                  link: '/editor/tokens',
                },
                {
                  label: 'Color',
                  link: '/editor/tokens/color',
                },
                {
                  label: 'Font Family',
                  link: '/editor/tokens/font-family',
                },
                {
                  label: 'Typography',
                  link: '/editor/tokens/typography',
                },
                {
                  label: 'Dimension',
                  link: '/editor/tokens/dimension',
                },
              ],
            },
            {
              label: 'Elements',
              items: [
                {
                  label: 'Introduction',
                  link: '/editor/elements',
                },
                {
                  label: 'Text',
                  link: '/editor/elements/text',
                },
                {
                  label: 'Div',
                  link: '/editor/elements/div',
                },
                {
                  label: 'Button',
                  link: '/editor/elements/button',
                },
                {
                  label: 'Input',
                  link: '/editor/elements/input',
                },
                {
                  label: 'Checkbox',
                  link: '/editor/elements/checkbox',
                },
                {
                  label: 'Toggle',
                  link: '/editor/elements/toggle',
                },
                {
                  label: 'Logical Slots',
                  link: '/editor/elements/logical-slots',
                },
              ],
            },
            {
              label: 'Dynamic Design Panel',
              collapsed: true,
              items: [
                {
                  label: 'Introduction',
                  link: '/editor/dynamic-design-panel',
                },
                {
                  label: 'Props and Variants',
                  link: '/editor/dynamic-design-panel/props-and-variants',
                },
                {
                  label: 'Size and Position',
                  link: '/editor/dynamic-design-panel/size-and-position',
                },
                {
                  label: 'Layout',
                  link: '/editor/dynamic-design-panel/layout',
                },
                {
                  label: 'Text',
                  link: '/editor/dynamic-design-panel/text',
                },
                {
                  label: 'Background',
                  link: '/editor/dynamic-design-panel/background',
                },
                {
                  label: 'Border',
                  link: '/editor/dynamic-design-panel/border',
                },
                {
                  label: 'Opacity',
                  link: '/editor/dynamic-design-panel/opacity',
                },
                {
                  label: 'Effects (Shadow)',
                  link: '/editor/dynamic-design-panel/effects',
                },
              ],
            },
            {
              label: 'Editor Special Mechanics',
              link: '/editor/editor-special-mechanics',
            },
            {
              label: 'Juxync - Figma to Jux',
              link: '/editor/juxync',
              badge: 'New',
            },
            {
              label: 'Community',
              link: '/editor/people-of-jux',
            },
            {
              label: 'Changelog',
              link: '/editor/changelog',
            },
          ],
        },
      ],
    }),
    react(),
  ],
});
