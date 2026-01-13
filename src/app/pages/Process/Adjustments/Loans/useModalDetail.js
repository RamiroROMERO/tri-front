import React, { useState, useEffect } from 'react';
import { currencyFormatter, formatDateToShow, validFloat, validInt } from 'app/utils/helpers';
import { Chip } from '@mui/material';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';

export const useModalDetail = ({t, currentItem, setLoading, sweetAlerts, fnGetData, controlAdmin}) => {
  const [tableData, setTableData] = useState([]);
  const [sendForm, setSendForm] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [buttonRegActive, setButtonRegActive] = useState(false);

  const formValidations = {
    value: [(val) => validFloat(val) !== 0, t("alertMessages.warning.value")],
    valCuote: [(val) => validFloat(val) !== 0, t("alertMessages.warning.valCuote")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem?.id || 0,
    value: currentItem?.value || 0,
    valCuote: currentItem?.valCuote || 0,
    noCuotes: currentItem?.noCuotes || 0
  }, formValidations);

  const {id, value, valCuote} = formState;

  const onValCuoteChange = e=>{
    const valueCuote = e.target.value;

    let qtyCuotes = 0;
    if (validInt(valueCuote) > 0) {
      qtyCuotes = validFloat(value/valueCuote);
    }

    onBulkForm({valCuote: valueCuote, noCuotes: qtyCuotes});
  }

  const table = {
    title: t("table.loansDetail.title"),
    columns: [
      {field: 'noCuote', headerName: t('table.loansDetail.noCuote'), flex: 0.3},
      {
        field: 'valueCuote', headerName: t('table.loansDetail.valueCuote'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {field: 'datePay', headerName: t('table.loansDetail.datePay'), flex: 0.5},
      {field: 'statusIcon', headerName: t('table.common.status'), flex: 0.5,
        renderCell: ({ row, field }) => {
          return (<Chip  label={row[field]} color={row[field] === "Pagado" ? 'success' : 'warning'} variant={"outlined"} />)
        }
      }
    ],
    data: tableData,
    options: {
      pageSize: 5,
      rowsPerPageOptions: [5, 10, 15, 20]
    }
  };

  const fnGetDetail = ()=>{
    setLoading(true);
    request.GET(`/loansDetail?loanId=${currentItem.id}`, (resp)=>{
      const data = resp.loanDetail.map((item)=>{
        item.statusIcon = item.valRest === 0 ? "Pagado" : "Pendiente";
        item.datePay = formatDateToShow(item.datePay);
        return item
      });

      if(data.length > 0){
        setButtonActive(true);
        setButtonRegActive(false);
      }else{
        setButtonActive(false);
        setButtonRegActive(true);
      }

      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnGenerate = ()=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = { id };

    setLoading(true);
    request.POST('/loans/generateDetail', newData, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetData();
      setSendForm(false);
      fnGetDetail();
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

  const fnRegenerate = ()=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = { id, newCuote: valCuote };

    setLoading(true);
    request.POST('/loans/reGenerateDetail', newData, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setSendForm(false);
      fnGetDetail();
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

  useEffect(()=>{
    fnGetDetail();
  },[]);

  return (
    {
      table,
      formState,
      formValidation,
      isFormValid,
      sendForm,
      buttonActive,
      buttonRegActive,
      onInputChange,
      onValCuoteChange,
      fnGenerate,
      fnRegenerate
    }
  )
}
