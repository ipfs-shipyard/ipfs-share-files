import type { StorybookConfig } from '@storybook/react-vite';

// TODO: fix storybook dev and build

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    // '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage',
    '@chromatic-com/storybook'
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // async viteFinal(config) {
  //   // Merge custom configuration into the default config
  //   return mergeConfig(config, viteConfig);
  // },
  // docs: {}
  typescript: {
    // reactDocgen: 'react-docgen-typescript'
    reactDocgen: false
    // reactDocgenTypescriptOptions: {

    // }
  },

  docs: {}
};
export default config;
