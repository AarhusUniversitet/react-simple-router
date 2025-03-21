/** @type {import('@storybook/react-webpack5').StorybookConfig} */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-webpack5-compiler-babel",
    "@chromatic-com/storybook"
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {},
  // Storybook 8 bruger en lidt anderledes TypeScript-konfiguration
  typescript: {
    // Storybook 8 checker ikke typer som standard
    check: false,
    // Mere effektiv dokgenerering
    reactDocgen: "react-docgen-typescript",
  }
  // Fjernet staticDirs konfiguration, da vi ikke har en public mappe
};

export default config;