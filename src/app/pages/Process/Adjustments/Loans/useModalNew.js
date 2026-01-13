import { useState } from 'react'
import { useForm } from 'app/hooks';
import { validFloat, validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const useModalNew = ({t, currentItem, sweetAlerts, setLoading, fnGetData, setOpen, screenControl}) => {
  const { optCreate, optUpdate } = screenControl;
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    date: [val=>val!=="",t("alertMessages.warning.date")],
    employeeId: [(val) => validInt(val) !== 0, t("alertMessages.warning.employeeId")],
    value: [(val) => validFloat(val) !== 0, t("alertMessages.warning.value")],
    valCuote: [(val) => validFloat(val) !== 0, t("alertMessages.warning.valCuote")],
    dateFirstCuote: [val=>val!=="",t("alertMessages.warning.dateFirstCuote")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem?.id || 0,
    date: currentItem?.date || '',
    employeeId: currentItem?.employeeId || 0,
    value: currentItem?.value || 0,
    valCuote: currentItem?.valCuote || 0,
    noCuotes: currentItem?.noCuotes || 0,
    dateFirstCuote: currentItem?.dateFirstCuote || '',
    description: currentItem?.description || ''
  }, formValidations);

  const {id, value} = formState;

  const onValCuoteChange = e=>{
    const valueCuote = e.target.value;

    let qtyCuotes = 0;
    if (validInt(valueCuote) > 0) {
      qtyCuotes = validFloat(value/valueCuote);
    }

    onBulkForm({valCuote: valueCuote, noCuotes: qtyCuotes});
  }

  const fnSaveDocto = ()=>{
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

    if(validInt(id)===0){
      setLoading(true);
      request.POST('/loans', formState, resp=>{
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
      request.PUT('/loans', formState, resp=>{
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
  };

  return (
    {
      formState,
      formValidation,
      isFormValid,
      sendForm,
      onInputChange,
      onValCuoteChange,
      fnSaveDocto
    }
  )
}
