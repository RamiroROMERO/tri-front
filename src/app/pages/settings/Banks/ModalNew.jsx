import React from 'react'
import { DialogActions, Button, DialogContent, Grid} from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { CheckBox, InputBox } from 'app/components';
import { useModalNew } from './useModalNew';

const ContentDialog = ({setOpen, data, t})=> {
  const {sweetAlerts, setLoading, fnGetData, currentItem} = data;

  const {formState, isFormValid, formValidation, sendForm, onInputChange, fnSave} = useModalNew({t, sweetAlerts, setLoading, fnGetData, currentItem, setOpen});

  const {name, routingNumber, status} = formState;

  const {nameValid} = formValidation;

  return (
    <React.Fragment>
      <DialogContent dividers>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={7}>
            <InputBox
              label={t('table.common.name')}
              name='name'
              value={name}
              onChange={onInputChange}
              error={(sendForm&&nameValid)?true:false}
              helperText={(sendForm &&!isFormValid)&&nameValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <InputBox
              label={t('table.common.routingNumber')}
              name='routingNumber'
              value={routingNumber}
              onChange={onInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CheckBox
              label={t("modal.input.checkbox.status")}
              name="status"
              checked={status}
              onChange={onInputChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className="dialog-footer">
        <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
          {t("button.save")}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}

export default ContentDialog