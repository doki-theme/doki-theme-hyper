import {
  BaseAppDokiThemeDefinition,
  DokiThemeDefinitions,
  evaluateTemplates,
  MasterDokiThemeDefinition,
  StringDictionary,
  constructNamedColorTemplate,
  resolvePaths
} from "doki-build-source";
import path from 'path';
import fs from "fs";

const {
  repoDirectory,
  masterThemeDefinitionDirectoryPath
} = resolvePaths(__dirname);

type HyperDokiThemeDefinition = BaseAppDokiThemeDefinition;

function buildHyperTheme(
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions
) {
  return {
    colors: constructNamedColorTemplate(
      dokiThemeDefinition,
      dokiTemplateDefinitions
    ),
  };
}

type HyperDokiTheme = { path: string; hyperDef: BaseAppDokiThemeDefinition; definition: MasterDokiThemeDefinition; theme: { colors: any } };

function createDokiTheme(
  dokiFileDefinitionPath: string,
  dokiThemeDefinition: MasterDokiThemeDefinition,
  masterTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeHyperDefinition: HyperDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
): HyperDokiTheme {
  try {
    return {
      path: dokiFileDefinitionPath,
      definition: dokiThemeDefinition,
      theme: buildHyperTheme(
        dokiThemeDefinition,
        dokiTemplateDefinitions
      ),
      hyperDef: dokiThemeHyperDefinition
    };
  } catch (e) {
    throw new Error(`Unable to build ${dokiThemeDefinition.name}'s theme for reasons ${e}`);
  }
}

function resolveStickerPath(
  themeDefinitonPath: string,
  sticker: string,
) {
  const stickerPath = path.resolve(
    path.resolve(themeDefinitonPath, '..'),
    sticker
  );
  return stickerPath.substr(masterThemeDefinitionDirectoryPath.length + '/definitions'.length);
}

const getStickers = (
  dokiDefinition: MasterDokiThemeDefinition,
  hyperDef: HyperDokiThemeDefinition,
  dokiTheme: any
) => {
  const secondary =
    dokiDefinition.stickers.secondary
  return {
    default: {
      path: resolveStickerPath(dokiTheme.path, dokiDefinition.stickers.default.name),
      name: dokiDefinition.stickers.default.name,
      background: hyperDef.backgrounds?.default || {},
    },
    ...(secondary
      ? {
        secondary: {
          path: resolveStickerPath(dokiTheme.path, secondary.name),
          name: secondary.name,
          background: hyperDef.backgrounds?.secondary || {},
        },
      }
      : {}),
  };
};

const omit = require('lodash/omit');

console.log('Preparing to generate themes.');

evaluateTemplates<HyperDokiThemeDefinition, HyperDokiTheme>(
  {
    appName: 'hyper',
    currentWorkingDirectory: __dirname,
  },
  createDokiTheme
).then(dokiThemes => {
  // write things for extension
  const dokiThemeDefinitions = dokiThemes.map(dokiTheme => {
    const dokiDefinition = dokiTheme.definition;
    return {
      information: omit(dokiDefinition, [
        'colors',
        'overrides',
        'ui',
        'icons'
      ]),
      colors: dokiTheme.theme.colors,
      stickers: getStickers(dokiDefinition, dokiTheme.hyperDef, dokiTheme),
    };
  }).reduce((accum: StringDictionary<any>, definition) => {
    accum[definition.information.id] = definition;
    return accum;
  }, {});
  const finalDokiDefinitions = JSON.stringify(dokiThemeDefinitions);
  fs.writeFileSync(
    path.resolve(repoDirectory, 'src', 'DokiThemeDefinitions.ts'),
    `export default ${finalDokiDefinitions};`);
})
  .then(() => {
    console.log('Theme Generation Complete!');
  });
