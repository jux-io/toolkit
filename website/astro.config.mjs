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
      head: [
        {
          tag: 'script',
          content: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-563F8T9');`,
        },
      ],
      customCss: ['./src/styles/custom.css'],
      title: 'Jux Docs',
      components: {
        Header: './src/components/Header.astro',
        Sidebar: './src/components/Sidebar/Sidebar.astro',
        PageFrame: './src/components/PageFrame.astro',
      },
      favicon: '/favicon.ico',
      logo: {
        light: './src/assets/jux_logo_light.svg',
        dark: './src/assets/jux_logo_dark.svg',
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
                  label: 'Vite/React',
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
              link: '/people-of-jux',
            },
          ],
        },
        {
          label: 'welcome',
          items: [
            { label: 'Introduction', link: '/' },
            {
              label: 'Community',
              link: '/people-of-jux',
            },
            {
              label: 'Roadmap',
              link: '/roadmap',
            },
          ],
        },
        {
          label: 'designers',
          items: [
            { label: 'Quickstart', link: '/designers/quickstart' },
            {
              label: 'Editor',
              items: [
                {
                  label: 'Creating components',
                  link: '/designers/editor/creating-components',
                },
                {
                  label: 'Keyboard shortcuts',
                  link: '/designers/editor/keyboard-shortcuts',
                },
                {
                  label: 'Managing Assets',
                  link: '/designers/editor/managing-assets',
                },
                {
                  label: 'Objects Navigator',
                  link: '/designers/editor/objects-navigator',
                },
                {
                  label: 'Editing Properties',
                  link: '/designers/editor/editing-properties',
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
                  label: 'Button',
                  link: '/designers/elements/button',
                },
                {
                  label: 'Checkbox',
                  link: '/designers/elements/checkbox',
                },
                {
                  label: 'Checkbox Field',
                  link: '/designers/elements/checkbox-field',
                },
                {
                  label: 'Chip',
                  link: '/designers/elements/chip',
                },
                {
                  label: 'Div',
                  link: '/designers/elements/div',
                },
                {
                  label: 'Divider',
                  link: '/designers/elements/divider',
                },
                {
                  label: 'Dynamic Content Slot',
                  link: '/designers/elements/dynamic-content-slot',
                },
                {
                  label: 'Input',
                  link: '/designers/elements/input',
                },
                {
                  label: 'Logical Slots',
                  link: '/designers/elements/logical-slots',
                },
                {
                  label: 'Radio Field',
                  link: '/designers/elements/radio-field',
                },
                {
                  label: 'Text',
                  link: '/designers/elements/text',
                },
                {
                  label: 'Text Area',
                  link: '/designers/elements/text-area',
                },
                {
                  label: 'Text Area Field',
                  link: '/designers/elements/text-area-field',
                },
                {
                  label: 'Text Field',
                  link: '/designers/elements/text-field',
                },
                {
                  label: 'Toggle',
                  link: '/designers/elements/toggle',
                },
              ],
            },
            {
              label: 'Tokens Management',
              items: [
                {
                  label: 'Introduction',
                  link: '/designers/tokens',
                },
                {
                  label: 'Color tokens',
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
              label: 'Juxync - Figma to Jux',
              link: '/designers/juxync',
              badge: 'New',
            },
            {
              label: 'Community',
              link: '/people-of-jux',
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
