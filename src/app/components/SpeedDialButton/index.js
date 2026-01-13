import React from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { Close, Settings } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const SpeedDialButton = props => {
  const {t} = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [hidden] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SpeedDial
      ariaLabel="SpeedDial openIcon example"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      hidden={hidden}
      icon={<SpeedDialIcon openIcon={<Close/>} icon={<Settings/>}/>}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {props.actions.map((action) => (
        <SpeedDialAction
          key={t(action.name)}
          icon={action.icon()}
          tooltipTitle={t(action.name)}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
}

export default SpeedDialButton;