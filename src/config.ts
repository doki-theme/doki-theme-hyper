export interface DokiThemeConfig {
  theme: string;
  showSticker: boolean;
}

export const DEFAULT_CONFIGURATION: DokiThemeConfig = {
  theme: 'Ryuko',
  showSticker: true,
}

export const extractConfig =
  (parentConfig: any): DokiThemeConfig =>
    parentConfig.dokiTheme ||
    DEFAULT_CONFIGURATION
