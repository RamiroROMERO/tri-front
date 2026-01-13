import React from 'react'
import { Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { CheckBox, InputBox, SimpleSelect } from 'app/components';
import { useModalNew } from './useModalNew';

const ModalNew = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, fnGetData, currentItem, listTypes} = data;

  const {formState, isFormValid, formValidation, sendForm, onInputChange, fnSave} = useModalNew({t, sweetAlerts, setLoading, fnGetData, currentItem, setOpen});

  const {name, type, isBillable, status} = formState;

  const {nameValid, typeValid} = formValidation;

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction='row'>
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
          <Grid item xs={12} sm={4}>
            <SimpleSelect
              label={t("table.deductionsTypes.column.type")}
              name="type"
              value={type}
              onChange={onInputChange}
              optionList={listTypes}
              error={(sendForm&&typeValid)?true:false}
              helperText={(sendForm &&!isFormValid)&&typeValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CheckBox
              label={t("table.deductionsTypes.column.isBillable")}
              name="isBillable"
              checked={isBillable}
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
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