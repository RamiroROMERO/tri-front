import { DENSITIES, LAYOUT_CONTAINER_STYLES, POSITION_TYPES } from "@jumbo/utils/constants/layout";
import { mainTheme } from "../themes/main/default";
import { headerTheme } from "../themes/header/default";
import { sidebarTheme } from "../themes/sidebar/dark";
import { footerTheme } from "../themes/footer/default";

// const screenWidth = window.innerWidth

const config = {
  activeLayout: "vertical-default",
  containerStyle: LAYOUT_CONTAINER_STYLES.FLUID,
  useImagePlaceHolder: false,
  theme: {
    main: mainTheme,
    header: {
      ...mainTheme,
      ...headerTheme
    },
    sidebar: {
      ...mainTheme,
      ...sidebarTheme,
    },
    footer: {
      ...mainTheme,
      ...footerTheme,
    }
  },
  defaultContentLayout: {
    base: {
      density: DENSITIES.STANDARD,
    },
    root: {
      container: LAYOUT_CONTAINER_STYLES.FLUID,
      sx: {}, //for content layout wrapper
    },
    wrapper: {
      sx: {}
    },
    sidebar: {
      type: POSITION_TYPES.DEFAULT,
      width: 250,
      minWidth: 80,
      open: window.innerWidth <= 900 ? false : true,
      sx: {},
    },
    main: {
      sx: {}
    },
    header: {
      type: POSITION_TYPES.DEFAULT,
      spreadOut: true,
      sx: {},
    },
    content: {
      sx: {},
    },
    footer: {
      type: POSITION_TYPES.DEFAULT,
      spreadOut: true,
      sx: {},
    }
  }
};

export { config };
