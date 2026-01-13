import React from 'react';
import Avatar from "@mui/material/Avatar";
import {Button} from "@mui/material";
import ContentHeader from "app/layouts/shared/headers/ContentHeader";
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from "@mui/material/Typography";

const Header = ({currentItem, t, fnEditUser}) => {
  return (
    <ContentHeader
      avatar={
        <Avatar
          sx={{width: 72, height: 72}}
          alt={currentItem.name}
          // src={`${ASSET_AVATARS}/avatar3.jpg`}
        />
      }
      title={currentItem.name}
      subheader={<Typography fontSize={12} variant={'body1'} color={'inherit'} mt={.5}>{currentItem.userName}</Typography>}
      children={
        <Button
          disableRipple
          variant="text"
          onClick={fnEditUser}
          startIcon={<SettingsIcon/>}
          sx={{
            color: 'inherit',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'transparent'
            }
          }}
        >
          {t('page.profile.settings')}
        </Button>
      }
      sx={{
        position: 'relative',
        zIndex: 1,
        '& .MuiCardHeader-action': {
          alignSelf: 'center'
        }
      }}
    />
  );
};

export default Header;