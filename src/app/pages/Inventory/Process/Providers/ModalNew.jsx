import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { useModalNew } from './useModalNew';
import { ContainerWithLabel } from 'app/components/ContainerWithLabel';
import { InputBox } from 'app/components/InputBox';
import { CheckBox } from 'app/components/Checkbox';

export const ModalNew = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, fnGetData, currentItem} = data;

  const {formState, isFormValid, formValidation, sendForm, onInputChange, fnSaveDocto} = useModalNew({t, sweetAlerts, setLoading, fnGetData, currentItem, setOpen});

  const {dni, name, phone, email, address, paymentConditions, creditDays, shipDays, contactName, contactPhone, status} = formState;

  const {dniValid, nameValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} md={8}>
          <ContainerWithLabel label={t("dialog.providers.title.generalInfo")}>
            <Grid container spacing={3} direction={'row'}>
              <Grid item xs={12} sm={4}>
                <InputBox
                  label={t('table.providers.column.dni')}
                  name='dni'
                  value={dni}
                  onChange={onInputChange}
                  error={(sendForm&&dniValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&dniValid}
                  required
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={8}>
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
                  label={t('table.providers.column.phone')}
                  name='phone'
                  value={phone}
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={7}>
                <InputBox
                  label={t('table.providers.column.email')}
                  name='email'
                  value={email}
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputBox
                  label={t('table.providers.column.address')}
                  name='address'
                  value={address}
                  onChange={onInputChange}
                  multiline
                  maxRows={3}
                />
              </Grid>
            </Grid>
          </ContainerWithLabel>
        </Grid>
        <Grid item xs={12} md={4}>
          <ContainerWithLabel label={t("dialog.providers.title.contactInfo")}>
            <Grid container spacing={3} direction={'row'}>
              <Grid item xs={12}>
                <InputBox
                  label={t('table.common.name')}
                  name='contactName'
                  value={contactName}
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputBox
                  label={t('table.providers.column.phone')}
                  name='contactPhone'
                  value={contactPhone}
                  onChange={onInputChange}
                />
              </Grid>
            </Grid>
          </ContainerWithLabel>
          <Grid container spacing={3} direction={'row'} textAlign={'right'}>
              <Grid item xs={12}>
                <CheckBox
                  label={t("modal.input.checkbox.status")}
                  name="status"
                  checked={status}
                  onChange={onInputChange}
                />
              </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={6}>
          <InputBox
            label={t('table.providers.column.paymentConditions')}
            name='paymentConditions'
            value={paymentConditions}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <InputBox
            label={t('table.providers.column.creditDays')}
            name='creditDays'
            value={creditDays}
            onChange={onInputChange}
            type='number'
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <InputBox
            label={t('table.providers.column.shipDays')}
            name='shipDays'
            value={shipDays}
            onChange={onInputChange}
            type='number'
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