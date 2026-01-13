import { useState } from 'react';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useModalEdit = ({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem, screenControl}) => {
  const [sendForm, setSendForm] = useState(false);
  const { optCreate, optUpdate } = screenControl;

  const formValidations = {
    year: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    noWeek: [(val) => validInt(val) !== 0, t("alertMessages.warning.noWeek")],
    startDate: [(val) => val.length >= 5, t("alertMessages.warning.startDateValid")],
    endDate: [(val) => val.length >= 5, t("alertMessages.warning.endDateValid")],
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem.id?currentItem.id:0,
    customerId: currentItem.customerId?currentItem.customerId:0,
    customerName: currentItem.customerName?currentItem.customerName:'',
    year: currentItem.year?currentItem.year:0,
    noWeek: currentItem.noWeek?currentItem.noWeek:0,
    startDate: currentItem.startDate?currentItem.startDate:'',
    endDate: currentItem.endDate?currentItem.endDate:'',
    status: currentItem.status?currentItem.status:true
  }, formValidations);

  const {id, customerId, noWeek, year, startDate, endDate, status} = formState;

  const fnSave = ()=>{
    if (validInt(id) === 0) {
      if (optCreate === 0) {
        sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
        return;
      }
    } else {
      if (optUpdate === 0) {
        sweetAlerts('error', t("alertMessages.warning.unauthorizedUser"));
        return;
      }
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      id,
      customerId,
      noYear: year,
      noWeek,
      startDate,
      endDate,
      status
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/customersWeeks', newData, resp=>{
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
      setLoading(true);
      request.PUT('/customersWeeks', newData, resp=>{
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
