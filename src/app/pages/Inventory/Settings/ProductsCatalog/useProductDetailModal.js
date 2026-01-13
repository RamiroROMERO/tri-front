import React, { useState } from 'react'
import { validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';
import { useForm } from 'app/hooks';

export const useProductDetailModal = ({ t, data, setOpen }) => {

  const { rowSelected, fnGetData, setLoading, sweetAlerts } = data;
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    code: [(val) => val.length > 0, t("alertMessages.warning.products.code")],
    name: [(val) => val.length > 5, t("alertMessages.warning.products.name")],
    classificationId: [(val) => validInt(val) !== 0, t("alertMessages.warning.products.classificationId")],
    measureUnitId: [(val) => validInt(val) !== 0, t("alertMessages.warning.products.measureUnitId")],
    trademarkId: [(val) => validInt(val) !== 0, t("alertMessages.warning.products.trademarkId")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm } = useForm({
    id: rowSelected.id || 0,
    code: rowSelected.code || '',
    name: rowSelected.name || '',
    description: rowSelected.description || '',
    classificationId: rowSelected.classificationId || 0,
    measureUnitId: rowSelected.measureUnitId || 0,
    trademarkId: rowSelected.trademarkId || 0,
    costValue: rowSelected.costValue || 0,
    maxCostValue: rowSelected.maxCostValue || 0,
    lastCostValue: rowSelected.lastCostValue || 0,
    taxApply: rowSelected.taxApply || true,
    taxPercent: rowSelected.taxPercent || 7.5,
    lastProviderName: rowSelected.lastProviderName || '',
    status: rowSelected.id ? rowSelected.status : true
  }, formValidations);

  const { id } = formState;

  const onTaxApplyChange = e =>{
    const tax = e.target.checked;
    let taxValue = 0;

    if(tax===true){
      taxValue = 7.5;
    }else{
      taxValue = 0;
    }

    onBulkForm({taxApply: tax, taxPercent: taxValue});
  }

  const fnSave = () => {

    setSendForm(true);
    if (!isFormValid) {
      return;
    }
    setLoading(true);
    if (validInt(id) == 0) {
      request.POST('/inventory/products', formState, resp => {
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
        console.error(err);
        setLoading(false);
      });
    } else {
      request.PUT(`/inventory/products/${rowSelected.id}`, formState, resp => {
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
        console.error(err);
        setLoading(false);
      });
    }
  };

  return {
    sendForm,
    formState,
    isFormValid,
    formValidation,
    onInputChange,
    onTaxApplyChange,
    fnSave
  }
}
