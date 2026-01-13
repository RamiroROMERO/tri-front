import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { useState } from 'react'

export const useModalNew = ({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem}) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    name: [(val) => val.length >= 4, t("alertMessages.warning.nameValid")],
    type: [(val) => validInt(val) !== 0, t("alertMessages.warning.type")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem.id?currentItem.id:0,
    name: currentItem.name?currentItem.name:'',
    type: currentItem.type?currentItem.type:0,
    isBillable: currentItem.isBillable?currentItem.isBillable:false,
    status: currentItem.status?currentItem.status:true
  }, formValidations);

  const {id, name, type, isBillable, status} = formState;

  const fnSave = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      id,
      name,
      type,
      isBillable,
      status
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/setDeductionTypes', newData, resp=>{
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
      request.PUT('/setDeductionTypes', newData, resp=>{
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
