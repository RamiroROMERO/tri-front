import { useState } from 'react';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useModalNew = ({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem}) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    noOrder: [(val) => validInt(val) !== 0, t("alertMessages.warning.classification.noOrder")],
    name: [(val) => val.length >= 4, t("alertMessages.warning.nameValid")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem.id?currentItem.id:0,
    noOrder: currentItem.noOrder?currentItem.noOrder:0,
    name: currentItem.name?currentItem.name:'',
    rateByHour: currentItem.rateByHour?currentItem.rateByHour:0,
    rateByInvoice: currentItem.rateByInvoice?currentItem.rateByInvoice:0,
    status: currentItem.status?currentItem.status:true
  },formValidations);

  const {id, noOrder, name, rateByHour, rateByInvoice, status} = formState;

  const fnSave = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      id,
      noOrder,
      name,
      rateByHour,
      rateByInvoice,
      status
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/classifications', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
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
    }else{
      request.PUT('/classifications', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
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
      });
    }
  }

  return (
    {
      formState,
      onInputChange,
      fnSave,
      isFormValid,
      formValidation,
      sendForm,
    }
  )
}
