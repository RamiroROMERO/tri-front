import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import React, { useState } from 'react'

export const useFormEmployee = ({ t, setLoading, sweetAlerts, employeeId, fnGetEmployeeList, currentItem, setOpen }) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    name: [(val) => val.length >= 4, t("alertMessages.warning.employees.nameValid")],
    phone: [(val) => val.length >= 7, t("alertMessages.warning.employees.phoneValid")],
    email: [(val) => val.match('[a-z0-9]+@[a-z]+\.[a-z]{2,3}') !== null, t("alertMessages.warning.employees.emailValid")],
    firstName: [(val) => val.length >= 3, t("alertMessages.warning.employees.nameValid")],
    lastName: [(val) => val.length >= 3, t("alertMessages.warning.employees.nameValid")],
    address: [(val) => val.length >= 10, t("alertMessages.warning.employees.addressValid")],
    dateStarted: [(val) => val.length >= 5, t("alertMessages.warning.employees.dateValid")],
    // bankId: [(val) => validInt(val) !== 0, t("alertMessages.warning.employees.bankValid")],
    ciaAccount: [(val) => val.length !== 0, t("alertMessages.warning.employees.ciaAccountValid")],
    // ssnItin: [(val) => val.length >= 5, t("alertMessages.warning.employees.ssnItinValid")],
    statusId: [(val) => validInt(val) !== 0, t("alertMessages.warning.employees.statusValid")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    id: currentItem?.id || 0,
    code: currentItem?.code || 0,
    dni: currentItem?.dni || '',
    name: currentItem?.name || '',
    phone: currentItem?.phone || '',
    email: currentItem?.email || '',
    address: currentItem?.address || '',
    dateStarted: currentItem?.dateStarted || '',
    customerId: currentItem?.customerId || '0',
    classificationId: currentItem?.classificationId || '0',
    sectorId: currentItem?.sectorId || '0',
    bankId: currentItem?.bankId || '0',
    accountBank: currentItem?.accountBank || '',
    nameInCheck: currentItem?.nameInCheck || '',
    needCheck: currentItem?.needCheck || false,
    sameNameInCheck: currentItem?.sameNameInCheck || false,
    ciaAccount: currentItem?.ciaAccount || '',
    noteBank: currentItem?.noteBank || '',
    ssnItin: currentItem?.ssnItin || '',
    statusId: currentItem?.statusId || 4,
    firstName: currentItem?.firstName || '',
    lastName: currentItem?.lastName || ''
  }, formValidations);

  // inicio steps
  const steps = ['label.personalInformation', 'label.laboralInformation', 'label.bankInformation', 'label.otherformation'];
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const handleNext = () => {
    // validar formulario
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.employees.missingData"));
      return;
    }

    let newSkipped = skipped;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);

    // guardar al llegar al ultimo step
    if(activeStep === steps.length - 1) {fnSaveDocument()}
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // fin steps

  const fnSaveDocument = () => {
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.employees.missingData"));
      return;
    }

    request.PUT(`/employeeProfileToEdit/${employeeId}`, formState, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setSendForm(false);
      setLoading(false);
      fnGetEmployeeList();
      setOpen(false);
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  }

  return (
    {
      formState,
      onInputChange,
      onBulkForm,
      isFormValid,
      formValidation,
      sendForm,
      steps,
      activeStep,
      handleNext,
      handleBack
    }
  )
}
