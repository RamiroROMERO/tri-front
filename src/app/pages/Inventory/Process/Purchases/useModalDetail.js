import { useEffect, useState } from 'react';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validFloat, validInt } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';

export const useModalDetail = ({listProducts, currentItem, setLoading, sweetAlerts, onBulkForm, fnGetData, statusPurchase}) => {
  const {t} = useTranslation();
  const [sendFormDeta, setSendFormDeta] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [currentItemDeta, setCurrentItemDeta] = useState({});
  const [purchaseDetail, setPurchaseDetail] = useState([]);
  const [globalDiscPercent, setGlobalDiscPercent] = useState(0);
  const [globalDiscValue, setGlobalDiscValue] = useState(0);

  const formValidations = {
    productId: [(val)=>validInt(val)>0, t("alertMessages.warning.codeProduct")],
    qty: [(val)=> validFloat(val)>0, t("alertMessages.warning.qty")],
    price: [(val)=> validFloat(val)>0, t("alertMessages.warning.price")]
  }

  const {formState: formStateDeta, formValidation: formValidationDeta, isFormValid: isFormValidDeta, onInputChange: onInputChangeDeta, onBulkForm: onBulkFormDeta, onResetForm: onResetFormDeta} = useForm({
    id: 0,
    productId: 0,
    measureUnit: '',
    qty: 1,
    price: 0,
    subtotal: 0,
    discountPercent: 0,
    discountValue: 0,
    taxPercent: 0,
    taxValue: 0,
    total: 0
  }, formValidations);

  const {id, productId, qty, price, subtotal, discountPercent, discountValue, taxPercent, taxValue, total} = formStateDeta;

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
    onBulkFormDeta(newQty);
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
    onBulkFormDeta(newPrice);
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
    onBulkFormDeta(newDiscount);
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
    onBulkFormDeta(newTax);
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

    onBulkFormDeta({
      productId: value,
      price,
      subtotal: subtotalValue,
      taxPercent: tax,
      taxValue: taxValue,
      measureUnit,
      total: validFloat(totalValue, 2)
    });
  };

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

  const fnGetDataDetail = ()=>{
    setLoading(true);
    request.GET(`/inventory/purchaseDetails?fatherId=${currentItem.id}`, (resp)=>{
      const data= resp.data.map((item,idx)=>{
        item.count = idx + 1
        item.qtyDesc =`${item.qty} (${(item.invProduct?.invMeasureUnit?.code || "")})`
        item.productCode = item.invProduct.code
        item.productName = item.invProduct.name
        item.subtotal = validFloat(item.qty) * validFloat(item.price)
        return item;
      });
      setPurchaseDetail(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnUpdateTotals = (newData) =>{
    setLoading(true);
    request.PUT(`/inventory/purchases/${currentItem.id}`, newData, resp=>{
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
    if(statusPurchase===2){
      sweetAlerts('error', t("alertMessages.error.purchaseOrderProcess"));
      return;
    }
    setSendFormDeta(true);

    if (!isFormValidDeta) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const detailPurchase = {
      fatherId: currentItem.id,
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
    request.POST('/inventory/purchaseDetails', detailPurchase, (resp)=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
      onResetFormDeta();
      setSendFormDeta(false);
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
    const sumSubtotal = purchaseDetail.map(item => validFloat(item.subtotal)).reduce((prev, curr) => prev + curr, 0) + subtotal;
    const sumDiscount = purchaseDetail.map(item => validFloat(item.discountValue)).reduce((prev, curr) => prev + curr, 0) + discountValue;

    const sumTaxes = purchaseDetail.map(item => validFloat(item.taxValue)).reduce((prev, curr) => prev + curr, 0) + taxValue;
    const sumTotal = purchaseDetail.map(item => validFloat(item.total)).reduce((prev, curr) => prev + curr, 0) + total;

    const updateTotals = {
      subtotal: sumSubtotal,
      tax: sumTaxes,
      discount: sumDiscount,
      total: sumTotal
    }
    onBulkForm(updateTotals);

    // actualizar totales
    fnUpdateTotals(updateTotals)
  }

  const fnEditProduct = (item)=>{
    if(statusPurchase===2){
      sweetAlerts('error', t("alertMessages.error.purchaseOrderProcess"));
      return;
    }
    setCurrentItemDeta(item);
    setOpenModalEdit(true);
  }

  const fnDeleteProduct = (item)=>{
    if(statusPurchase===2){
      sweetAlerts('error', t("alertMessages.error.purchaseOrderProcess"));
      return;
    }
    onBulkFormDeta({id: item.id});
    setOpenMsgDelete(true);
  }

  const fnOkDeleteProduct = ()=>{
    setLoading(true);
    request.DELETE(`/inventory/purchaseDetails/${id}`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
      onResetFormDeta();
      setSendFormDeta(false);

      // calculo de totales
      const newArray = purchaseDetail.filter((item) => item.id !== id);

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
      onBulkForm(updateTotals);

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

  const fnPrintDocument = ()=>{
    setLoading(true);
    request.GETPdf("/inventory/purchases/exportPDFPurchase", {id: currentItem.id}, `Purchase ${currentItem.id}.pdf`);
    setLoading(false);
  }

  const fnApplyDiscount = ()=>{
    if(statusPurchase===2){
      sweetAlerts('error', t("alertMessages.error.purchaseOrderProcess"));
      return;
    }
    if(validFloat(globalDiscPercent)===0 && validFloat(globalDiscValue)===0){
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }
    if(purchaseDetail.length===0){
      sweetAlerts('error', t("alertMessages.warning.missingDetail"));
      return;
    }

    const sumSubtotal = purchaseDetail.map(item => validFloat(item.subtotal)).reduce((prev, curr) => prev + curr, 0);

    let discProduct = 0;
    if(validFloat(globalDiscValue)>0){
      discProduct = (validFloat(globalDiscValue)*100)/sumSubtotal;
    }else{
      discProduct = validFloat(globalDiscPercent);
    }

    const newDetail = purchaseDetail.map((item)=>{
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
      request.PUT(`/inventory/purchaseDetails/${item.id}`, detailOrder, resp=>{
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
    onBulkForm(updateTotals);

    // actualizar totales
    fnUpdateTotals(updateTotals)
  }

  useEffect(()=>{
    fnGetDataDetail();
  },[]);

  return (
    {
      formStateDeta,
      formValidationDeta,
      isFormValidDeta,
      onInputChangeDeta,
      onQtyChange,
      onPriceChange,
      onDiscountChange,
      onTaxChange,
      onProductChange,
      sendFormDeta,
      fnAddProduct,
      fnPrintDocument,
      purchaseDetail,
      fnEditProduct,
      fnDeleteProduct,
      openModalEdit,
      setOpenModalEdit,
      currentItemDeta,
      fnUpdateTotals,
      openMsgDelete,
      setOpenMsgDelete,
      fnOkDeleteProduct,
      globalDiscPercent,
      globalDiscValue,
      onGlobalDiscPercentChange,
      onGlobalDiscValueChange,
      fnApplyDiscount
    }
  )
}
