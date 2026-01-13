import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography, Card, CardContent } from '@mui/material'
import { Check, ExitToApp } from '@mui/icons-material'
import { XDataGrid } from 'app/components/XDataGrid';
import { InputBox } from 'app/components/InputBox';
import { ContainerWithLabel } from 'app/components/ContainerWithLabel';
import { useModalValuePay } from './useModalValuePay';
import { formatNumber } from 'app/utils/helpers';

export const ModalValuePay = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, currentItemDeta, providerName, providerId, fnGetData, fnGetDataDetail} = data;

  const {table, formState, formValidation, isFormValid, sendForm, onInputChange, fnSave, valuePending} = useModalValuePay({t, setLoading, currentItemDeta, providerId, sweetAlerts, fnGetData, fnGetDataDetail});

  const {value} = formState;

  const {valueValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={2} direction='row'>
        <Grid item xs={12} sm={7}>
          <Grid container spacing={2} direction='row'>
            <Grid item xs={12}>
              <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.provider')}</Typography>
              <Typography variant={"h5"} mb={2.25}>{`${providerName}`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.accountsPayable.detail.noInvoice')}</Typography>
              <Typography variant={"h5"} mb={2.25}>{`${currentItemDeta.purchaseNumber}`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.accountsPayable.detail.valuePending')}</Typography>
              <Typography variant={"h5"} mb={2.25}>{`${formatNumber(valuePending, '$ ', 2)}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={5}>
          <ContainerWithLabel label={t('table.accountsPayable.paymentsApplied.title1')}>
            <Grid container spacing={2} direction='row'>
              <Grid item xs={6} sm={12}>
                <InputBox
                  label={t('table.common.value')}
                  name='value'
                  value={value}
                  onChange={onInputChange}
                  error={(sendForm && valueValid) ? true : false}
                  helperText={(sendForm && !isFormValid) && valueValid}
                  type='number'
                  required
                />
              </Grid>
              <Grid item xs={6} sm={12} textAlign={'right'}>
                <Button startIcon={<Check />} onClick={fnSave} color='primary' variant='contained'>
                  {t("button.apply")}
                </Button>
              </Grid>
            </Grid>
          </ContainerWithLabel>
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <XDataGrid {...table}/>
        </CardContent>
      </Card>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
    </DialogActions>
  </>
  )
}