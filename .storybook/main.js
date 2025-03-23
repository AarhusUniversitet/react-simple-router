/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite", // Brug react-vite i stedet for react-webpack5
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  // Der er ingen grund til at have Webpack-specifik konfiguration
  // så vi kan fjerne webpackFinal, moduleNameMapper, osv.
};

export default config;