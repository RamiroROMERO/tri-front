import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { useModalNew } from './useModalNew';
import { InputBox } from 'app/components/InputBox';
import { SearchSelect } from 'app/components/SearchSelect';
import { XDatePicker } from 'app/components/XDatePicker';

export const ModalNew = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, fnGetData, currentItem, listCustomers, listProjects, listProviders} = data;

  const {formState, isFormValid, formValidation, sendForm, onInputChange, fnSaveDocto, onCustomerChange, listProjectFilter} = useModalNew({t, sweetAlerts, setLoading, fnGetData, currentItem, setOpen, listProjects});

  const {id, date, customerId, projectId, providerId, requestor, notes, onsiteContact} = formState;

  const {dateValid, customerIdValid, projectIdValid, providerIdValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={2} md={2}>
          <InputBox
            label={t('table.common.num')}
            name='id'
            value={id}
            onChange={onInputChange}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <XDatePicker
            label={t('table.common.date')}
            name='date'
            value={date}
            onChange={onInputChange}
            type="date"
            error={(sendForm&&dateValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&dateValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={7} md={7}>
          <SearchSelect
            label={t("table.common.customer")}
            name="customerId"
            value={customerId}
            onChange={onCustomerChange}
            optionList={listCustomers}
            error={(sendForm&&customerIdValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&customerIdValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <SearchSelect
            label={t("table.common.project")}
            name="projectId"
            value={projectId}
            onChange={onInputChange}
            optionList={listProjectFilter}
            error={(sendForm&&projectIdValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&projectIdValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <SearchSelect
            label={t("table.common.provider")}
            name="providerId"
            value={providerId}
            onChange={onInputChange}
            optionList={listProviders}
            error={(sendForm&&providerIdValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&providerIdValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputBox
            label={t('table.purchaseOrders.column.onsiteContact')}
            name='onsiteContact'
            value={onsiteContact}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputBox
            label={t('table.purchaseOrders.column.requestor')}
            name='requestor'
            value={requestor}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.common.notes')}
            name='notes'
            value={notes}
            onChange={onInputChange}
            multiline
            maxRows={3}
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