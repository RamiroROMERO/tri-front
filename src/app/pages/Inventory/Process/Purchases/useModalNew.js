import { useState } from 'react'
import { useForm } from 'app/hooks';
import { validFloat, validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const useModalNew = ({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem, listProjects}) => {
  const [sendForm, setSendForm] = useState(false);
  const [listProjectFilter, setListProjectFilter] = useState(currentItem?listProjects:[]);

  const formValidations = {
    dateIn: [(val)=>val!=="", t("alertMessages.warning.dateIn")],
    dateOut: [(val)=>val!=="", t("alertMessages.warning.dateOut")],
    noPurchase: [(val)=>val!=="", t("alertMessages.warning.noPurchase")],
    paymentType: [(val)=> validFloat(val)>0, t("alertMessages.warning.paymentType")],
    customerId: [(val)=> validInt(val)>0, t("alertMessages.warning.customerId")],
    projectId: [(val)=> validInt(val)>0, t("alertMessages.warning.projectId")],
    providerId: [(val)=> validInt(val)>0, t("alertMessages.warning.providerId")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem.id?currentItem.id:0,
    dateIn: currentItem.dateIn?currentItem.dateIn:'',
    dateOut: currentItem.dateOut?currentItem.dateOut:'',
    noPurchase: currentItem.noPurchase?currentItem.noPurchase:'',
    paymentType: currentItem.paymentType?currentItem.paymentType:0,
    customerId: currentItem.customerId?currentItem.customerId:0,
    projectId: currentItem.projectId?currentItem.projectId:0,
    providerId: currentItem.providerId?currentItem.providerId:0,
    orderId: currentItem.orderId?currentItem.orderId:0,
    subtotal: currentItem.subtotal?currentItem.subtotal:0,
    discount: currentItem.discount?currentItem.discount:0,
    tax: currentItem.tax?currentItem.tax:0,
    total: currentItem.total?currentItem.total:0,
    notes: currentItem.notes?currentItem.notes:'',
    status: currentItem.id?currentItem.status:1
  }, formValidations);

  const {id} = formState;

  const onCustomerChange = (e) =>{
    const {target} = e;
    const {value} = target;

    const filter = listProjects.filter(item=>item.customerId===value);
    setListProjectFilter(filter);

    onBulkForm({
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

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/inventory/purchases', formState, resp=>{
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
      request.PUT(`/inventory/purchases/${id}`, formState, resp=>{
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
      onBulkForm,
      listProjectFilter,
      onCustomerChange
    }
  )
}
