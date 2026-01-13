import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { useModalNew } from './useModalNew';
import { InputBox } from 'app/components/InputBox';
import { CheckBox } from 'app/components/Checkbox';

export const ModalNew = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, fnGetData, currentItem} = data;

  const {formState, isFormValid, formValidation, sendForm, onInputChange, fnSave} = useModalNew({t, sweetAlerts, setLoading, fnGetData, currentItem, setOpen});

  const {name, phone, email, address, status} = formState;

  const {nameValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
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
            label={t('table.common.phone')}
            name='phone'
            value={phone}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <InputBox
            label={t('table.common.email')}
            name='email'
            value={email}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.customers.column.address')}
            name='address'
            value={address}
            onChange={onInputChange}
            multiline
            maxRows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <CheckBox
            label={t("modal.input.checkbox.status")}
            name="status"
            checked={status}
            onChange={onInputChange}
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
      <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
        {t('button.save')}
      </Button>
    </DialogActions>
  </>
  )
}