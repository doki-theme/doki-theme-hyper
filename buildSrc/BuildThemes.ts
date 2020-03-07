// @ts-ignore
import GroupToNameMapping from "./GroupMappings";
import { DokiThemeTemplateDefinition, StringDictonary, DokiThemeDefinitions } from "./types";

const path = require('path');

const repoDirectory = path.resolve(__dirname, '..');

const fs = require('fs');

const masterThemeDefinitionDirectoryPath =
  path.resolve(repoDirectory, 'masterThemes');

function walkDir(dir: string): Promise<string[]> {
  const values: Promise<string[]>[] = fs.readdirSync(dir)
    .map((file: string) => {
      const dirPath: string = path.join(dir, file);
      const isDirectory = fs.statSync(dirPath).isDirectory();
      if (isDirectory) {
        return walkDir(dirPath);
      } else {
        return Promise.resolve([path.join(dir, file)]);
      }
    });
  return Promise.all(values)
    .then((scannedDirectories) => scannedDirectories
      .reduce((accum, files) => accum.concat(files), []));
}

const LAF_TYPE = 'laf';
const SYNTAX_TYPE = 'syntax';
const NAMED_COLOR_TYPE = 'colorz';

function getTemplateType(templatePath: string) {
  if (templatePath.endsWith('laf.template.json')) {
    return LAF_TYPE;
  } else if (templatePath.endsWith('syntax.template.json')) {
    return SYNTAX_TYPE;
  } else if (templatePath.endsWith('colors.template.json')) {
    return NAMED_COLOR_TYPE;
  }
  return undefined;
}


function resolveTemplate<T, R>(
  childTemplate: T,
  templateNameToTemplate: StringDictonary<T>,
  attributeResolver: (t: T) => R,
  parentResolver: (t: T) => string,
): R {
  if (!parentResolver(childTemplate)) {
    return attributeResolver(childTemplate);
  } else {
    const parent = templateNameToTemplate[parentResolver(childTemplate)];
    const resolvedParent = resolveTemplate(
      parent,
      templateNameToTemplate,
      attributeResolver,
      parentResolver
    );
    return {
      ...resolvedParent,
      ...attributeResolver(childTemplate)
    };
  }
}


function resolveColor(
  color: string,
  namedColors: StringDictonary<string>
): string {
  const startingTemplateIndex = color.indexOf('&');
  if (startingTemplateIndex > -1) {
    const lastDelimeterIndex = color.lastIndexOf('&');
    const namedColor =
      color.substring(startingTemplateIndex + 1, lastDelimeterIndex);
    const namedColorValue = namedColors[namedColor];
    if (!namedColorValue) {
      throw new Error(`Named color: '${namedColor}' is not present!`);
    }

    // todo: check for cyclic references
    if (color === namedColorValue) {
      throw new Error(`Very Cheeky, you set ${namedColor} to resolve to itself 😒`);
    }

    const resolvedNamedColor = resolveColor(namedColorValue, namedColors);
    if (!resolvedNamedColor) {
      throw new Error(`Cannot find named color '${namedColor}'.`);
    }
    return resolvedNamedColor + color.substring(lastDelimeterIndex + 1) || '';
  }

  return color;
}

function applyNamedColors(
  objectWithNamedColors: StringDictonary<string>,
  namedColors: StringDictonary<string>,
): StringDictonary<string> {
  return Object.keys(objectWithNamedColors)
    .map(key => {
      const color = objectWithNamedColors[key];
      const resolvedColor = resolveColor(
        color,
        namedColors
      );
      return {
        key,
        value: resolvedColor
      };
    }).reduce((accum: StringDictonary<string>, kv) => {
      accum[kv.key] = kv.value;
      return accum;
    }, {});
}

function buildLAFColors(
  dokiThemeTemplateJson: DokiThemeTemplateDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions
) {
  const lafTemplates = dokiTemplateDefinitions[NAMED_COLOR_TYPE];
  const lafTemplate =
      (dokiThemeTemplateJson.dark ?
        lafTemplates.dark : lafTemplates.light);

  const resolvedLafTemplate =
    resolveTemplate(
      lafTemplate, lafTemplates,
      template => template.ui,
      template => template.extends
    );

  const resolvedNameColors = resolveNamedColors(
    dokiTemplateDefinitions,
    dokiThemeTemplateJson
  );

  return applyNamedColors(
    resolvedLafTemplate,
    resolvedNameColors
  );
}

