import { useState } from 'react';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { useForm } from 'app/hooks';

export const useModalNew = ({ t, sweetAlerts, currentItem, fnGetData, setOpen, setLoading }) => {
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    storeId: [(val) => validInt(val) > 0, t("alertMessages.warning.storeId")],
    productId: [(val) => validInt(val) > 0, t("alertMessages.warning.productId")],
    qtyMin: [(val) => validInt(val) > 0, t("alertMessages.warning.qtyMin")],
    qtyMax: [(val) => validInt(val) > 1, t("alertMessages.warning.qtyMax")],
    locationId: [(val) => validInt(val) > 0, t("alertMessages.warning.locationId")],
  }

  const { formState, onInputChange, onResetForm, isFormValid, formValidation, onBulkForm } = useForm({
    id: currentItem.id ? currentItem.id : 0,
    storeId: currentItem.storeId ? currentItem.storeId : 0,
    productId: currentItem.productId ? currentItem.productId : 0,
    qtyMin: currentItem.qtyMin ? currentItem.qtyMin : 0,
    qtyMax: currentItem.qtyMax ? currentItem.qtyMax : 0,
    locationId: currentItem.locationId ? currentItem.locationId : 0,
    status: currentItem.id ? currentItem.status : true
  }, formValidations)

  const { id, storeId, productId, qtyMin, qtyMax, locationId, status } = formState;

  const fnSave = () => {
    setSendForm(true);
    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }
    const newData = {
      id,
      storeId,
      productId,
      qtyMin,
      qtyMax,
      locationId,
      status
    }
    setLoading(true);
    if (validInt(id) === 0) {
      request.POST('/inventory/storeProducts', newData, resp => {
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
      request.PUT(`/inventory/storeProducts/${id}`, newData, resp => {
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
