import React from 'react'
import { ContainerWithLabel } from 'app/components/ContainerWithLabel'
import { useProductDetail } from './useProductDetail'
import { Button, Grid } from '@mui/material';
import { InputBox } from 'app/components/InputBox';
import { Add, DoneAll } from '@mui/icons-material';
import { SearchSelect } from 'app/components/SearchSelect';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { Modal } from 'app/components/Modal';
import { ModalEditProduct } from './ModalEditProduct';
import TableDetail from './TableDetail';
import { useGlobalDiscount } from './useGlobalDiscount';

const ProductDetail = ({sweetAlerts, onBulkFormIndex, listProducts, idFather, setLoading, fnGetData, statusOrder}) => {
  const {t, formState, formValidation, isFormValid, onInputChange, sendForm, fnAddProduct, onQtyChange, onPriceChange, onDiscountChange, onTaxChange, onProductChange, fnEditProduct, fnDeleteProduct, fnOkDeleteProduct, openMsgDelete, setOpenMsgDelete, orderDetail, currentItemDeta, openModalEdit, setOpenModalEdit, fnUpdateTotals} = useProductDetail({sweetAlerts, onBulkFormIndex, listProducts, idFather, setLoading, fnGetData, statusOrder});

  const {productId, qty, measureUnit, price, subtotal, discountPercent, discountValue, taxPercent, taxValue, total} = formState;

  const {productIdValid, qtyValid, priceValid} = formValidation;

  const {globalDiscPercent, globalDiscValue, onGlobalDiscPercentChange, onGlobalDiscValueChange, fnApplyDiscount} = useGlobalDiscount({statusOrder, orderDetail, onBulkFormIndex, fnUpdateTotals, setLoading, sweetAlerts, t});

  const propsToTableDetail = {
    orderDetail,
    fnEditProduct,
    fnDeleteProduct,
    t
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
      orderDetail,
      onBulkFormIndex,
      typeEdit: 1
    }
  };

  return (
    <>
    <Grid container spacing={3} direction={'row'}>
      <Grid item xs={12} md={9} lg={10}>
        <ContainerWithLabel label={t("dialog.purchaseOrders.title.addProducts")}>
          <Grid container spacing={3} direction={'row'}>
            <Grid item xs={12} sm={12} md={6}>
              <SearchSelect
                label={t("table.purchaseOrders.column.product")}
                name="productId"
                value={productId}
                onChange={onProductChange}
                optionList={listProducts}
                error={(sendForm&&productIdValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&productIdValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <InputBox
                label={t('table.purchaseOrders.column.measureUnit')}
                name='measureUnit'
                value={measureUnit}
                onChange={onInputChange}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <InputBox
                label={t('table.purchaseOrders.column.qty')}
                name='qty'
                value={qty}
                onChange={onQtyChange}
                error={(sendForm&&qtyValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&qtyValid}
                type='number'
                required
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <InputBox
                label={t('table.purchaseOrders.column.price')}
                name='price'
                value={price}
                onChange={onPriceChange}
                error={(sendForm&&priceValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&priceValid}
                type='number'
                required
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <InputBox
                label={t('table.purchaseOrders.column.subtotal')}
                name='subtotal'
                value={subtotal}
                onChange={onInputChange}
                type='number'
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <InputBox
                label={t('table.purchaseOrders.column.percentDiscount')}
                name='discountPercent'
                value={discountPercent}
                type='number'
                onChange={onDiscountChange}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <InputBox
                label={t('table.purchaseOrders.column.discount')}
                name='discountValue'
                value={discountValue}
                onChange={onInputChange}
                type='number'
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <InputBox
                label={t('table.purchaseOrders.column.percentTax')}
                name='taxPercent'
                value={taxPercent}
                type='number'
                onChange={onTaxChange}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <InputBox
                label={t('table.purchaseOrders.column.tax')}
                name='taxValue'
                value={taxValue}
                onChange={onInputChange}
                type='number'
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <InputBox
                label={t('table.common.total')}
                name='total'
                value={total}
                onChange={onInputChange}
                type='number'
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={9} md={12} textAlign={'right'}>
              <Button startIcon={<Add />} onClick={fnAddProduct} color='primary' variant='contained'>
                {t('button.add')}
              </Button>
            </Grid>
          </Grid>
        </ContainerWithLabel>
      </Grid>
      <Grid item xs={12} md={3} lg={2}>
        <ContainerWithLabel label={t("dialog.purchaseOrders.title.addGlobalDiscount")}>
          <Grid container spacing={3} direction={'row'}>
            <Grid item xs={12} sm={3} md={12}>
              <InputBox
                label={t('table.common.percent')}
                name='globalDiscPercent'
                value={globalDiscPercent}
                type='number'
                onChange={onGlobalDiscPercentChange}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={12}>
              <InputBox
                label={t('table.common.value')}
                name='globalDiscValue'
                value={globalDiscValue}
                type='number'
                onChange={onGlobalDiscValueChange}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={12}>
              <Button startIcon={<DoneAll />} onClick={fnApplyDiscount} color='success' variant='contained'>
                {t('button.apply')}
              </Button>
            </Grid>
          </Grid>
        </ContainerWithLabel>
      </Grid>
    </Grid>
    <TableDetail {...propsToTableDetail}/>
    <ModalConfirm {...propsToModalConfirm}/>
    <Modal {...propsToModalEdit}/>
    </>
  )
}

export default ProductDetail