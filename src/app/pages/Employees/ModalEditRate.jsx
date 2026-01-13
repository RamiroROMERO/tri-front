import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { SearchSelect } from 'app/components/SearchSelect';
import { useModalEditRate } from './useModalEditRate';
import { ContainerWithLabel } from 'app/components/ContainerWithLabel';
import { InputBox } from 'app/components/InputBox';
import { CheckBox } from 'app/components/Checkbox';

export const ModalEditRate = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, currentItemRate, employeeId, classificationId, fnGetData, customerList} = data;

  const {formState, formValidation, isFormValid, sendForm, onInputChange, onPercOtPayrollChange, onPercOtInvoiceChange, onCustomerChange, fnSave} = useModalEditRate({t, sweetAlerts, setLoading, currentItemRate, employeeId, classificationId, fnGetData, setOpen, customerList});

  const {customerId, rate, percOtPayroll, rateOvertime, rateInvoice, percOtInvoice, rateInvoiceOvertime, payPerdiem, invoicePerdiem, fixedPerdiem, fixedPerdiem2, status, delRecord} = formState;

  const {customerIdValid, rateValid, rateInvoiceValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <SearchSelect
            label={t("table.common.customer")}
            name="customerId"
            value={customerId}
            onChange={onCustomerChange}
            optionList={customerList}
            error={(sendForm&&customerIdValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&customerIdValid}
            required
            disabled={(currentItemRate && currentItemRate.id) ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <ContainerWithLabel label={t("dialog.classifications.title.payroll")}>
            <Grid container spacing={3} direction='row'>
              <Grid item xs={12} sm={4}>
                <InputBox
                  label={t('table.activeEmployees.column.rate')}
                  name='rate'
                  value={rate}
                  onChange={onInputChange}
                  error={(sendForm&&rateValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&rateValid}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputBox
                  label={t('table.activeEmployees.column.percentOT')}
                  name='percOtPayroll'
                  value={percOtPayroll}
                  onChange={onPercOtPayrollChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputBox
                  label={t('table.payrolls.column.overtimeRate')}
                  name='rateOvertime'
                  value={rateOvertime}
                  onChange={onInputChange}
                />
              </Grid>
            </Grid>
          </ContainerWithLabel>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction='row'>
        <Grid item xs={12} sm={12}>
          <ContainerWithLabel label={t("dialog.classifications.title.invoice")}>
            <Grid container spacing={3} direction='row'>
              <Grid item xs={12} sm={4}>
                <InputBox
                  label={t('table.activeEmployees.column.rate')}
                  name='rateInvoice'
                  value={rateInvoice}
                  onChange={onInputChange}
                  error={(sendForm&&rateInvoiceValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&rateInvoiceValid}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputBox
                  label={t('table.activeEmployees.column.percentOT')}
                  name='percOtInvoice'
                  value={percOtInvoice}
                  onChange={onPercOtInvoiceChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputBox
                  label={t('table.payrolls.column.overtimeRate')}
                  name='rateInvoiceOvertime'
                  value={rateInvoiceOvertime}
                  onChange={onInputChange}
                />
              </Grid>
            </Grid>
          </ContainerWithLabel>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction='row'>
        <Grid item xs={12} sm={6}>
          <InputBox
            label={t('table.employees.column.payPerdiem')}
            name='payPerdiem'
            value={payPerdiem}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputBox
            label={t('table.employees.column.invoicePerdiem')}
            name='invoicePerdiem'
            value={invoicePerdiem}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CheckBox
            label={t("table.employees.column.hasFixedPerDiem")}
            name="fixedPerdiem"
            checked={fixedPerdiem}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CheckBox
            label={t("table.employees.column.hasFixedPerDiemInvoice")}
            name="fixedPerdiem2"
            checked={fixedPerdiem2}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CheckBox
            label={t("modal.input.checkbox.status")}
            name="status"
            checked={status}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CheckBox
            label={t("table.employees.column.deleted")}
            name="delRecord"
            checked={delRecord}
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