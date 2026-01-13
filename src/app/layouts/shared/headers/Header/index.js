import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Stack from "@mui/material/Stack";
import { Breadcrumbs, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import useJumboLayoutSidebar from "@jumbo/hooks/useJumboLayoutSidebar";
import { SIDEBAR_STYLES, SIDEBAR_VARIANTS } from "@jumbo/utils/constants";
import useJumboHeaderTheme from "@jumbo/hooks/useJumboHeaderTheme";
import LocalizationOptions from 'app/shared/JumboCustomizer/components/LocalizationOptions';
import AuthUserDropdown from "app/shared/widgets/AuthUserDropdown";
import Logo from "app/shared/Logo";

const Header = () => {
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const { screenTitle = "home", breadCrumbPath = ['home'] } = useSelector(state => state.generalData);
  const { headerTheme } = useJumboHeaderTheme();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {
        sidebarOptions?.style === SIDEBAR_STYLES.CLIPPED_UNDER_HEADER &&
        <Logo sx={{ mr: 3 }} mode={headerTheme.type ?? "light"} />
      }
      {
        (
          sidebarOptions.style === SIDEBAR_STYLES.CLIPPED_UNDER_HEADER
          || sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY
          || (sidebarOptions.variant === SIDEBAR_VARIANTS.PERSISTENT && !sidebarOptions.open)
        ) &&
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{
            ml: sidebarOptions.style === SIDEBAR_STYLES.CLIPPED_UNDER_HEADER ? -2 : 0,
            mr: 3,
          }}
          onClick={() => setSidebarOptions({ open: !sidebarOptions.open })}
        >
          {
            sidebarOptions?.open ? <MenuOpenIcon /> : <MenuIcon />
          }
        </IconButton>
      }
      <div style={sidebarOptions?.open ? { marginLeft: '1rem' } : {}}>
        <h3 className='screen-title'>{t(`breadcrumb.${screenTitle}`)}</h3>
        <Breadcrumbs aria-label="breadcrumb">
          {breadCrumbPath.map((item, key) => {
            return (
              <Typography
                underline="hover"
                color="inherit"
                key={`breadcrumb.${key}`}
              >
                {t(`breadcrumb.${item}`)}
              </Typography>)
          })}
        </Breadcrumbs>
      </div>
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ ml: "auto" }}>
        <LocalizationOptions />
        {/* <NotificationsDropdown /> */}
        <AuthUserDropdown />
      </Stack>
    </React.Fragment>
  );
};

export default Header;
