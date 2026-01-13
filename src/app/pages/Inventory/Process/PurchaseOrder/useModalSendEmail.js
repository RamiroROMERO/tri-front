import React, { useState } from 'react'
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';

export const useModalSendEmail = ({emailProvider, ocCode, purchaseOrderId, sweetAlerts, t, setLoading, setOpen}) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    sendTo: [(val)=>val!=="", t("alertMessages.warning.email")],
    subject: [(val)=>val!=="", t("alertMessages.warning.subject")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: 0,
    sendTo: emailProvider,
    sendCCTo: '',
    subject: `P.O. #${ocCode} Techsource`,
    message: ''
  }, formValidations);

  const {sendTo, sendCCTo, subject, message} = formState;

  const fnSendEmail = ()=>{
    setSendForm(true);
    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      purchaseOrderId,
      sendTo,
      sendCCTo,
      subject,
      message
    }

    setLoading(true);
    request.POST('/inventory/purchaseOrders/sendPOEmail', newData, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setSendForm(false);
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
    })
  }

  return (
    {
      formState,
      formValidation,
      isFormValid,
      sendForm,
      onInputChange,
      fnSendEmail
    }
  )
}
