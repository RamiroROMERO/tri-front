import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validFloat, validInt } from 'app/utils/helpers';
import { useState } from 'react';

const useModalNew = ({ t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem, screenControl }) => {
  const [sendForm, setSendForm] = useState(false);
  const { optCreate, optUpdate } = screenControl;

  const formValidations = {
    name: [(val) => val.length >= 4, t("alertMessages.warning.nameValid")],
    // perDiemPeriod: [(val) => validInt(val) !== 0, t("alertMessages.error.customers.maxHoursWeek")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    id: currentItem.id || 0,
    code: currentItem.code || '',
    name: currentItem.name || '',
    email: currentItem.email || '',
    phone: currentItem.phone || '',
    address: currentItem.address || '',
    perDiemPayroll: currentItem.perDiemPayroll || 0,
    perDiemInvoice: currentItem.perDiemInvoice || 0,
    perDiemPeriod: currentItem.perDiemPeriod || 40,
    discountPercent: currentItem.discountPercent || 0,
    dayEnd: currentItem.dayEnd || 0,
    invoiceType: currentItem.invoiceType || 0,
    invoiceLineDescription: currentItem.invoiceLineDescription || 0,
    globalDeduction: currentItem.globalDeduction || 0,
    maxReghoursPayroll: currentItem.maxReghoursPayroll || 0,
    maxReghoursInvoice: currentItem.maxReghoursInvoice || 0,
    messageInCheck: currentItem.messageInCheck || '',
    invoicePerdiemType: currentItem.invoicePerdiemType || 1,
    perdiemAdjustPercent: currentItem.perdiemAdjustPercent || 0,
    active: currentItem.id ? currentItem.active : 1,
    contractNumber: currentItem.contractNumber || '',
    bothCompanies: currentItem?.bothCompanies || 0
  }, formValidations);

  const { id, name, email, phone, address, perDiemPayroll, perDiemInvoice, perDiemPeriod, discountPercent, invoiceType, invoiceLineDescription, globalDeduction, maxReghoursPayroll, maxReghoursInvoice, messageInCheck, invoicePerdiemType, active, contractNumber, perdiemAdjustPercent, bothCompanies } = formState;

  const fnSave = () => {

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
      name,
      phone,
      email,
      address,
      active,
      perDiemPayroll: validFloat(perDiemPayroll),
      perDiemInvoice: validFloat(perDiemInvoice),
      discountPercent,
      globalDeduction,
      perDiemPeriod,
      invoiceType,
      invoiceLineDescription,
      maxReghoursInvoice,
      maxReghoursPayroll,
      invoicePerdiemType,
      messageInCheck,
      contractNumber,
      perdiemAdjustPercent,
      bothCompanies
    }

    setLoading(true);
    if (validInt(id) === 0) {
      request.POST('/customers', newData, resp => {
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
        const { messages } = err;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      })
    } else {
      request.PUT('/customers', newData, resp => {
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
        const { messages } = err;
        if (messages?.length > 0) {
          messages.map(elem => {
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
      sendForm,
      isFormValid,
      formValidation,
      fnSave
    }
  )
}

export default useModalNew