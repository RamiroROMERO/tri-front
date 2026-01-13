import { useState } from 'react'
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { useForm } from 'app/hooks';

export const useModalNew = ({ t, sweetAlerts, currentItem, fnGetData, setOpen, setLoading }) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    name: [(val) => val.length >= 4, t("alertMessages.warning.nameValid")],
    code: [(val) => val.length >= 1, t("alertMessages.warning.codeValid")]
  }

  const { formState, onInputChange, onResetForm, isFormValid, formValidation, onBulkForm } = useForm({
    id: currentItem.id ? currentItem.id : 0,
    code: currentItem.code ? currentItem.code : '',
    name: currentItem.name ? currentItem.name : '',
    status: currentItem.id ? currentItem.status : true
  }, formValidations)

  const { id, name, code, status } = formState;

  const fnSave = () => {
    setSendForm(true);
    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }
    const newData = {
      id,
      code,
      name,
      status
    }
    setLoading(true);
    if (validInt(id) === 0) {
      request.POST('/inventory/measureUnits', newData, resp => {
        const { messages } = resp;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        setSendForm(false);
        setOpen(false);
        setLoading(false);
      }, err => {
        const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      })
    } else {
      request.PUT(`/inventory/measureUnits/${id}`, newData, resp => {
        const { messages } = resp;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        setSendForm(false);
        setOpen(false);
        setLoading(false);
      }, err => {
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
      formValidation,
      isFormValid,
      sendForm,
      fnSave
    }
  )
}




