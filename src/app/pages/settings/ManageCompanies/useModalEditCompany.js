import { useState } from 'react';
import { request } from 'app/utils/core';
import { useForm } from 'app/hooks';
import { validInt } from 'app/utils/helpers';

export const useModalEditCompany = ({t, sweetAlerts, setLoading, fnGetDataCompany, setOpen, dataCompany}) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    name: [(val) => val.length >= 3, t("alertMessages.warning.nameValid")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: dataCompany?.id || 0,
    dni: dataCompany.dni || '',
    name: dataCompany?.name || '',
    address1: dataCompany?.address1 || '',
    address2: dataCompany?.address2 || '',
    phone: dataCompany?.phone || '',
    website: dataCompany?.website || '',
    emailInfo: dataCompany?.emailInfo || '',
    contactName: dataCompany?.contactName || '',
    contactPhone: dataCompany?.contactPhone || '',
    contactEmail: dataCompany?.contactEmail || ''
  }, formValidations);

  const {id} = formState;

  const fnSaveDocto = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    setLoading(true);
    if(validInt(id)>0){
      request.PUT('/adminCompany', formState, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetDataCompany();
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
      formValidation,
      isFormValid,
      sendForm,
      onInputChange,
      fnSaveDocto
    }
  )
}
