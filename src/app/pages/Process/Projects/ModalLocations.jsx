import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent } from '@mui/material'
import { Clear, ExitToApp, Save } from '@mui/icons-material'
import { CheckBox, InputBox, ModalConfirm } from 'app/components';
import { XDataGrid } from 'app/components/XDataGrid';
import useModalLocations from './useModalLocations';

export const ModalLocations = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, dataLocations, fnGetLocations, screenControl} = data;

  const {table, formState, formValidation, isFormValid, sendForm, openMsgDelete, setOpenMsgDelete, onInputChange, fnSaveDocto, fnNewDocto, fnOkDelete} = useModalLocations({t, sweetAlerts, setLoading, dataLocations, fnGetLocations, screenControl});

  const {name, status} = formState;

  const {nameValid} = formValidation;

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDelete
  }

  return (
  <>
    <DialogContent dividers>
      <Card sx={{ mb: 2 }}>
        <CardContent>
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
              <CheckBox
                label={t("table.common.status")}
                name="status"
                checked={status}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} textAlign={'right'}>
              <Button sx={{marginRight: '10px'}} startIcon={<Clear />} onClick={fnNewDocto} color='secondary' variant='contained'>
                {t("button.clear")}
              </Button>
              <Button startIcon={<Save />} onClick={fnSaveDocto} color='primary' variant='contained'>
                {t("button.save")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <XDataGrid {...table}/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
    </DialogActions>
    <ModalConfirm {...propsToModalConfirm}/>
  </>
  )
}