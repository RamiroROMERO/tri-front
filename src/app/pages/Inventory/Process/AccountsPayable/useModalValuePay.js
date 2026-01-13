import { useState, useEffect } from 'react';
import { request } from 'app/utils/core';
import { currencyFormatter, validFloat } from 'app/utils/helpers';
import { useForm } from 'app/hooks';
import moment from 'moment';

export const useModalValuePay = ({t, setLoading, currentItemDeta, providerId, sweetAlerts, fnGetData, fnGetDataDetail}) => {
  const [tableData, setTableData] = useState([]);
  const [sendForm, setSendForm] = useState(false);
  const [valuePending, setValuePending] = useState(validFloat(currentItemDeta?.rest) || 0);

  const formValidations = {
    value: [(val)=> validFloat(val)>0, t("alertMessages.warning.value")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: 0,
    date: moment(new Date()).format("YYYY-MM-DD"),
    value: 0
  }, formValidations);

  const {date, value} = formState;

  const fnGetDataPayments = ()=>{
    setLoading(true);
    request.GET(`/inventory/cxpPayments?cxpId=${currentItemDeta.id}`, (resp)=>{
      const data= resp.data;
      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnSave = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    if(valuePending===0){
      sweetAlerts('error', t("alertMessages.warning.valueNotPending"));
      return;
    }

    if(validFloat(value) > validFloat(valuePending)){
      sweetAlerts('error', t("alertMessages.warning.valueIsGreater"));
      return;
    }

    const newData = {
      cxpId: currentItemDeta.id,
      providerId,
      date,
      purchaseNumber: currentItemDeta.purchaseNumber,
      value
    }

    request.POST('/inventory/cxpPayments', newData, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      const newValuePending = validFloat(valuePending) - validFloat(value);
      setValuePending(newValuePending);
      fnGetDataPayments();
      fnGetData();
      fnGetDataDetail();
      setSendForm(false);
      onResetForm();
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
  };

  const table = {
    title: '',
    columns: [
      {
        field: 'date',
        headerName: t("table.common.date"),
        flex: 0.5
      },
      {
        field: 'value',
        headerName: t("table.accountsPayable.detail.valuePaid"),
        flex: 0.5,
        type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      }
    ],
    data: tableData,
    options: {
      pageSize: 5,
      rowsPerPageOptions: [5, 10, 15, 20]
    }
  }

  useEffect(()=>{
    fnGetDataPayments();
  },[]);

  return (
    {
      table,
      formState,
      formValidation,
      isFormValid,
      onInputChange,
      sendForm,
      fnSave,
      valuePending
    }
  )
}
