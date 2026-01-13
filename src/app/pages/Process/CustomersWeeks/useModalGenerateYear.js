import { useState } from 'react';
import { useForm } from 'app/hooks';
import { validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const useModalGenerateYear = ({t, sweetAlerts, setLoading, fnGetData, setOpen, yearFilter, customerFilter}) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    year: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    startDate: [(val) => val.length >= 5, t("alertMessages.warning.startDateValid")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    customerId: customerFilter?customerFilter:0,
    year: yearFilter?yearFilter:0,
    startDate: ''
  }, formValidations);

  const {customerId, startDate, year} = formState;

  const fnSave = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      customerId,
      dateInit:startDate,
      typeWeek:1,
      noYear: year
    };

    setLoading(true);
    request.POST('/customersWeeks/createWeekYear', newData, resp=>{
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
