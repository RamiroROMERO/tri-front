import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validFloat, validInt } from 'app/utils/helpers';
import { useState } from 'react'

export const useModalEditRate = ({ t, sweetAlerts, setLoading, currentItemRate, customerId, fnGetData, setOpen }) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    rate: [(val) => validInt(val) !== 0, t("alertMessages.warning.ratePayroll")],
    rateInvoice: [(val) => validInt(val) !== 0, t("alertMessages.warning.rateInvoice")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    id: currentItemRate?.idRate || 0,
    employeeId: currentItemRate?.id || 0,
    rate: currentItemRate?.rate || 0,
    rateOvertime: validFloat(currentItemRate?.rateOvertime, 4) || 0,
    rateInvoice: validFloat(currentItemRate?.rateInvoice, 4) || 0,
    rateInvoiceOvertime: validFloat(currentItemRate?.rateInvoiceOvertime, 4) || 0,
    percOtPayroll: validFloat(currentItemRate?.percOtPayroll, 4) || 0,
    percOtInvoice: validFloat(currentItemRate?.percOtInvoice, 4) || 0,
    payPerdiem: validFloat(currentItemRate?.payPerdiem, 4) || 0,
    invoicePerdiem: validFloat(currentItemRate?.invoicePerdiem, 4) || 0,
    fixedPerdiem: validInt(currentItemRate?.fixedPerdiem) || 0,
    fixedPerdiem2: validInt(currentItemRate?.fixedPerdiem2) || 0,
    status: currentItemRate.idRate ? currentItemRate.status : true
  }, formValidations);

  const { id, employeeId, rate, rateOvertime, rateInvoice, rateInvoiceOvertime, percOtPayroll, percOtInvoice, payPerdiem, invoicePerdiem, fixedPerdiem, fixedPerdiem2, status } = formState;

  const onPercOtPayrollChange = e => {
    const percValue = validFloat(e.target.value, 4);
    let rateOtP = 0;
    if (percValue > 0) {
      rateOtP = ((percValue / 100) * validFloat(rate, 4)) + validFloat(rate, 4);
    }

    onBulkForm({
      percOtPayroll: percValue,
      rateOvertime: rateOtP
    });
  }

  const onPercOtInvoiceChange = e => {
    const percValue = validFloat(e.target.value, 4);
    let rateOtI = 0;
    if (percValue > 0) {
      rateOtI = ((percValue / 100) * validFloat(rateInvoice, 4)) + validFloat(rateInvoice, 4);
    }

    onBulkForm({
      percOtInvoice: percValue,
      rateInvoiceOvertime: rateOtI
    });
  }

  const fnSave = () => {
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      id,
      customerId,
      employeeId,
      rate,
      rateOvertime,
      rateInvoice,
      rateInvoiceOvertime,
      percOtPayroll,
      percOtInvoice,
      payPerdiem,
      invoicePerdiem,
      fixedPerdiem,
      fixedPerdiem2,
      status
    }

    setLoading(true);
    if (validInt(id) > 0) {
      request.PUT('/employeeCustomers', newData, resp => {
        const { messages } = resp;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        onResetForm();
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
      formValidation,
      isFormValid,
      sendForm,
      onInputChange,
      onPercOtPayrollChange,
      onPercOtInvoiceChange,
      fnSave
    }
  )
}
