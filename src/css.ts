import { DokiTheme } from "./themeTemp";


export const constructCSS = (dokiTheme: DokiTheme): string => {
  const background ='';
  const header ='';
  const activeTab ='';
  const tab ='';
  const secondary = '';
  
  const tabContent = '';
  const imagePath = '';


  return `
  .terms_terms {
    background: url("file://${imagePath}") center;
    background-size: cover;
  }
  .header_shape, .header_appTitle {
    color: ${header};
  }
  .header_header, .header_windowHeader {
    background-color: ${background} !important;
  }
  .hyper_main {
    background-color: ${background};
  }
  .tab_textActive .tab_textInner::before {
    content: url("file://${tabContent}");
    position: absolute;
    right: 0;
    top: -4px;
  }
  .tabs_nav .tabs_list {
    border-bottom: 0;
  }
  .tabs_nav .tabs_title,
  .tabs_nav .tabs_list .tab_tab {
    color: ${secondary};
    border: 0;
  }
  .tab_icon {
    color: ${background};
    width: 15px;
    height: 15px;
  }
  .tab_icon:hover {
    background-color: ${background};
  }
  .tab_shape {
    color: ${secondary};
    width: 7px;
    height: 7px;
  }
  .tab_shape:hover {
    color: ${secondary};
  }
  .tab_active {
    background-color: ${activeTab};
  }
  .tabs_nav .tabs_list .tab_tab:not(.tab_active) {
    background-color: ${tab};
  }
  .tabs_nav .tabs_list {
    color: ${background};
  }
  .tab_tab::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: ${secondary};
    transform: scaleX(0);
    transition: none;
  }
  .tab_tab.tab_active::before {
    transform: scaleX(1);
    transition: all 400ms cubic-bezier(0.0, 0.0, 0.2, 1)
  }
  .terms_terms .terms_termGroup .splitpane_panes .splitpane_divider {
    background-color: ${secondary} !important;
  }
  `
}