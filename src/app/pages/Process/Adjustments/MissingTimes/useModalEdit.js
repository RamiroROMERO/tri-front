import { useEffect, useState } from 'react'
import { useForm } from 'app/hooks';
import { validFloat } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const useModalEdit = ({t, currentItem, setLoading, sweetAlerts, fnGetData, setOpen, screenControl}) => {
  const { optUpdate } = screenControl;
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    qty: [(val) => validFloat(val) !== 0, t("alertMessages.error.missingTimes.hours")],
    totalInvoice: [(val) => validFloat(val) !== 0, t("alertMessages.error.missingTimes.invoiceTotal")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem?.id || 0,
    qty: currentItem?.qty || 0,
    pricePayroll: currentItem?.pricePayroll || 0,
    priceInvoice: currentItem?.priceInvoice || 0,
    totalPayroll: currentItem?.totalPayroll || 0,
    totalInvoice: currentItem?.totalInvoice || 0,
    inCheck: currentItem?.inCheck || false,
    inInvoice: currentItem?.inInvoice || false
  }, formValidations);

  const {qty, priceInvoice, pricePayroll} = formState;

  const fnChangePrice = ()=>{
    onBulkForm({
      totalPayroll: validFloat(pricePayroll) * validFloat(qty),
      totalInvoice: validFloat(priceInvoice) * validFloat(qty)
    })
  }

  const fnNewDocto = ()=>{
    setSendForm(false);
    onResetForm();
  }

  const fnSaveDocto = ()=>{
    if (optUpdate === 0) {
      sweetAlerts('error', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    setLoading(true);
    request.PUT('/missingTimes', formState, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetData();
      fnNewDocto();
      setOpen(false);
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

  useEffect(()=>{
    fnChangePrice();
  },[priceInvoice, pricePayroll, qty]);

  return (
    {
      formState,
      formValidation,
      isFormValid,
      sendForm,
      onInputChange,
      fnSaveDocto
    }
  )
}
