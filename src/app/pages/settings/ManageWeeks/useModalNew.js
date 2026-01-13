import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { useState } from 'react'

export const useModalNew = ({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem, yearFilter}) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    year: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    noWeek: [(val) => validInt(val) !== 0, t("alertMessages.warning.noWeek")],
    startDate: [(val) => val.length >= 5, t("alertMessages.warning.startDateValid")],
    endDate: [(val) => val.length >= 5, t("alertMessages.warning.endDateValid")],
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem.id?currentItem.id:0,
    year: currentItem.year?currentItem.year:yearFilter,
    noWeek: currentItem.noWeek?currentItem.noWeek:0,
    startDate: currentItem.startDate?currentItem.startDate:'',
    endDate: currentItem.endDate?currentItem.endDate:'',
    status: currentItem.status?currentItem.status:true
  }, formValidations);

  const {id, year, noWeek, startDate, endDate, status} = formState;

  const fnSave = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      id,
      year,
      noWeek,
      startDate,
      endDate,
      status
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/setWeekYear', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData(yearFilter);
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
      request.PUT('/setWeekYear', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData(yearFilter);
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
