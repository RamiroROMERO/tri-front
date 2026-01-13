import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent } from '@mui/material'
import { Clear, ExitToApp, Save } from '@mui/icons-material'
import { XDataGrid } from 'app/components/XDataGrid';
import { InputBox } from 'app/components/InputBox';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { useModalContacts } from './useModalContacts';

export const ModalContacts = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, currentItem} = data;
  const customerName = currentItem.name?currentItem.name:'';
  const customerId = currentItem?.id || 0;

  const {table, formState, formValidation, isFormValid, sendForm, openMsgDelete, setOpenMsgDelete, onInputChange, fnSave, fnNewDocto, fnOkDelete} = useModalContacts({t, sweetAlerts, setLoading, customerId});

  const {name, phone, email} = formState;

  const {nameValid, phoneValid} = formValidation;

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDelete
  }

  return (
  <>
    <DialogContent dividers>
      <Card sx={{mb: 2}}>
        <CardContent>
          <Grid container spacing={3} direction='row'>
            <Grid item xs={12} sm={6} lg={5}>
              <InputBox
                label={t('table.common.customer')}
                name='customerName'
                value={customerName}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={7}>
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
            <Grid item xs={12} sm={5} lg={4}>
              <InputBox
                label={t('table.common.phone')}
                name='phone'
                value={phone}
                onChange={onInputChange}
                error={(sendForm&&phoneValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&phoneValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={7} lg={5}>
              <InputBox
                label={t('table.common.email')}
                name='email'
                value={email}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} textAlign={'right'}>
              <Button sx={{marginRight: '10px'}} startIcon={<Clear />} onClick={fnNewDocto} color='secondary' variant='contained'>
                {t("button.clear")}
              </Button>
              <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
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