import type { StorybookConfig } from '@storybook/sveltekit';
import path from 'path';

/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|ts|svelte)",
    "../tests/**/*.mdx",
    "../tests/**/*.stories.@(js|ts|svelte)",
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-svelte-csf",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test"
  ],
  "framework": {
    "name": "@storybook/sveltekit",
    "options": {}
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      $lib: path.resolve(__dirname, '../src/lib'),
      $components: path.resolve(__dirname, '../src/lib/components'),
      $routes: path.resolve(__dirname, '../src/routes'),
    };
    return config;
  },
};
export default config;