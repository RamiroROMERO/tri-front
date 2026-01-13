import { useEffect, useState } from 'react';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validFloat, validInt } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';

export const useProductDetail = ({sweetAlerts, onBulkFormIndex, listProducts, idFather, setLoading, fnGetData, statusOrder}) => {
  const [sendForm, setSendForm] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [currentItemDeta, setCurrentItemDeta] = useState({});
  const [orderDetail, setOrderDetail] = useState([]);
  const {t} = useTranslation();

  const formValidations = {
    productId: [(val)=>validInt(val)>0, t("alertMessages.warning.codeProduct")],
    qty: [(val)=> validFloat(val)>0, t("alertMessages.warning.qty")],
    price: [(val)=> validFloat(val)>0, t("alertMessages.warning.price")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: 0,
    productId: 0,
    qty: 1,
    measureUnit: '',
    price: 0,
    subtotal: 0,
    discountPercent: 0,
    discountValue: 0,
    taxPercent: 0,
    taxValue: 0,
    total: 0
  }, formValidations);

  const {id, productId, qty, price, subtotal, discountPercent, discountValue, taxPercent, taxValue, total} = formState;

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

  const onProductChange = (e) => {
    const {target} = e;
    const {value} = target;
    const findProduct = listProducts.find(elem=>elem.value=== value);
    const price = findProduct? findProduct.costValue:0;
    const tax = findProduct?findProduct.taxPercent:0;
    const measureUnit = findProduct?.measureUnit || '';

    const subtotalValue = validFloat(qty) * validFloat(price);
    const taxValue = ((subtotalValue-discountValue) * validFloat(tax))/100;
    const totalValue = subtotalValue - discountValue + taxValue;

    onBulkForm({
      productId: value,
      price,
      taxPercent: tax,
      taxValue: taxValue,
      subtotal: subtotalValue,
      measureUnit,
      total: validFloat(totalValue, 2)
    });
  };

  const fnGetDataDetail = ()=>{
    setLoading(true);
    request.GET(`/inventory/purchaseOrderDetails?fatherId=${idFather}`, (resp)=>{
      const data= resp.data.map((item, idx)=>{
        item.count = idx + 1
        item.qtyDesc =`${item.qty} (${(item.invProduct?.invMeasureUnit?.code || "")})`
        item.productCode = item.invProduct.code
        item.productName = item.invProduct.name
        return item;
      });
      setOrderDetail(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnUpdateTotals = (newData) =>{
    setLoading(true);
    request.PUT(`/inventory/purchaseOrders/${idFather}`, newData, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetData();
      fnGetDataDetail();
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
  }

  const fnAddProduct = ()=>{
    if(statusOrder===2){
      sweetAlerts('error', t("alertMessages.error.purchaseOrderProcess"));
      return;
    }

    setSendForm(true);
    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const detailOrder = {
      fatherId: idFather,
      productId,
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
    request.POST('/inventory/purchaseOrderDetails', detailOrder, (resp)=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
      onResetForm();
      setSendForm(false);
    },(err)=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });

    // calculo de totales
    const sumSubtotal = orderDetail.map(item => validFloat(item.subtotal)).reduce((prev, curr) => prev + curr, 0) + subtotal;
    const sumDiscount = orderDetail.map(item => validFloat(item.discountValue)).reduce((prev, curr) => prev + curr, 0) + discountValue;

    const sumTaxes = orderDetail.map(item => validFloat(item.taxValue)).reduce((prev, curr) => prev + curr, 0) + taxValue;
    const sumTotal = orderDetail.map(item => validFloat(item.total)).reduce((prev, curr) => prev + curr, 0) + total;

    const updateTotals = {
      subtotal: sumSubtotal,
      tax: sumTaxes,
      discount: sumDiscount,
      total: sumTotal
    }
    onBulkFormIndex(updateTotals);

    // actualizar totales
    fnUpdateTotals(updateTotals)
  }

  const fnEditProduct = (item)=>{
    if(statusOrder===2){
      sweetAlerts('error', t("alertMessages.error.purchaseOrderProcess"));
      return;
    }
    setCurrentItemDeta(item);
    setOpenModalEdit(true);
  }

  const fnDeleteProduct = (item)=>{
    if(statusOrder===2){
      sweetAlerts('error', t("alertMessages.error.purchaseOrderProcess"));
      return;
    }
    onBulkForm({id: item.id});
    setOpenMsgDelete(true);
  }

  const fnOkDeleteProduct = ()=>{
    setLoading(true);
    request.DELETE(`/inventory/purchaseOrderDetails/${id}`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
      onResetForm();
      setSendForm(false);

      // calculo de totales
      const newArray = orderDetail.filter((item) => item.id !== id);

      const sumSubtotal = newArray.map(item => validFloat(item.subtotal)).reduce((prev, curr) => prev + curr, 0);
      const sumDiscount = newArray.map(item => validFloat(item.discountValue)).reduce((prev, curr) => prev + curr, 0);

      const sumTaxes = newArray.map(item => validFloat(item.taxValue)).reduce((prev, curr) => prev + curr, 0);
      const sumTotal = newArray.map(item => validFloat(item.total)).reduce((prev, curr) => prev + curr, 0);

      const updateTotals = {
        subtotal: sumSubtotal,
        tax: sumTaxes,
        discount: sumDiscount,
        total: sumTotal
      }
      onBulkFormIndex(updateTotals);

      // actualizar totales
      fnUpdateTotals(updateTotals)

    }, err=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  }

  useEffect(()=>{
    fnGetDataDetail();
  },[]);

  return (
    {
      t,
      formState,
      formValidation,
      isFormValid,
      onInputChange,
      sendForm,
      fnAddProduct,
      onQtyChange,
      onPriceChange,
      onDiscountChange,
      onTaxChange,
      fnEditProduct,
      fnDeleteProduct,
      fnOkDeleteProduct,
      openMsgDelete,
      setOpenMsgDelete,
      onProductChange,
      orderDetail,
      currentItemDeta,
      openModalEdit,
      setOpenModalEdit,
      fnUpdateTotals
    }
  )
}
