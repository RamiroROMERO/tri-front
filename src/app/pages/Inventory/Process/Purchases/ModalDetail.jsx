import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography } from '@mui/material'
import { ExitToApp, Print } from '@mui/icons-material'
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { useModalDetail } from './useModalDetail';
import { useModalNew } from './useModalNew';
import { ModalEditProduct } from './ModalEditProduct';
import ProductDetail from './ProductDetail';
import TableDetail from '../PurchaseOrder/TableDetail';
import Totals from '../PurchaseOrder/Totals';

export const ModalDetail = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, fnGetData, currentItem, listProducts} = data;

  const {formState, onInputChange, onBulkForm} = useModalNew({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem});

  const {subtotal, discount, tax, total, status} = formState;

  const {formStateDeta, formValidationDeta, isFormValidDeta, onInputChangeDeta, sendFormDeta, fnAddProduct, fnPrintDocument, onQtyChange, onPriceChange, onDiscountChange, onTaxChange, onProductChange, purchaseDetail, fnEditProduct, fnDeleteProduct, openModalEdit, setOpenModalEdit, currentItemDeta, fnUpdateTotals, openMsgDelete, setOpenMsgDelete, fnOkDeleteProduct, globalDiscPercent, globalDiscValue, onGlobalDiscPercentChange, onGlobalDiscValueChange, fnApplyDiscount} = useModalDetail({listProducts, currentItem, setLoading, sweetAlerts, onBulkForm, fnGetData, statusPurchase:status});

  const propsToProductDetail = {
    t,
    formStateDeta,
    formValidationDeta,
    isFormValidDeta,
    onInputChangeDeta,
    sendFormDeta,
    onQtyChange,
    onPriceChange,
    onDiscountChange,
    onTaxChange,
    onProductChange,
    listProducts,
    fnAddProduct,
    globalDiscPercent,
    globalDiscValue,
    onGlobalDiscPercentChange,
    onGlobalDiscValueChange,
    fnApplyDiscount
  }

  const propsToTableDetail = {
    orderDetail: purchaseDetail,
    fnEditProduct,
    fnDeleteProduct,
    t
  }

  const propsToTotals = {
    t,
    subtotal,
    discount,
    tax,
    total,
    onInputChange
  }

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDeleteProduct
  }

  const propsToModalEdit = {
    title: 'dialog.purchaseOrders.editProduct.title',
    DialogContent: ModalEditProduct,
    open: openModalEdit,
    setOpen: setOpenModalEdit,
    maxWidth: 'xs',
    data: {
      currentItemDeta,
      fnUpdateTotals,
      sweetAlerts,
      setLoading,
      purchaseDetail,
      onBulkFormIndex: onBulkForm
    }
  };

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={2} md={1}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.num')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.noPurchase?currentItem.noPurchase:''}`}</Typography>
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
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <TableDetail {...propsToTableDetail}/>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <Totals {...propsToTotals}/>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
      <Button startIcon={<Print />} onClick={fnPrintDocument} color='primary' variant='contained'>
        {t('button.print')}
      </Button>
    </DialogActions>
    <Modal {...propsToModalEdit}/>
    <ModalConfirm {...propsToModalConfirm}/>
  </>
  )
}