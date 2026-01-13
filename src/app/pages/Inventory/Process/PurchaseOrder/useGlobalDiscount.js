import { useState } from 'react';
import { request } from 'app/utils/core';
import { validFloat } from 'app/utils/helpers';

export const useGlobalDiscount = ({statusOrder, orderDetail, onBulkFormIndex, fnUpdateTotals, setLoading, sweetAlerts, t}) => {
  const [globalDiscPercent, setGlobalDiscPercent] = useState(0);
  const [globalDiscValue, setGlobalDiscValue] = useState(0);

  const onGlobalDiscPercentChange = e =>{
    const discPercent = e.target.value;
    setGlobalDiscPercent(discPercent);
    setGlobalDiscValue(0);
  }

  const onGlobalDiscValueChange = e =>{
    const discValue = e.target.value;
    setGlobalDiscValue(discValue);
    setGlobalDiscPercent(0);
  }

  const fnApplyDiscount = ()=>{
    if(statusOrder===2){
      sweetAlerts('error', t("alertMessages.error.purchaseOrderProcess"));
      return;
    }
    if(validFloat(globalDiscPercent)===0 && validFloat(globalDiscValue)===0){
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }
    if(orderDetail.length===0){
      sweetAlerts('error', t("alertMessages.warning.missingDetail"));
      return;
    }

    const sumSubtotal = orderDetail.map(item => validFloat(item.subtotal)).reduce((prev, curr) => prev + curr, 0);

    let discProduct = 0;
    if(validFloat(globalDiscValue)>0){
      discProduct = (validFloat(globalDiscValue)*100)/sumSubtotal;
    }else{
      discProduct = validFloat(globalDiscPercent);
    }

    const newDetail = orderDetail.map((item)=>{
      const discPercent = discProduct;
      const discValue = (validFloat(item.subtotal) * discProduct)/100;
      const taxValue = ((validFloat(item.subtotal)-discValue) * validFloat(item.taxPercent))/100;
      const totalValue = validFloat(item.subtotal) - discValue + taxValue;

      item.discountPercent = discPercent
      item.discountValue = discValue
      item.taxValue = taxValue
      item.total = validFloat(totalValue, 2)
      return item;
    });

    // actualizar detalle de la orden de compra
    newDetail.forEach(item=>{
      const detailOrder = {
        discountPercent: validFloat(item.discountPercent),
        discountValue: validFloat(item.discountValue),
        taxValue: validFloat(item.taxValue),
        total: validFloat(item.total)
      }
      setLoading(true);
      request.PUT(`/inventory/purchaseOrderDetails/${item.id}`, detailOrder, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      }, err=>{
        const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      });
    });

    // calculo de totales
    const sumSubtotal2 = newDetail.map(item => validFloat(item.subtotal)).reduce((prev, curr) => prev + curr, 0);
    const sumDiscount = newDetail.map(item => validFloat(item.discountValue)).reduce((prev, curr) => prev + curr, 0);
    
    const sumTaxes = newDetail.map(item => validFloat(item.taxValue)).reduce((prev, curr) => prev + curr, 0);
    const sumTotal = newDetail.map(item => validFloat(item.total)).reduce((prev, curr) => prev + curr, 0);

    const updateTotals = {
      subtotal: sumSubtotal2,
      tax: sumTaxes,
      discount: sumDiscount,
      total: sumTotal
    }
    onBulkFormIndex(updateTotals);

    // actualizar totales
    fnUpdateTotals(updateTotals)
  }

  return (
    {
      globalDiscPercent,
      globalDiscValue,
      onGlobalDiscPercentChange,
      onGlobalDiscValueChange,
      fnApplyDiscount
    }
  )
}
