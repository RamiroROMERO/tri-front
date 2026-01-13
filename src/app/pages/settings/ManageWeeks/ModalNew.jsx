import React from 'react'
import { Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { CheckBox, InputBox, XDatePicker } from 'app/components';
import { useModalNew } from './useModalNew';

const ModalNew = ({ setOpen, data, t }) => {
  const { sweetAlerts, setLoading, fnGetData, currentItem, yearFilter } = data;

  const { formState, isFormValid, formValidation, sendForm, onInputChange, fnSave } = useModalNew({ t, sweetAlerts, setLoading, fnGetData, currentItem, setOpen, yearFilter });

  const { year, noWeek, startDate, endDate, status } = formState;

  const { yearValid, noWeekValid, startDateValid, endDateValid } = formValidation;

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <InputBox
              label={t('table.manageWeeks.column.noWeek')}
              name='noWeek'
              value={noWeek}
              onChange={onInputChange}
              error={(sendForm && noWeekValid) ? true : false}
              helperText={(sendForm && !isFormValid) && noWeekValid}
              required
              type='number'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <XDatePicker
              label={t("table.manageWeeks.column.endDate")}
              name="endDate"
              value={endDate}
              onChange={onInputChange}
              type="date"
              error={(sendForm && endDateValid) ? true : false}
              helperText={(sendForm && !isFormValid) && endDateValid}
              required
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