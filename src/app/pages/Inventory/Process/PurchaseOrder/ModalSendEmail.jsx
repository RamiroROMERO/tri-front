import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography } from '@mui/material'
import { ExitToApp, Send } from '@mui/icons-material'
import { useModalSendEmail } from './useModalSendEmail';
import { InputBox } from 'app/components';

export const ModalSendEmail = ({setOpen, data, t}) => {
  const {sweetAlerts, currentItem, setLoading} = data;
  const emailProvider = currentItem?.invProvider?.email || '';
  const ocCode = currentItem?.ocCode || '';
  const purchaseOrderId = currentItem?.id || 0;

  const {formState, formValidation, isFormValid, sendForm, onInputChange, fnSendEmail} = useModalSendEmail({emailProvider, ocCode, purchaseOrderId, sweetAlerts, t, setLoading, setOpen});

  const {sendTo, sendCCTo, subject, message} = formState;

  const {sendToValid, subjectValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={1}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.num')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.id?currentItem.id:''}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.project')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.projectName?currentItem.projectName:''}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.provider')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.providerName?currentItem.providerName:''}`}</Typography>
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.purchaseOrders.sendEmail.sendTo')}
            name='sendTo'
            value={sendTo}
            onChange={onInputChange}
            error={(sendForm&&sendToValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&sendToValid}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.purchaseOrders.sendEmail.sendCCTo')}
            name='sendCCTo'
            value={sendCCTo}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.purchaseOrders.sendEmail.subject')}
            name='subject'
            value={subject}
            onChange={onInputChange}
            error={(sendForm&&subjectValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&subjectValid}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.purchaseOrders.sendEmail.message')}
            name='message'
            value={message}
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
      <Button startIcon={<Send />} onClick={fnSendEmail} color='primary' variant='contained'>
        {t('button.sendEmail')}
      </Button>
    </DialogActions>
  </>
  )
}