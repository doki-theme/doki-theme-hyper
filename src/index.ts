import AppInitialization from "./AppInitialization";

AppInitialization()

export {default as reduceUI} from './reducer';

export {decorateConfig} from './config';

export {
  decorateHyper,
  decorateTerm,
  mapHyperState,
  mapTermsState,
  getTermGroupProps,
  getTermProps
} from './decorator';

export {default as decorateMenu} from './settings';
