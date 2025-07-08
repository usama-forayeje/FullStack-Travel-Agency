import { reactRouter } from "@react-router/dev/vite";
import {
  sentryOnBuildEnd,
  sentryReactRouter,
  type SentryReactRouterBuildOptions,
} from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "forayaje-coder",
  project: "javascript-react",
  authToken:
    "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",
};
export default defineConfig((config) => {
  return {
    plugins: [
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
      sentryReactRouter(sentryConfig, config),
    ],
    ssr: {
      noExternal: [/@syncfusion/],
    },
    buildEnd: async ({
      viteConfig,
      reactRouterConfig,
      buildManifest,
    }: {
      viteConfig: any;
      reactRouterConfig: any;
      buildManifest: any;
    }) => {
      await sentryOnBuildEnd({ viteConfig, reactRouterConfig, buildManifest });
    },
  };
});
