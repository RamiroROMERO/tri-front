import React from 'react'
import { Add, DoneAll } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import { ContainerWithLabel } from 'app/components/ContainerWithLabel';
import { InputBox } from 'app/components/InputBox';
import { SearchSelect } from 'app/components/SearchSelect';

const ProductDetail = (props) => {
  const { t, formStateDeta, formValidationDeta, isFormValidDeta, onInputChangeDeta, sendFormDeta, onQtyChange, onPriceChange, onDiscountChange, onTaxChange, onProductChange, listProducts, fnAddProduct, globalDiscPercent, globalDiscValue, onGlobalDiscPercentChange, onGlobalDiscValueChange, fnApplyDiscount } = props;

  const { productId, qty, measureUnit, price, subtotal, discountPercent, discountValue, taxPercent, taxValue, total } = formStateDeta;

  const { productIdValid, qtyValid, priceValid } = formValidationDeta;

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
                  error={(sendFormDeta && productIdValid) ? true : false}
                  helperText={(sendFormDeta && !isFormValidDeta) && productIdValid}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3} md={2}>
                <InputBox
                  label={t('table.purchaseOrders.column.measureUnit')}
                  name='measureUnit'
                  value={measureUnit}
                  onChange={onInputChangeDeta}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={3} md={2}>
                <InputBox
                  label={t('table.purchaseOrders.column.qty')}
                  name='qty'
                  value={qty}
                  onChange={onQtyChange}
                  error={(sendFormDeta && qtyValid) ? true : false}
                  helperText={(sendFormDeta && !isFormValidDeta) && qtyValid}
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
                  error={(sendFormDeta && priceValid) ? true : false}
                  helperText={(sendFormDeta && !isFormValidDeta) && priceValid}
                  type='number'
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3} md={2}>
                <InputBox
                  label={t('table.purchaseOrders.column.subtotal')}
                  name='subtotal'
                  value={subtotal}
                  onChange={onInputChangeDeta}
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
                  onChange={onInputChangeDeta}
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
                  onChange={onInputChangeDeta}
                  type='number'
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={3} md={2}>
                <InputBox
                  label={t('table.common.total')}
                  name='total'
                  value={total}
                  onChange={onInputChangeDeta}
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
    </>
  )
}

export default ProductDetail