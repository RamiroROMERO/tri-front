import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { InputBox, SearchSelect, XDatePicker } from 'app/components';
import { useModalGenerateYear } from './useModalGenerateYear';

export const ModalGenerateYear = ({ setOpen, data, t }) => {
  const { sweetAlerts, setLoading, fnGetData, yearFilter, customerFilter, listCustomers } = data;

  const { formState, isFormValid, formValidation, sendForm, onInputChange, fnSave } = useModalGenerateYear({ t, sweetAlerts, setLoading, fnGetData, yearFilter, customerFilter, setOpen });

  const { customerId, year, startDate } = formState;

  const { yearValid, startDateValid } = formValidation;

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} sm={6}>
            <SearchSelect
              label={t("table.common.customer")}
              name="customerId"
              value={customerId}
              onChange={onInputChange}
              optionList={listCustomers}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <InputBox
              label={t('table.common.year')}
              name='year'
              value={year}
              onChange={onInputChange}
              error={(sendForm && yearValid) ? true : false}
              helperText={(sendForm && !isFormValid) && yearValid}
              required
              type='number'
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <XDatePicker
              label={t("table.manageWeeks.column.startDate")}
              name="startDate"
              value={startDate}
              onChange={onInputChange}
              type="date"
              error={(sendForm && startDateValid) ? true : false}
              helperText={(sendForm && !isFormValid) && startDateValid}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
          {t('button.save')}
        </Button>
      </DialogActions>
    </>
  )
}