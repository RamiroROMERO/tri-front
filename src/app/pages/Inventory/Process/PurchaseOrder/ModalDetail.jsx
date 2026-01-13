import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography } from '@mui/material'
import { ExitToApp, Print } from '@mui/icons-material'
import { request } from 'app/utils/core';
import { useModalNew } from './useModalNew';
import ProductDetail from './ProductDetail';
import Totals from './Totals';

const ModalDetail = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, fnGetData, currentItem, listProducts} = data;

  const {formState, onInputChange, onBulkFormIndex} = useModalNew({t, sweetAlerts, setLoading, fnGetData, currentItem, setOpen});

  const {id, subtotal, discount, tax, total, status} = formState;

  const fnPrintDocument = ()=>{
    setLoading(true);
    request.GETPdf("/inventory/purchaseOrders/exportPDFOrder", {id: currentItem.id}, `Purchase Order ${currentItem.id}.pdf`);
    setLoading(false);
  }

  const propsToProductDetail = {
    idFather: id,
    statusOrder: status,
    sweetAlerts,
    onBulkFormIndex,
    listProducts,
    setLoading,
    fnGetData
  }

  const propsToTotals = {
    t,
    subtotal,
    discount,
    tax,
    total,
    onInputChange
  }

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={2} md={1}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.num')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.id?currentItem.id:''}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={4}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.customer')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.customerName?currentItem.customerName:''}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={3}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.project')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.projectName?currentItem.projectName:''}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={3}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.provider')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.providerName?currentItem.providerName:''}`}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction={'row'} style={{paddingTop: '15px'}}>
        <Grid item xs={12}>
          <ProductDetail {...propsToProductDetail}/>
        </Grid>
      </Grid>
      <Totals {...propsToTotals}/>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<Print />} onClick={fnPrintDocument} color='primary' variant='contained'>
        {t('button.print')}
      </Button>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
    </DialogActions>
  </>
  )
}

export default ModalDetail