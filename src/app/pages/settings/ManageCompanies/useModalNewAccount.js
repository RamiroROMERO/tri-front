import { useState } from 'react';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useModalNewAccount = ({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem, companyId}) => {
  const [sendForm, setSendForm] = useState(false);
  const listType = [{ value: "sandbox", label: "Sandbox" }, { value: "producction", label: "Production" }];

  const formValidations = {
    name: [(val) => val.length >= 3, t("alertMessages.warning.nameValid")],
    email: [(val) => val.length >= 5, t("alertMessages.warning.email")],
    consumerKey: [(val) => val.length >= 5, t("alertMessages.warning.consumerKey")],
    consumerSecret: [(val) => val.length >= 5, t("alertMessages.warning.consumerSecret")],
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem?.id || 0,
    idCompany: companyId,
    name: currentItem?.name || '',
    email: currentItem?.email || '',
    consumerKey: currentItem?.consumerKey || '',
    consumerSecret: currentItem?.consumerSecret || '',
    type: currentItem?.type || '',
    status: currentItem?.status || true
  }, formValidations);

  const {id} = formState;

  const fnSaveDocto = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/qbAccounts', formState, resp=>{
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
      request.PUT('/qbAccounts', formState, resp=>{
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
      formValidation,
      isFormValid,
      sendForm,
      listType,
      onInputChange,
      fnSaveDocto
    }
  )
}
