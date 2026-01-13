import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent } from '@mui/material'
import { ExitToApp } from '@mui/icons-material'
import { XDataGrid } from 'app/components/XDataGrid';
import { InputBox } from 'app/components/InputBox';
import { Modal } from 'app/components/Modal';
import { ModalEditRate } from './ModalEditRate';
import { useModalRates } from './useModalRates';
import { ModalEditRateByClass } from './ModalEditRateByClass';
import { ModalViewRates } from '../Employees/ModalViewRates';

export const ModalRates = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, currentItem} = data;
  const customerName = currentItem.name?currentItem.name:'';
  const customerId = currentItem?.id || 0;

  const {table, openModalEditRate, setOpenModalEditRate, openModalEditRateByClass, setOpenModalEditRateByClass, openModalViewRates, setOpenModalViewRates, rowsSelected, currentItemRate, fnGetData} = useModalRates({t, sweetAlerts, setLoading, customerId, customerName});

  const propsToModalEditRates = {
    title: 'dialog.editRates.title',
    DialogContent: ModalEditRate,
    open: openModalEditRate,
    setOpen: setOpenModalEditRate,
    maxWidth: "xs",
    data:{
      sweetAlerts,
      setLoading,
      currentItemRate,
      customerId,
      fnGetData
    }
  }

  const propsToModalEditRatesByClass = {
    title: 'dialog.editRatesByClassification.title',
    DialogContent: ModalEditRateByClass,
    open: openModalEditRateByClass,
    setOpen: setOpenModalEditRateByClass,
    maxWidth: 'xs',
    data: {
      rowsSelected,
      customerId,
      setLoading,
      sweetAlerts,
      fnGetData
    }
  };

  const propsToModalViewRates = {
    title: 'dialog.employees.viewRates.title',
    DialogContent: ModalViewRates,
    open: openModalViewRates,
    setOpen: setOpenModalViewRates,
    maxWidth: 'sm',
    data: {
      dataEmployee: currentItemRate,
      dataCustomer: currentItem,
      setLoading
    }
  };

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
    <Modal {...propsToModalEditRates}/>
    <Modal {...propsToModalEditRatesByClass}/>
    <Modal {...propsToModalViewRates}/>
  </>
  )
}