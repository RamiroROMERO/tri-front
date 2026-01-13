import { useState } from 'react'
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useModalNew = ({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem}) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    name: [(val) => val.length >= 4, t("alertMessages.warning.nameValid")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem.id?currentItem.id:0,
    code: currentItem.code?currentItem.code:'',
    name: currentItem.name?currentItem.name:'',
    email: currentItem.email?currentItem.email:'',
    phone: currentItem.phone?currentItem.phone:'',
    address: currentItem.address?currentItem.address:'',
    status: currentItem.id?currentItem.status:true
  }, formValidations);

  const {id} = formState;

  const fnSave = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    setLoading(true);
    if(validInt(id)===0){
      setLoading(true);
      request.GET("/inventory/customers/getCurrentCode", (resp)=>{
        const data= resp.data;
        setLoading(false);

        formState.code = data.newCode;
        request.POST('/inventory/customers', formState, resp=>{
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

      }, (err)=>{
        console.warn(err);
        setLoading(false);
      });
    }else{
      request.PUT(`/inventory/customers/${id}`, formState, resp=>{
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
      sendForm,
      isFormValid,
      formValidation,
      fnSave
    }
  )
}
