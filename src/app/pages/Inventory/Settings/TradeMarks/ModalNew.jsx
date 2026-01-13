import React from 'react';
import { Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { useModalNew } from './useModalNew';
import { ExitToApp, Save } from '@mui/icons-material';
import { CheckBox, InputBox } from 'app/components';

export const ModalNew = ({ setOpen, data, t }) => {
  const { sweetAlerts, currentItem, fnGetData, setLoading } = data;

  const { formState, onInputChange, formValidation, isFormValid, sendForm, fnSave } = useModalNew({ t, sweetAlerts, currentItem, fnGetData, setOpen, setLoading })

  const { name, status } = formState;
  const { nameValid } = formValidation;

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={8}>
            <InputBox
              label={t('table.common.name')}
              name='name'
              value={name}
              onChange={onInputChange}
              error={(sendForm && nameValid) ? true : false}
              helperText={(sendForm && !isFormValid) && nameValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CheckBox
              label={t("table.common.status")}
              name="status"
              checked={status}
              onChange={onInputChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
          {t("button.save")}
        </Button>
      </DialogActions>
    </>
  )
}
