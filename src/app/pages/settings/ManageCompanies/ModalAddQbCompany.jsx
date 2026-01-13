import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { CheckBox, InputBox, XDatePicker } from 'app/components';
import { useModalAddQbCompany } from './useModalAddQbCompany';

export const ModalAddQbCompany = ({setOpen, data, t}) => {
  const {currentItemQb, accountId, setLoading, sweetAlerts, fnGetDataQbCompany} = data;

  const {formState, formValidation, isFormValid, sendForm, onInputChange, fnSaveDocto} = useModalAddQbCompany({t, sweetAlerts, setLoading, fnGetDataQbCompany, setOpen, currentItemQb, accountId});

  const {name, realmId, refreshToken, expireToken, hasInvoice, hasChecks, status} = formState;

  const {nameValid, realmIdValid, refreshTokenValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <InputBox
            label={t('table.manageCompanies.textField.companyName')}
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
            label={t('table.manageCompanies.textField.companyId')}
            name='realmId'
            value={realmId}
            onChange={onInputChange}
            error={(sendForm&&realmIdValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&realmIdValid}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.manageCompanies.textField.companyToken')}
            name='refreshToken'
            value={refreshToken}
            onChange={onInputChange}
            error={(sendForm&&refreshTokenValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&refreshTokenValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <XDatePicker
            label={t("table.manageCompanies.textField.companyExpire")}
            name="expireToken"
            value={expireToken}
            onChange={onInputChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} direction={'row'} mt={1}>
        <Grid item xs={12} sm={4}>
          <CheckBox
            label={t("modal.input.checkbox.hasInvoice")}
            name="hasInvoice"
            checked={hasInvoice}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CheckBox
            label={t("modal.input.checkbox.hasChecks")}
            name="hasChecks"
            checked={hasChecks}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CheckBox
            label={t("table.manageCompanies.textField.companyStatus")}
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