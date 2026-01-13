import React, { useState } from 'react';
import Avatar from "@mui/material/Avatar";
import { ListItemIcon, ListItemText, ThemeProvider, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import JumboDdPopover from "@jumbo/components/JumboDdPopover";
import Div from "@jumbo/shared/Div";
import { useJumboTheme } from "@jumbo/hooks";
import { useTranslation } from 'react-i18next';

const AuthUserDropdown = () => {

  const navigate = useNavigate();
  const { theme } = useJumboTheme();
  const {t} = useTranslation();
  const [authUser, setAuthUser ] = useState(JSON.parse(localStorage.getItem('mw-user-data')))

  const onLogout = () => {
    navigate('/login', {
      replace:true
    });
  };

  const fnViewProfile = ()=>{
    navigate(`/settings/users/userProfile/${authUser.id}`, {
      replace:true
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <Avatar
            src={authUser?.image}
            sizes={"small"}
            sx={{ boxShadow: 25, cursor: 'pointer' }}
          />
        }
      >
        <Div sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          p: theme => theme.spacing(2.5),
        }}>
          <Avatar src={authUser?.image} alt={authUser?.name} sx={{ width: 60, height: 60, mb: 2 }} />
          <Typography variant={"h5"}>{authUser?.name}</Typography>
          <Typography variant={"body1"} color="text.secondary">{authUser?.email}</Typography>
        </Div>
        <Divider />
        <nav>
          <List disablePadding sx={{ pb: 1 }}>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PersonOutlineIcon />
              </ListItemIcon>
              <ListItemText onClick={fnViewProfile} primary={t("header.authUser.profile")} sx={{ my: 0 }} />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <EditOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={t("header.authUser.editProfile")} sx={{ my: 0 }} />
            </ListItemButton>
            {/* <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <RepeatOutlinedIcon />
              </ListItemIcon>
              <ListItemText onClick={() => navigate("/samples/content-layout")} primary="Switch User"
                sx={{ my: 0 }} />
            </ListItemButton> */}
            <ListItemButton onClick={onLogout}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={t("header.authUser.logout")} sx={{ my: 0 }} />
            </ListItemButton>
          </List>
        </nav>
      </JumboDdPopover>
    </ThemeProvider>
  );
};

export default AuthUserDropdown;
