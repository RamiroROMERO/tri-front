import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { useState } from 'react'

export const useChangePass = ({idUser, t, sweetAlerts, setOpen, setLoading}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    pass: [(val) => val.length >= 4, t("alertMessages.warning.newPass")],
    confirmPass: [(val) => val.length >= 4, t("alertMessages.warning.confirmPass")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    pass: '',
    oldPass: '',
    confirmPass: ''
  }, formValidations);

  const {pass, oldPass, confirmPass} = formState;

  const onClickShowPassword = ()=>{
    setShowPassword(!showPassword);
  }

  const onMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const fnClearInputs = ()=>{
    setSendForm(false);
    onResetForm();
  }

  const fnSavePass = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    if(pass !== confirmPass){
      sweetAlerts('error', t("alertMessages.warning.passDontMatch"));
      return;
    }

    const newData = {
      id: idUser,
      currentPassword: oldPass,
      newPassword: pass,
      confirmNewPassword: confirmPass
    }

    setLoading(true);
    request.PUT('/users/passwords', newData, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setSendForm(false);
      if(setOpen)setOpen(false);
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

  return (
    {
      showPassword,
      onClickShowPassword,
      onMouseDownPassword,
      fnSavePass,
      formState,
      onInputChange,
      formValidation,
      isFormValid,
      sendForm,
      fnClearInputs
    }
  )
}
