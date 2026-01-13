import { useState } from 'react'
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validFloat, validInt } from 'app/utils/helpers';

export const useModalEditRate = ({ t, sweetAlerts, setLoading, currentItemRate, employeeId, classificationId, fnGetData, setOpen, customerList }) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    customerId: [(val) => validInt(val) > 0, t("alertMessages.warning.customerId")],
    rate: [(val) => validInt(val) !== 0, t("alertMessages.warning.ratePayroll")],
    rateInvoice: [(val) => validInt(val) !== 0, t("alertMessages.warning.rateInvoice")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    id: currentItemRate?.id || 0,
    customerId: currentItemRate?.customerId || 0,
    rate: validFloat(currentItemRate?.rate, 4) || 0,
    rateOvertime: validFloat(currentItemRate?.rateOvertime, 4) || 0,
    rateInvoice: validFloat(currentItemRate?.rateInvoice, 4) || 0,
    rateInvoiceOvertime: validFloat(currentItemRate?.rateInvoiceOvertime, 4) || 0,
    percOtPayroll: validFloat(currentItemRate?.percOtPayroll) || 0,
    percOtInvoice: validFloat(currentItemRate?.percOtInvoice) || 0,
    payPerdiem: validFloat(currentItemRate?.payPerdiem, 4) || 0,
    invoicePerdiem: validFloat(currentItemRate?.invoicePerdiem, 4) || 0,
    fixedPerdiem: validInt(currentItemRate?.fixedPerdiem) || 0,
    fixedPerdiem2: validInt(currentItemRate?.fixedPerdiem2) || 0,
    status: currentItemRate.id ? currentItemRate.status : true,
    delRecord: currentItemRate.id ? currentItemRate.delRecord : false
  }, formValidations);

  const { id, customerId, rate, rateOvertime, rateInvoice, rateInvoiceOvertime, percOtPayroll, percOtInvoice, payPerdiem, invoicePerdiem, fixedPerdiem, fixedPerdiem2, status, delRecord } = formState;

  const onPercOtPayrollChange = e => {
    const percValue = validFloat(e.target.value, 4);
    let rateOtP = 0;
    if (percValue > 0) {
      rateOtP = validFloat(((percValue / 100) * validFloat(rate, 4)) + validFloat(rate, 4), 4);
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
      rateOtI = validFloat(((percValue / 100) * validFloat(rateInvoice, 4)) + validFloat(rateInvoice, 4), 4);
    }

    onBulkForm({
      percOtInvoice: percValue,
      rateInvoiceOvertime: rateOtI
    });
  }

  const onCustomerChange = e => {
    if (id > 0) return;
    const custId = validInt(e.target.value);

    if (custId === 0) return;
    const filter = customerList.find(item => item.value === custId);

    setLoading(true);
    request.GET(`/customerClassifications?customerId=${custId}&classificationId=${classificationId}`, (resp) => {
      const data = resp.customersClassifications;

      onBulkForm({
        customerId: custId,
        payPerdiem: filter ? filter.perDiemPayroll : 0,
        invoicePerdiem: filter ? filter.perDiemInvoice : 0,
        rate: data[0] ? data[0].ratePayroll : 0,
        percOtPayroll: data[0] ? data[0].percOtPayroll : 0,
        rateOvertime: data[0] ? data[0].rateOtPayroll : 0,
        rateInvoice: data[0] ? data[0].rateInvoice : 0,
        percOtInvoice: data[0] ? data[0].percOtInvoice : 0,
        rateInvoiceOvertime: data[0] ? data[0].rateOtInvoice : 0
      });

      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
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
      status,
      delRecord
    }

    if (validInt(id) > 0) {
      setLoading(true);
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
    } else {
      setLoading(true);
      request.POST('/employeeCustomers', newData, resp => {
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
      onCustomerChange,
      fnSave
    }
  )
}
