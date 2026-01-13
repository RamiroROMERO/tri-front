import React from 'react'
import { ExitToApp, Save } from '@mui/icons-material';
import { Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { useModalNew } from './useModalNew';
import { CheckBox, InputBox, SearchSelect, SimpleSelect } from 'app/components';
import { useEffect } from 'react';
import { validFloat } from 'app/utils/helpers';

const ModalNew = ({ setOpen, data, t }) => {
  const { sweetAlerts, setLoading, fnGetData, currentItem, listCustomers } = data;

  const { formState, isFormValid, formValidation, sendForm, onInputChange, fnSave, listYears, listWeeks, listEmployees, onCustomerChange, onYearChange, viewWeekYear, listPayrollLineType } = useModalNew({ t, sweetAlerts, setLoading, fnGetData, currentItem, setOpen });

  const { yearId, weekId, customerId, employeeId, qty, price, total, description, isRecurring, status, hasPayroll, payrollRegularRate, payrollOvertimeRate, payrollLineTypeId } = formState;

  const { weekIdValid, customerIdValid, employeeIdValid, qtyValid, priceValid, totalValid } = formValidation;

  useEffect(() => {
    const currentTotal = validFloat(qty) * validFloat(price);
    onInputChange({ target: { name: 'total', value: validFloat(currentTotal, 2) } });
  }, [qty, price])


  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={12} md={12}>
            <SearchSelect
              label={t("table.common.customer")}
              name="customerId"
              value={customerId}
              onChange={onCustomerChange}
              optionList={listCustomers}
              error={(sendForm && customerIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && customerIdValid}
              required
            />
          </Grid>
        </Grid>
        <Grid sx={{ mt: '5px', display: viewWeekYear ? 'flex' : 'none' }} container spacing={3} direction='row'>
          <Grid item xs={12} sm={3} md={3}>
            <SimpleSelect
              label={t("table.common.year")}
              name="yearId"
              value={yearId}
              onChange={onYearChange}
              optionList={listYears}
            />
          </Grid>
          <Grid item xs={12} sm={9} md={9}>
            <SearchSelect
              label={t("table.common.week")}
              name="weekId"
              value={weekId}
              onChange={onInputChange}
              optionList={listWeeks}
              error={(sendForm && weekIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && weekIdValid}
              required
            />
          </Grid>
        </Grid>
        <Grid sx={{ mt: '5px' }} container spacing={3} direction='row'>
          <Grid item xs={12} sm={12} md={12}>
            <SearchSelect
              label={t("table.common.employee")}
              name="employeeId"
              value={employeeId}
              onChange={onInputChange}
              optionList={listEmployees}
              error={(sendForm && employeeIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && employeeIdValid}
              required
            />
          </Grid>
        </Grid>
        <Grid sx={{ mt: '5px' }} container spacing={3} direction='row'>
          <Grid item xs={12}>
            <CheckBox
              label={t("modal.input.checkbox.hasPayroll")}
              name="hasPayroll"
              checked={hasPayroll}
              onChange={onInputChange}
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          direction='row'
          style={{ display: hasPayroll ? 'flex' : 'none' }}
          sx={{ mt: '5px' }}
        >
          <Grid item xs={12} sm={4}>
            <InputBox
              label={t("table.employees.column.rateByHour")}
              name="payrollRegularRate"
              value={payrollRegularRate}
              onChange={onInputChange}
              type='number'
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputBox
              label={t("table.missingtime.textField.overtimeRate")}
              name="payrollOvertimeRate"
              value={payrollOvertimeRate}
              onChange={onInputChange}
              type='number'
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SimpleSelect
              label={t("payrollLineTypes.modal.title")}
              name="payrollLineTypeId"
              value={payrollLineTypeId}
              onChange={onInputChange}
              optionList={listPayrollLineType}
            />
          </Grid>
        </Grid>
        <Grid sx={{ mt: '5px' }} container spacing={3} direction='row'>
          <Grid item xs={12}>
            <InputBox
              label={t("table.common.description")}
              name="description"
              value={description}
              onChange={onInputChange}
              multiline
              maxsRows={3}
            />
          </Grid>
        </Grid>
        <Grid sx={{ mt: '5px' }} container spacing={3} direction='row'>
          <Grid item xs={12} sm={4} md={4}>
            <InputBox
              label={t("table.common.qty")}
              name="qty"
              value={qty}
              onChange={onInputChange}
              error={(sendForm && qtyValid) ? true : false}
              helperText={(sendForm && !isFormValid) && qtyValid}
              required
              type='number'
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <InputBox
              label={t("table.common.price")}
              name="price"
              value={price}
              onChange={onInputChange}
              error={(sendForm && priceValid) ? true : false}
              helperText={(sendForm && !isFormValid) && priceValid}
              required
              type='number'
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <InputBox
              label={t("table.common.value")}
              name="total"
              value={total}
              onChange={onInputChange}
              error={(sendForm && totalValid) ? true : false}
              helperText={(sendForm && !isFormValid) && totalValid}
              required
              type='number'
              disabled
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <CheckBox
          label={t("modal.input.checkbox.isPaymentRecurring")}
          name="isRecurring"
          checked={isRecurring}
          onChange={onInputChange}
        />
        <CheckBox
          label={t("modal.input.checkbox.status")}
          name="status"
          checked={status}
          onChange={onInputChange}
        />
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

export default ModalNew