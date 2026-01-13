import React, { useEffect, useState } from 'react'
import { useForm } from 'app/hooks';
import { validFloat, validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const useModalNew = ({ t, sweetAlerts, setLoading, fnGetProjects, fnGetListCustomers, customerId, setOpen, currentItem, screenControl }) => {
  const { optCreate, optUpdate } = screenControl;
  const [sendForm, setSendForm] = useState(false);
  const [showCustomerCode, setShowCustomerCode] = useState('block');

  const regValid = /[\^~\[\]*“%:<>?\/{|};,'"=+]/;

  const formValidations = {
    code: [(val) => (val.length >= 2 && regValid.test(val) === false), t("alertMessages.error.projects.projectCode")],
    name: [(val) => (val !== "" && regValid.test(val) === false), t("alertMessages.error.projects.projectName")],
    locationId: [(val) => validInt(val) > 0, t("alertMessages.error.projects.projectLocation")],
    statusId: [(val) => validInt(val) > 0, t("alertMessages.error.projects.statusId")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    id: currentItem.id ? currentItem.id : 0,
    name: currentItem.name ? currentItem.name : '',
    code: currentItem.code ? currentItem.code : '',
    customerCode: currentItem.customerCode ? currentItem.customerCode : '',
    locationId: currentItem.locationId ? currentItem.locationId : 0,
    description: currentItem.description ? currentItem.description : '',
    descInInvoice: currentItem.descInInvoice ? currentItem.descInInvoice : 0,
    statusId: currentItem.statusId ? currentItem.statusId : 1,
    groupPerdiem: currentItem.groupPerdiem || 0,
    rate: validFloat(currentItem?.rate, 4) || 0,
    rateOvertime: validFloat(currentItem?.rateOvertime, 4) || 0,
    rateInvoice: validFloat(currentItem?.rateInvoice, 4) || 0,
    rateInvoiceOvertime: validFloat(currentItem?.rateInvoiceOvertime, 4) || 0,
  }, formValidations);

  const { id, name, code, customerCode, locationId, description, descInInvoice, statusId, groupPerdiem } = formState;

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
      customerId,
      customerCode: id === 0 ? code : customerCode,
      name,
      code,
      locationId,
      statusId,
      descInInvoice,
      description,
      groupPerdiem
    }

    setLoading(true);
    if (validInt(id) === 0) {
      request.POST('/projects', newData, resp => {
        const { messages } = resp;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetProjects(customerId);
        fnGetListCustomers();
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
      request.PUT('/projects', newData, resp => {
        const { messages } = resp;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetProjects(customerId);
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

  useEffect(() => {
    if (id === 0) {
      setShowCustomerCode("none");
    } else {
      setShowCustomerCode("block");
    }
  }, []);

  return (
    {
      formState,
      isFormValid,
      formValidation,
      sendForm,
      showCustomerCode,
      onInputChange,
      fnSave
    }
  )
}
