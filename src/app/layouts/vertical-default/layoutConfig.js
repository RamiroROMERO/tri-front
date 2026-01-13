import {
    SIDEBAR_ANCHOR_POSITIONS,
    SIDEBAR_SCROLL_TYPES,
    SIDEBAR_STYLES,
    SIDEBAR_VARIANTS,
    SIDEBAR_VIEWS
} from "@jumbo/utils/constants/layout";

const screenWidth = window.innerWidth;

const layoutConfig = {
    sidebar: {
        open: screenWidth > 900 ? true : false,
        hide: false,
        variant: screenWidth > 900 ? SIDEBAR_VARIANTS.PERSISTENT : SIDEBAR_VARIANTS.TEMPORARY,
        style: SIDEBAR_STYLES.FULL_HEIGHT,
        view: SIDEBAR_VIEWS.FULL,
        scrollType: SIDEBAR_SCROLL_TYPES.FIXED,
        anchor: SIDEBAR_ANCHOR_POSITIONS.LEFT,
    },
    header: {
        hide: false,
        fixed: true,
    },
    footer: {
        hide: false,
    },
    root: {
    },
    content: {
        sx: {
            py: 4,
            px: { lg: 6, xs: 4 }
        }
    }
};

export default layoutConfig;