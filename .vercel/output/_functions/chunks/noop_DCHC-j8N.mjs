;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2665a8aa-936a-4253-b38e-a128b72d68d3",e._sentryDebugIdIdentifier="sentry-dbid-2665a8aa-936a-4253-b38e-a128b72d68d3")}catch(e){}}();import { b as baseService } from './_astro_assets_Ogb9U0OI.mjs';

const noopService = {
  ...baseService,
  propertiesToHash: ["src"],
  async transform(inputBuffer, transformOptions) {
    return {
      data: inputBuffer,
      format: transformOptions.format
    };
  }
};
var noop_default = noopService;

export { noop_default as default };
