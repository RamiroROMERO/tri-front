import { useEffect, useState } from 'react'
import { useForm } from 'app/hooks'
import { validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const useModalNew = ({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem}) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    dni: [(val)=>val!=="", t("alertMessages.warning.dni")],
    name: [(val)=>val!=="", t("alertMessages.warning.nameValid")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem.id?currentItem.id:0,
    dni: currentItem.dni?currentItem.dni:'',
    name: currentItem.name?currentItem.name:'',
    phone: currentItem.phone?currentItem.phone:'',
    email: currentItem.email?currentItem.email:'',
    address: currentItem.address?currentItem.address:'',
    paymentConditions: currentItem.paymentConditions?currentItem.paymentConditions:'',
    creditDays: currentItem.creditDays?currentItem.creditDays:0,
    shipDays: currentItem.shipDays?currentItem.shipDays:0,
    status: currentItem.id?currentItem.status:true,
    contactName: currentItem.contactName?currentItem.contactName:'',
    contactPhone: currentItem.contactPhone?currentItem.contactPhone:''
  }, formValidations);

  const {id, dni, name, phone, email, address, paymentConditions, creditDays, shipDays, status, contactName, contactPhone} = formState;

  const fnSaveDocto = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      dni,
      name,
      phone,
      email,
      address,
      paymentConditions,
      creditDays,
      shipDays,
      status,
      contactName,
      contactPhone
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/inventory/providers', newData, resp=>{
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
      request.PUT(`/inventory/providers/${id}`, newData, resp=>{
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

  useEffect(()=>{
    if(validInt(id)===0){
      setLoading(true);
      request.GET('/inventory/providers/getCurrentCode', (resp)=>{
        const data= resp.data;
        onBulkForm({dni: data.newCode});
        setLoading(false);
      }, (err)=>{
        console.warn(err);
        setLoading(false);
      });
    }
  }, []);

  return (
    {
      formState,
      onInputChange,
      sendForm,
      isFormValid,
      formValidation,
      fnSaveDocto
    }
  )
}
