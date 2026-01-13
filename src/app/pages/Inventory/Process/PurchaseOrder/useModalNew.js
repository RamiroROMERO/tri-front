import { useForm } from 'app/hooks'
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { useState } from 'react';

export const useModalNew = ({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem, listProjects}) => {
  const [sendForm, setSendForm] = useState(false);
  const [listProjectFilter, setListProjectFilter] = useState(currentItem?listProjects:[]);

  const formValidations = {
    date: [(val)=>val!=="", t("alertMessages.warning.date")],
    customerId: [(val)=> validInt(val)>0, t("alertMessages.warning.customerId")],
    projectId: [(val)=> validInt(val)>0, t("alertMessages.warning.projectId")],
    providerId: [(val)=> validInt(val)>0, t("alertMessages.warning.providerId")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm: onBulkFormIndex, onResetForm} = useForm({
    id: currentItem.id?currentItem.id:0,
    date: currentItem.date?currentItem.date:'',
    customerId: currentItem.customerId?currentItem.customerId:0,
    projectId: currentItem.projectId?currentItem.projectId: 0,
    providerId: currentItem.providerId?currentItem.providerId:0,
    requestor: currentItem.requestor?currentItem.requestor:'',
    onsiteContact: currentItem.onsiteContact?currentItem.onsiteContact:'',
    notes: currentItem.notes?currentItem.notes:'',
    subtotal: currentItem.subtotal?currentItem.subtotal:0,
    discount: currentItem.discount?currentItem.discount:0,
    tax: currentItem.tax?currentItem.tax:0,
    total: currentItem.total?currentItem.total:0,
    status: currentItem.id?currentItem.status:1
  }, formValidations);

  const {id, date, customerId, projectId, providerId, requestor, notes, onsiteContact} = formState;

  const onCustomerChange = (e) =>{
    const {target} = e;
    const {value} = target;

    const filter = listProjects.filter(item=>item.customerId===value);
    setListProjectFilter(filter);

    onBulkFormIndex({
      customerId: value,
      projectId: 0
    });
  }

  const fnSaveDocto = ()=>{
    if(currentItem.status===2){
      sweetAlerts('error', t("alertMessages.error.purchaseOrderProcess"));
      return;
    }

    setSendForm(true);
    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      id,
      date,
      customerId,
      projectId,
      providerId,
      requestor,
      notes,
      onsiteContact
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/inventory/purchaseOrders', newData, resp=>{
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
      request.PUT(`/inventory/purchaseOrders/${id}`, newData, resp=>{
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
      onInputChange,
      sendForm,
      fnSaveDocto,
      onBulkFormIndex,
      listProjectFilter,
      onCustomerChange
    }
  )
}
