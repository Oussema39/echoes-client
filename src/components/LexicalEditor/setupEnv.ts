import { INITIAL_SETTINGS, Settings } from "./appSettings";

// Export a function so this is not tree-shaken,
// but evaluate it immediately so it executes before
// lexical computes CAN_USE_BEFORE_INPUT
export default (() => {
  // override default options with query parameters if any
  const urlSearchParams = new URLSearchParams(window.location.search);

  for (const param of Object.keys(INITIAL_SETTINGS)) {
    if (urlSearchParams.has(param)) {
      try {
        const value = JSON.parse(urlSearchParams.get(param) ?? "true");
        INITIAL_SETTINGS[param as keyof Settings] = Boolean(value);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        console.warn(`Unable to parse query parameter "${param}"`);
      }
    }
  }

  if (INITIAL_SETTINGS.disableBeforeInput) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    delete window.InputEvent.prototype.getTargetRanges;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  window.EXCALIDRAW_ASSET_PATH = import.meta.env.EXCALIDRAW_ASSET_PATH;

  return INITIAL_SETTINGS;
})();
