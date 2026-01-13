import React, { useState } from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { useForm } from 'app/hooks';
import { InputBox } from 'app/components/InputBox';
import { validFloat, validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const ModalEditProduct = ({setOpen, data, t}) => {
  const {currentItemDeta, sweetAlerts, setLoading, orderDetail, onBulkFormIndex, fnUpdateTotals, typeEdit} = data;
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    productId: [(val)=>validInt(val)>0, t("alertMessages.warning.codeProduct")],
    qty: [(val)=> validFloat(val)>0, t("alertMessages.warning.qty")],
    price: [(val)=> validFloat(val)>0, t("alertMessages.warning.price")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItemDeta.id,
    productId: currentItemDeta.productId,
    qty: currentItemDeta.qty,
    price: currentItemDeta.price,
    subtotal: currentItemDeta.subtotal,
    discountPercent: currentItemDeta.discountPercent,
    discountValue: currentItemDeta.discountValue,
    taxPercent: currentItemDeta.taxPercent,
    taxValue: currentItemDeta.taxValue,
    total: currentItemDeta.total
  }, formValidations);

  const {id, qty, price, subtotal, discountPercent, discountValue, taxPercent, taxValue, total} = formState;

  const {qtyValid, priceValid} = formValidation;

  const onQtyChange = e =>{
    const subtotalValue = validFloat(price) * e.target.value;
    const discValue = (subtotalValue * validFloat(discountPercent))/100;
    const taxValue = ((subtotalValue-discValue) * validFloat(taxPercent))/100;
    const totalValue = subtotalValue - discValue + taxValue;

    const newQty = {
      qty: e.target.value,
      subtotal: subtotalValue,
      discountValue: discValue,
      taxValue: taxValue,
      total: validFloat(totalValue, 2)
    }
    onBulkForm(newQty);
  }

  const onPriceChange = e =>{
    const subtotalValue = validFloat(qty) * e.target.value;
    const discValue = (subtotalValue * validFloat(discountPercent))/100;
    const taxValue = ((subtotalValue-discValue) * validFloat(taxPercent))/100;
    const totalValue = subtotalValue - discValue + taxValue;

    const newPrice = {
      price: e.target.value,
      subtotal: subtotalValue,
      discountValue: discValue,
      taxValue: taxValue,
      total: validFloat(totalValue, 2)
    }
    onBulkForm(newPrice);
  }

  const onDiscountChange = e =>{
    const subtotalValue = validFloat(qty) * validFloat(price);
    const discValue = (subtotalValue * validFloat(e.target.value))/100;
    const taxValue = ((subtotalValue-discValue) * validFloat(taxPercent))/100;
    const totalValue = subtotalValue - discValue + taxValue;

    const newDiscount = {
      discountPercent: e.target.value,
      subtotal: subtotalValue,
      discountValue: discValue,
      taxValue: taxValue,
      total: validFloat(totalValue, 2)
    }
    onBulkForm(newDiscount);
  }

  const onTaxChange = e =>{
    const subtotalValue = validFloat(qty) * validFloat(price);
    const discValue = (subtotalValue * validFloat(discountPercent))/100;
    const taxValue = ((subtotalValue-discValue) * validFloat(e.target.value))/100;
    const totalValue = subtotalValue - discValue + taxValue;

    const newTax = {
      taxPercent: e.target.value,
      subtotal: subtotalValue,
      discountValue: discValue,
      taxValue: taxValue,
      total: validFloat(totalValue, 2)
    }
    onBulkForm(newTax);
  }

  const fnSave = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }


    if(validInt(typeEdit)===1){
      const detailOrder = {
        qty: validFloat(qty),
        price: validFloat(price),
        subtotal: validFloat(subtotal),
        discountPercent: validFloat(discountPercent),
        discountValue: validFloat(discountValue),
        taxPercent: validFloat(taxPercent),
        taxValue: validFloat(taxValue),
        total: validFloat(total)
      }

      setLoading(true);
      request.PUT(`/inventory/purchaseOrderDetails/${id}`, detailOrder, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
        onResetForm();
        setSendForm(false);
        setOpen(false);
      }, err=>{
        const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      });

      orderDetail.map((item)=>{
        if(item.id===id){
          item.qty= validFloat(qty)
          item.price= validFloat(price)
          item.subtotal= validFloat(subtotal)
          item.discountPercent= validFloat(discountPercent)
          item.discountValue= validFloat(discountValue)
          item.taxPercent= validFloat(taxPercent)
          item.taxValue= validFloat(taxValue)
          item.total= validFloat(total)
        }
        return item;
      });

      // calculo de totales
      const sumSubtotal = orderDetail.map(item => validFloat(item.subtotal)).reduce((prev, curr) => prev + curr, 0);
      const sumDiscount = orderDetail.map(item => validFloat(item.discountValue)).reduce((prev, curr) => prev + curr, 0);
      
      const sumTaxes = orderDetail.map(item => validFloat(item.taxValue)).reduce((prev, curr) => prev + curr, 0);
      const sumTotal = orderDetail.map(item => validFloat(item.total)).reduce((prev, curr) => prev + curr, 0);

      const updateTotals = {
        subtotal: sumSubtotal,
        tax: sumTaxes,
        discount: sumDiscount,
        total: sumTotal
      }
      onBulkFormIndex(updateTotals);

      // actualizar totales
      fnUpdateTotals(updateTotals)
    }else if(validInt(typeEdit)===2){
      orderDetail.map((item)=>{
        if(item.id===id){
          item.qtyReceibed= validFloat(qty)
          item.price= validFloat(price)
          item.subtotal= validFloat(subtotal)
          item.discountPercent= validFloat(discountPercent)
          item.discountValue= validFloat(discountValue)
          item.taxPercent= validFloat(taxPercent)
          item.taxValue= validFloat(taxValue)
          item.total= validFloat(total)
        }
        return item;
      });

      // calculo de totales
      const sumSubtotal = orderDetail.map(item => item.qtyReceibed>0?validFloat(item.subtotal):0).reduce((prev, curr) => prev + curr, 0);
      const sumDiscount = orderDetail.map(item => item.qtyReceibed>0?validFloat(item.discountValue):0).reduce((prev, curr) => prev + curr, 0);
      const sumTaxes = orderDetail.map(item => item.qtyReceibed>0?validFloat(item.taxValue):0).reduce((prev, curr) => prev + curr, 0);
      const sumTotal = orderDetail.map(item => item.qtyReceibed>0?validFloat(item.total):0).reduce((prev, curr) => prev + curr, 0);

      const updateTotals = {
        subtotal: sumSubtotal,
        tax: sumTaxes,
        discount: sumDiscount,
        total: sumTotal
      }
      onBulkFormIndex(updateTotals);
      setOpen(false);
    }
  };

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.purchaseOrders.column.product')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItemDeta.productCode?currentItemDeta.productCode:''} | ${currentItemDeta.productName?currentItemDeta.productName:''}`}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={6} sm={6} md={4}>
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
        <Grid item xs={6} sm={6} md={4}>
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
        <Grid item xs={6} sm={6} md={4}>
          <InputBox
            label={t('table.purchaseOrders.column.subtotal')}
            name='subtotal'
            value={subtotal}
            onChange={onInputChange}
            type='number'
            disabled
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <InputBox
            label={t('table.purchaseOrders.column.percentDiscount')}
            name='discountPercent'
            value={discountPercent}
            onChange={onDiscountChange}
            type='number'
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <InputBox
            label={t('table.purchaseOrders.column.discount')}
            name='discountValue'
            value={discountValue}
            onChange={onInputChange}
            type='number'
            disabled
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <InputBox
            label={t('table.purchaseOrders.column.percentTax')}
            name='taxPercent'
            value={taxPercent}
            onChange={onTaxChange}
            type='number'
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <InputBox
            label={t('table.purchaseOrders.column.tax')}
            name='taxValue'
            value={taxValue}
            onChange={onInputChange}
            type='number'
            disabled
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <InputBox
            label={t('table.common.total')}
            name='total'
            value={total}
            onChange={onInputChange}
            type='number'
            disabled
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
      <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
        {t('button.save')}
      </Button>
    </DialogActions>
  </>
  )
}