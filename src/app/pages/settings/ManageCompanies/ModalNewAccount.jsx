import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { useModalNewAccount } from './useModalNewAccount';
import { CheckBox, InputBox, SimpleSelect } from 'app/components';

export const ModalNewAccount = ({setOpen, data, t}) => {
  const {companyId, setLoading, sweetAlerts, currentItem, fnGetData} = data;

  const {formState, formValidation, isFormValid, sendForm, listType, onInputChange, fnSaveDocto} = useModalNewAccount({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem, companyId});

  const {name, email, consumerKey, consumerSecret, type, status} = formState;

  const {nameValid, emailValid, consumerKeyValid, consumerSecretValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <InputBox
            label={t('table.manageCompanies.textField.name')}
            name='name'
            value={name}
            onChange={onInputChange}
            error={(sendForm&&nameValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&nameValid}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.manageCompanies.textField.email')}
            name='email'
            value={email}
            onChange={onInputChange}
            error={(sendForm&&emailValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&emailValid}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.manageCompanies.column.consumerKey')}
            name='consumerKey'
            value={consumerKey}
            onChange={onInputChange}
            error={(sendForm&&consumerKeyValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&consumerKeyValid}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.manageCompanies.column.consumerSecret')}
            name='consumerSecret'
            value={consumerSecret}
            onChange={onInputChange}
            error={(sendForm&&consumerSecretValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&consumerSecretValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <SimpleSelect
            label={t("table.categories.column.type")}
            name="type"
            value={type}
            onChange={onInputChange}
            optionList={listType}
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
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
      <Button startIcon={<Save />} onClick={fnSaveDocto} color='primary' variant='contained'>
        {t('button.save')}
      </Button>
    </DialogActions>
  </>
  )
}