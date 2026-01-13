import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { InputBox, SearchSelect, XDatePicker } from 'app/components';
import { ExitToApp, Save } from '@mui/icons-material'
import { useModalNew } from './useModalNew';

export const ModalNew = ({setOpen, data, t}) => {
  const {currentItem, listEmployees, sweetAlerts, setLoading, fnGetData, screenControl} = data;

  const {formState, formValidation, isFormValid, sendForm, onInputChange, onValCuoteChange, fnSaveDocto} = useModalNew({t, currentItem, sweetAlerts, setLoading, fnGetData, setOpen, screenControl});

  const {date, employeeId, value, valCuote, noCuotes, dateFirstCuote, description} = formState;

  const {dateValid, employeeIdValid, valueValid, valCuoteValid, dateFirstCuoteValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={6} md={4}>
          <XDatePicker
            label={t('table.common.date')}
            name='date'
            value={date}
            onChange={onInputChange}
            error={(sendForm&&dateValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&dateValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <SearchSelect
            label={t("table.common.employee")}
            name="employeeId"
            value={employeeId}
            onChange={onInputChange}
            optionList={listEmployees}
            error={(sendForm&&employeeIdValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&employeeIdValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputBox
            label={t("table.loans.value")}
            name="value"
            value={value}
            onChange={onInputChange}
            error={(sendForm&&valueValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&valueValid}
            type='number'
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputBox
            label={t("table.loans.valCuote")}
            name="valCuote"
            value={valCuote}
            onChange={onValCuoteChange}
            error={(sendForm&&valCuoteValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&valCuoteValid}
            type='number'
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputBox
            label={t("table.loans.cuotes")}
            name="noCuotes"
            value={noCuotes}
            onChange={onInputChange}
            type='number'
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <XDatePicker
            label={t('table.common.dateFirstCuote')}
            name='dateFirstCuote'
            value={dateFirstCuote}
            onChange={onInputChange}
            error={(sendForm&&dateFirstCuoteValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&dateFirstCuoteValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <InputBox
            label={t("table.common.description")}
            name="description"
            value={description}
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