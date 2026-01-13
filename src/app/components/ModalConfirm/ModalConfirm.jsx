import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';

export const ModalConfirm = ({open, setOpen, message, onSuccess}) => {
  const {t} = useTranslation();

  const propsToDialog = {
    fullWidth:true,
    maxWidth:'xs',
    scroll:"paper",
    disableEscapeKeyDown:true,
    open
   }

   const handleOnSuccess = ()=>{
    setOpen(false);
    onSuccess();
   }

    return (
      <Dialog
      {...propsToDialog}
      >
      <DialogTitle>{t("dialog.confirm.title")}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          {t(message)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          variant="contained"
          color="secondary"
          onClick={()=>setOpen(false)}
          startIcon={<CloseIcon />}

        >
          No
        </Button>
        <Button
          color='primary'
          onClick={handleOnSuccess}
          variant="contained"
          startIcon={<CheckIcon />}
          >
            Si
        </Button>
      </DialogActions>
  </Dialog>
    )
}
