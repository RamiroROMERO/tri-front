import { useState } from 'react';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useModalAddQbCompany = ({t, sweetAlerts, setLoading, fnGetDataQbCompany, setOpen, currentItemQb, accountId}) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    name: [(val) => val.length >= 3, t("alertMessages.warning.nameValid")],
    realmId: [(val) => val.length >= 5, t("alertMessages.warning.realmId")],
    refreshToken: [(val) => val.length >= 5, t("alertMessages.warning.refreshToken")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItemQb?.id || 0,
    accountId: accountId,
    name: currentItemQb?.name || '',
    realmId: currentItemQb?.realmId || '',
    refreshToken: currentItemQb?.refreshToken || '',
    expireToken: currentItemQb?.expireToken || '',
    hasInvoice: currentItemQb?.hasInvoice || false,
    hasChecks: currentItemQb?.hasChecks || false,
    status: currentItemQb?.status || true
  }, formValidations);

  const {id} = formState;

  const fnSaveDocto = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    formState.expireToken = formState.expireToken===""?"1900-01-01":formState.expireToken;

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/qbCompanies', formState, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetDataQbCompany();
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
      request.PUT('/qbCompanies', formState, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetDataQbCompany();
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
