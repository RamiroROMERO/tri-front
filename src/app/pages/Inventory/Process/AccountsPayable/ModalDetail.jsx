import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent, Typography } from '@mui/material'
import { ExitToApp } from '@mui/icons-material'
import { useModalDetail } from './useModalDetail';
import { XDataGrid } from 'app/components/XDataGrid';
import { ModalValuePay } from './ModalValuePay';
import { Modal } from 'app/components/Modal';

export const ModalDetail = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, currentItem, fnGetData} = data;
  const providerName = currentItem?.providerName || '';
  const providerId = currentItem?.providerId || 0;

  const {table, currentItemDeta, openModalValuePay, setOpenModalValuePay, fnGetDataDetail} = useModalDetail({t, setLoading, currentItem});

  const propsToModalValuePay = {
    title: 'dialog.accountsPayable.paymentsApplied.title',
    DialogContent: ModalValuePay,
    open: openModalValuePay,
    setOpen: setOpenModalValuePay,
    maxWidth: "sm",
    data:{
      sweetAlerts,
      setLoading,
      currentItemDeta,
      providerName,
      providerId,
      fnGetData,
      fnGetDataDetail
    }
  }

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={2} direction='row'>
        <Grid item xs={12} sm={6}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.provider')}</Typography>
          <Typography variant={"h5"} mb={2.25}>{`${providerName}`}</Typography>
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
    <Modal {...propsToModalValuePay}/>
  </>
  )
}