function resolveNamedColors(
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeTemplateJson: DokiThemeTemplateDefinition
) {
  const colorTemplates = dokiTemplateDefinitions[NAMED_COLOR_TYPE];
  return resolveTemplate(
    dokiThemeTemplateJson,
    colorTemplates,
    template => template.colors,
    // @ts-ignore
    template => template.extends ||
      template.dark !== undefined && (dokiThemeTemplateJson.dark ?
        'dark' : 'light'));
}

function buildHyperTheme(
  dokiThemeDefinition: DokiThemeTemplateDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions
) {
  return {
    colors: buildLAFColors(
      dokiThemeDefinition,
      dokiTemplateDefinitions
    ),
  };
}

function createDokiTheme(
  dokiFileDefinitonPath: string,
  dokiTemplateDefinitions: DokiThemeDefinitions
) {
  const dokiThemeDefinition =
    readJson(dokiFileDefinitonPath);
  try {
    return {
      path: dokiFileDefinitonPath,
      definition: dokiThemeDefinition,
      theme: buildHyperTheme(
        dokiThemeDefinition,
        dokiTemplateDefinitions
      )
    };
  } catch (e) {
    throw new Error(`Unable to build ${dokiThemeDefinition.name}'s theme for reasons ${e}`);
  }
}

const readJson = (jsonPath: string) =>
  JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

type TemplateTypes = StringDictonary<StringDictonary<string>>;

const isTemplate = (filePath: string): boolean =>
  !!getTemplateType(filePath);

const readTemplates = (templatePaths: string[]): TemplateTypes => {
  return templatePaths
    .filter(isTemplate)
    .map(templatePath => {
      return {
        type: getTemplateType(templatePath)!!,
        template: readJson(templatePath)
      };
    })
    .reduce((accum: TemplateTypes, templateRepresentation) => {
      accum[templateRepresentation.type][templateRepresentation.template.name] =
        templateRepresentation.template;
      return accum;
    }, {
      [SYNTAX_TYPE]: {},
      [LAF_TYPE]: {},
      [NAMED_COLOR_TYPE]: {},
    });
};


function readSticker(
  themeDefinitonPath: string,
  themeDefinition: DokiThemeTemplateDefinition,
) {
  const stickerDefinition = themeDefinition.stickers.normal || themeDefinition.stickers.default;
  return `http://doki.assets.acari.io/stickers/vscode/${stickerDefinition}`;
}


const omit = require('lodash/omit');

console.log('Preparing to generate themes.');
walkDir(masterThemeDefinitionDirectoryPath)
  .then(readTemplates)
  .then(dokiTemplateDefinitions => {
    return walkDir(masterThemeDefinitionDirectoryPath)
      .then(files => files.filter(file => file.endsWith('doki.json')))
      .then(dokiFileDefinitionPaths => {
        return {
          dokiTemplateDefinitions,
          dokiFileDefinitionPaths
        };
      });
  })
  .then(templatesAndDefinitions => {
    const {
      dokiTemplateDefinitions,
      dokiFileDefinitionPaths
    } = templatesAndDefinitions;
    return dokiFileDefinitionPaths.map(
      dokiFileDefinitonPath =>
        createDokiTheme(
          dokiFileDefinitonPath,
          dokiTemplateDefinitions
        )
    );
  }).then(dokiThemes => {
    // write things for extension
    const dokiThemeDefinitions = dokiThemes.map(dokiTheme => {
      const dokiDefinition = dokiTheme.definition;
      return {
        themeDefinition: {
          information: omit(dokiDefinition, [
            // 'colors',
            'overrides',
            'ui',
            'icons'
          ]),
          sticker: readSticker(
            dokiTheme.path,
            dokiDefinition
          ),
        }
      };
    });
    const finalDokiDefinitions = JSON.stringify(dokiThemeDefinitions, null, 2);
    fs.writeFileSync(
      path.resolve(repoDirectory, 'src', 'DokiThemeDefinitions.ts'),
      `export default ${finalDokiDefinitions};`);
  })
  .then(() => {
    console.log('Theme Generation Complete!');
  });
