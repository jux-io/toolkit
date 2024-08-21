import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import Image from 'next/image';

const config: DocsThemeConfig = {
  logo: <Image src={'/logo.png'} alt={'logo'} width={'100'} height={200} />,
  project: {
    link: 'https://github.com/jux-io/toolkit',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/jux-io/toolkit',
  footer: {
    text: 'Jux',
  },
};

export default config;
