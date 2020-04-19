import { attemptToUpdateSticker } from './StickerUpdateService';

attemptToUpdateSticker();

export { default as reduceUI } from './reducer';

export { decorateConfig } from './config';

export {
  decorateHyper,
  decorateTerm,
  mapHyperState,
  mapTermsState,
  getTermGroupProps,
  getTermProps
} from './decorator';

export {default as decorateMenu } from './settings';
