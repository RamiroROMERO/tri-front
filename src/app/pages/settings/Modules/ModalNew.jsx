import React from 'react'
import { ExitToApp, Save } from '@mui/icons-material'
import { Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { InputBox } from 'app/components/InputBox'
import { useModalNew } from './useModalNew'

const ModalNew = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, fnGetData, currentItem} = data;

  const {formState, formValidation, isFormValid, sendForm, onInputChange, fnSave} = useModalNew({t, sweetAlerts, setLoading, fnGetData, currentItem, setOpen});

  const {name} = formState;

  const {nameValid} = formValidation;

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12}>
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