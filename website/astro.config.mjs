import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import starlightLinksValidator from 'starlight-links-validator';
import vercel from '@astrojs/vercel/static';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'static',
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
        discord: 'https://discord.gg/BSXsahmyVQ',
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
          label: 'designers',
          items: [
            { label: 'Quickstart', link: '/designers/quickstart' },
            {
              label: 'Creating Components',
              link: '/designers/creating-components',
            },
            {
              label: 'Tokens',
              items: [
                {
                  label: 'Introduction',
                  link: '/designers/tokens',
                },
                {
                  label: 'Color',
                  link: '/designers/tokens/color',
                },
                {
                  label: 'Font Family',
                  link: '/designers/tokens/font-family',
                },
                {
                  label: 'Typography',
                  link: '/designers/tokens/typography',
                },
                {
                  label: 'Dimension',
                  link: '/designers/tokens/dimension',
                },
              ],
            },
            {
              label: 'Elements',
              items: [
                {
                  label: 'Introduction',
                  link: '/designers/elements',
                },
                {
                  label: 'Text',
                  link: '/designers/elements/text',
                },
                {
                  label: 'Div',
                  link: '/designers/elements/div',
                },
                {
                  label: 'Button',
                  link: '/designers/elements/button',
                },
                {
                  label: 'Input',
                  link: '/designers/elements/input',
                },
                {
                  label: 'Checkbox',
                  link: '/designers/elements/checkbox',
                },
                {
                  label: 'Toggle',
                  link: '/designers/elements/toggle',
                },
                {
                  label: 'Logical Slots',
                  link: '/designers/elements/logical-slots',
                },
              ],
            },
            {
              label: 'Dynamic Design Panel',
              collapsed: true,
              items: [
                {
                  label: 'Introduction',
                  link: '/designers/dynamic-design-panel',
                },
                {
                  label: 'Props and Variants',
                  link: '/designers/dynamic-design-panel/props-and-variants',
                },
                {
                  label: 'Size and Position',
                  link: '/designers/dynamic-design-panel/size-and-position',
                },
                {
                  label: 'Layout',
                  link: '/designers/dynamic-design-panel/layout',
                },
                {
                  label: 'Text',
                  link: '/designers/dynamic-design-panel/text',
                },
                {
                  label: 'Background',
                  link: '/designers/dynamic-design-panel/background',
                },
                {
                  label: 'Border',
                  link: '/designers/dynamic-design-panel/border',
                },
                {
                  label: 'Opacity',
                  link: '/designers/dynamic-design-panel/opacity',
                },
                {
                  label: 'Effects (Shadow)',
                  link: '/designers/dynamic-design-panel/effects',
                },
              ],
            },
            {
              label: 'Editor Special Mechanics',
              link: '/designers/designers-special-mechanics',
            },
            {
              label: 'Juxync - Figma to Jux',
              link: '/designers/juxync',
              badge: 'New',
            },
            {
              label: 'Community',
              link: '/designers/people-of-jux',
            },
            {
              label: 'Changelog',
              link: '/designers/changelog',
            },
          ],
        },
      ],
    }),
    react(),
  ],
});
