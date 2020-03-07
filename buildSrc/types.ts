export interface DokiThemeDefinitions {
  [key: string]: any;
}

export interface DokiThemeTemplateDefinition {
  id: string;
  name: string;
  displayName: string;
  dark: boolean;
  author: string;
  group: string;
  product?: 'community' | 'ultimate';
  editorScheme: EditorScheme;
  stickers: Stickers;
  overrides: Overrides;
  colors: StringDictonary<string>;
  ui: StringDictonary<string>;
  icons: StringDictonary<string>;

}
export interface StringDictonary<T> {
  [key: string]: T;
}

export interface Overrides {
  editorScheme: HasColors;
}
export interface HasColors {
  colors: StringDictonary<string>;
}
export interface EditorScheme {
  type: string;
  name?: string;
  file?: string;
}

export interface Stickers {
  default: string;
  secondary?: string;
  normal?: string;
}
