import { useState, useEffect } from 'react'
import { useForm } from 'app/hooks';
import { validFloat, validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';

export const useModalClassifications = ({t, setLoading, sweetAlerts, customerId}) => {
  const [tableData, setTableData] = useState([]);
  const [sendForm, setSendForm] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);

  const formValidations = {
    classificationId: [(val) => validInt(val) !== 0, t("alertMessages.warning.classification")],
    ratePayroll: [(val) => validInt(val) !== 0, t("alertMessages.warning.ratePayroll")],
    rateInvoice: [(val) => validInt(val) !== 0, t("alertMessages.warning.rateInvoice")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: 0,
    classificationId: 0,
    ratePayroll: 0,
    percOtPayroll: 0,
    rateOtPayroll: 0,
    rateInvoice: 0,
    percOtInvoice: 0,
    rateOtInvoice: 0
  }, formValidations);

  const {id, classificationId, ratePayroll, percOtPayroll, rateOtPayroll, rateInvoice, percOtInvoice, rateOtInvoice} = formState;

  const onPercOtPayrollChange = e =>{
    const percValue = validFloat(e.target.value);
    let rateOtP = 0;
    if (percValue > 0) {
      rateOtP = ((percValue / 100) * validFloat(ratePayroll)) + validFloat(ratePayroll);
    }

    onBulkForm({
      percOtPayroll: percValue,
      rateOtPayroll: rateOtP
    });
  }

  const onPercOtInvoiceChange = e =>{
    const percValue = validFloat(e.target.value);
    let rateOtI = 0;
    if (percValue > 0) {
      rateOtI = ((percValue / 100) * validFloat(rateInvoice)) + validFloat(rateInvoice);
    }

    onBulkForm({
      percOtInvoice: percValue,
      rateOtInvoice: rateOtI
    });
  }

  const fnGetData = ()=>{
    setLoading(true);
    request.GET(`/customerClassifications?customerId=${customerId}`, (resp)=>{
      const data = resp.customersClassifications.map((item)=>{
        item.classificationName = item.classification?.name || ''
        item.statusIcon = item.status == 1 ? "check_box" : "check_box_outline_blank"
        return item;
      });
      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnNewDocto = ()=>{
    onResetForm();
    setSendForm(false);
  }

  const fnEditDocto = (item)=>{
    onBulkForm(item);
  }

  const fnDeleteDocto = (item)=>{
    onBulkForm({id: item.id});
    setOpenMsgDelete(true);
  }

  const fnOkDelete = ()=>{
    if(validInt(id)<=0){
      return;
    }
    setLoading(true);
    request.DELETE(`/customerClassifications`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnNewDocto();
      fnGetData();
      setLoading(false);
    }, err=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    },{id});
  }

  const fnSave = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      id,
      customerId,
      classificationId,
      ratePayroll,
      percOtPayroll,
      rateOtPayroll,
      rateInvoice,
      percOtInvoice,
      rateOtInvoice
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/customerClassifications', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        onResetForm();
        setSendForm(false);
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
      request.PUT('/customerClassifications', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        onResetForm();
        setSendForm(false);
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

  const table = {
    title: t("table.classifications.title"),
    columns: [
      {field: 'classificationName', headerName: t('table.common.classifications'), flex: 1},
      {field: 'ratePayroll', headerName: t('table.classifications.rateByHour'), flex: 0.5},
      {field: 'rateInvoice', headerName: t('table.classifications.rateByInvoice'), flex: 0.5},
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 110,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnEditDocto(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label= {t("button.delete")}
            onClick={() => fnDeleteDocto(row)}
            color='error'
          />
        ],
      },
    ],
    data: tableData,
    options: {
      pageSize: 5,
      rowsPerPageOptions: [5, 10, 15, 20]
    }
  };

  useEffect(()=>{
    fnGetData();
  },[]);

  return (
    {
      table,
      formState,
      formValidation,
      isFormValid,
      sendForm,
      openMsgDelete,
      setOpenMsgDelete,
      onInputChange,
      onPercOtPayrollChange,
      onPercOtInvoiceChange,
      fnSave,
      fnNewDocto,
      fnOkDelete
    }
  )
}
