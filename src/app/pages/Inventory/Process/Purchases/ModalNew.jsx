import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { useModalNew } from './useModalNew';
import { InputBox } from 'app/components/InputBox';
import { RadioButtonsGroup } from 'app/components/RadioButtonsGroup';
import { SearchSelect } from 'app/components/SearchSelect';
import { XDatePicker } from 'app/components/XDatePicker';

export const ModalNew = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, fnGetData, currentItem, listCustomers, listProjects, listProviders} = data;

  const {formState, formValidation, isFormValid, onInputChange, sendForm, fnSaveDocto, onBulkForm, listProjectFilter, onCustomerChange} = useModalNew({t, sweetAlerts, setLoading, fnGetData, currentItem, setOpen, listProjects});

  const {noPurchase, dateIn, dateOut, paymentType, customerId, projectId, providerId, orderId, notes} = formState;

  const {noPurchaseValid, dateInValid, dateOutValid, paymentTypeValid, customerIdValid, projectIdValid, providerIdValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={3} direction={'row'}>
            <Grid item xs={12} sm={4} md={3}>
              <InputBox
                label={t('table.purchaseOrders.column.noPurchase')}
                name='noPurchase'
                value={noPurchase}
                onChange={onInputChange}
                error={(sendForm&&noPurchaseValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&noPurchaseValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={8} md={9}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={3} direction={'row'}>
            <Grid item xs={12}>
              <InputBox
                label={t('table.purchases.column.orderCode')}
                name='orderId'
                value={orderId}
                onChange={onInputChange}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <XDatePicker
                label={t('table.common.dateIn')}
                name='dateIn'
                value={dateIn}
                onChange={onInputChange}
                type="date"
                error={(sendForm&&dateInValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&dateInValid}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <XDatePicker
                label={t('table.common.dateOut')}
                name='dateOut'
                value={dateOut}
                onChange={onInputChange}
                type="date"
                error={(sendForm&&dateOutValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&dateOutValid}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <RadioButtonsGroup
                label={t('table.common.paymentType')}
                name='paymentType'
                value={paymentType}
                onChange={onInputChange}
                row
                options={[
                  {id: 1, name: t('table.common.paymentType.cash')},
                  {id: 2, name: t('table.common.paymentType.credit')}
                ]}
                error={(sendForm&&paymentTypeValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&paymentTypeValid}
                required
              />
            </Grid>
          </Grid>
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