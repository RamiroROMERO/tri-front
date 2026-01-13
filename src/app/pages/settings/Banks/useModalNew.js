import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { useState } from 'react';

export const useModalNew = ({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem}) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    name: [(val) => val.length >= 4, t("alertMessages.warning.nameValid")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem.id?currentItem.id:0,
    name: currentItem.name?currentItem.name:'',
    routingNumber: currentItem.routingNumber?currentItem.routingNumber:'',
    status: currentItem.status?currentItem.status:true
  }, formValidations);

  const {id, name, routingNumber, status} = formState;

  const fnSave = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      id,
      name,
      routingNumber,
      status
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/banks', newData, resp=>{
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
      request.PUT('/banks', newData, resp=>{
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
      sendForm
    }
  )
}
