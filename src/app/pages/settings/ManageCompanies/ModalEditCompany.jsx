import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { useModalEditCompany } from './useModalEditCompany';
import { InputBox } from 'app/components';

export const ModalEditCompany = ({setOpen, data, t}) => {
  const {dataCompany, setLoading, sweetAlerts, fnGetDataCompany} = data;

  const {formState, formValidation, isFormValid, sendForm, onInputChange, fnSaveDocto} = useModalEditCompany({t, sweetAlerts, setLoading, fnGetDataCompany, setOpen, dataCompany});

  const {dni, name, address1, address2, phone, website, emailInfo, contactName, contactPhone, contactEmail} = formState;

  const {nameValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={4}>
          <InputBox
            label={t('table.manageCompanies.textField.dni')}
            name='dni'
            value={dni}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <InputBox
            label={t('table.manageCompanies.textField.name')}
            name='name'
            value={name}
            onChange={onInputChange}
            error={(sendForm&&nameValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&nameValid}
            required
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.manageCompanies.textField.address')}
            name='address1'
            value={address1}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.manageCompanies.textField.address2')}
            name='address2'
            value={address2}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputBox
            label={t('table.manageCompanies.textField.phone')}
            name='phone'
            value={phone}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputBox
            label={t('table.manageCompanies.textField.website')}
            name='website'
            value={website}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputBox
            label={t('table.manageCompanies.textField.emailInfo')}
            name='emailInfo'
            value={emailInfo}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputBox
            label={t('table.manageCompanies.textField.contactName')}
            name='contactName'
            value={contactName}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputBox
            label={t('table.manageCompanies.textField.contactPhone')}
            name='contactPhone'
            value={contactPhone}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputBox
            label={t('table.manageCompanies.textField.contactEmail')}
            name='contactEmail'
            value={contactEmail}
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