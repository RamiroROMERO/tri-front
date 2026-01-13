import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { useModalNew } from './useModalNew';
import { InputBox, SimpleSelect } from 'app/components';

export const ModalChangeStatus = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, fnGetProjects, fnGetListCustomers, currentItem, customerId, listStatus, screenControl} = data;

  const {formState, formValidation, isFormValid, sendForm, onInputChange, fnSave} = useModalNew({t, sweetAlerts, setLoading, fnGetProjects, fnGetListCustomers, customerId, setOpen, currentItem, screenControl});

  const {name, code, statusId} = formState;

  const {statusIdValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={5}>
          <InputBox
            label={t('table.projects.column.code')}
            name='code'
            value={code}
            onChange={onInputChange}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <InputBox
            label={t('table.projects.column.name')}
            name='name'
            value={name}
            onChange={onInputChange}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <SimpleSelect
            label={t("table.employees.column.status")}
            name="statusId"
            value={statusId}
            onChange={onInputChange}
            optionList={listStatus}
            error={(sendForm&&statusIdValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&statusIdValid}
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
        {t('button.save')}
      </Button>
    </DialogActions>
  </>
  )
}