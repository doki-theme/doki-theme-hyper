import AppInitialization from "./AppInitialization";

AppInitialization();

export { default as reduceUI } from "./reducer";

export { decorateConfig } from "./config";

export {decorateKeymaps} from './keymaps'

export {
  decorateHyper,
  decorateTerm,
  mapHyperState,
  mapTermsState,
  getTermGroupProps,
  getTermProps,
  decorateTerms,
} from './decorator';

export { default as decorateMenu } from "./settings";
