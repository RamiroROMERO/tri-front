import React, { useState } from 'react'
import { Delete, Edit } from '@mui/icons-material';
import { Icon } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { request } from 'app/utils/core';
import { useForm } from 'app/hooks';
import { useEffect } from 'react';
import { validInt } from 'app/utils/helpers';

export const useQuickbookCustomer = ({t, setLoading, sweetAlerts, customerId}) => {
  const [tableData, setTableData] = useState([]);
  const [sendForm, setSendForm] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [listCustomerQuickbook, setListCustomerQuickbook] = useState([]);
  const [currentItem, setCurrentItem] = useState({});

  const formValidations = {
    quickbookCompanyId: [(val) => validInt(val) !== 0, t("alertMessages.warning.quickbookCompanyId")],
    quickbookCustomerId: [(val) => validInt(val) !== 0, t("alertMessages.warning.quickbookCustomerId")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: 0,
    quickbookCompanyId: 0,
    quickbookCustomerId: 0,
    quickbookCustomerName: '',
    status: true
  }, formValidations);

  const {id, quickbookCompanyId, quickbookCustomerId, status} = formState;

  const fnGetData = ()=>{
    setLoading(true);
    request.GET(`/customersQuickbook?customerId=${customerId}`, (resp)=>{
      const data = resp.qbkCustomers.map((item)=>{
        item.quickbookCompanyName = item.qbCompany?.name || ''
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

  const fnGetCustomerQuikbook = (idQbk)=>{
    setLoading(true);
    request.POST(`/qboApi/getCustomers`, { "qboCompany": idQbk }, (resp)=>{
      const QBCustumers = resp.data.map((item)=>{
        return {
          value: validInt(item.id),
          label: item.name
        }
      });
      setListCustomerQuickbook(QBCustumers);
      onBulkForm({
        quickbookCompanyId: idQbk,
        quickbookCustomerId: currentItem?.quickbookCustomerId || 0,
      });
      setCurrentItem({});
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const onQuickbookCompanyChange = e =>{
    const idQbk = e.target.value;
    if(idQbk===0) return;
    onBulkForm({
      quickbookCustomerName: "",
      quickbookCustomerId: 0
    });
    fnGetCustomerQuikbook(idQbk);
  }

  const fnNewDocto = ()=>{
    onResetForm();
    setCurrentItem({});
    setSendForm(false);
  }

  const fnEditDocto = (item)=>{
    setListCustomerQuickbook([]);
    onBulkForm(item);
    setCurrentItem(item);
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
    request.DELETE(`/customersQuickbook`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetData();
      fnNewDocto();
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

    const filterQBCust = listCustomerQuickbook.find(item=>item.value===quickbookCustomerId);
    const quickbookCustomerName = filterQBCust.label;

    const newData = {
      id,
      customerId,
      quickbookCompanyId,
      quickbookCustomerId,
      quickbookCustomerName,
      status
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/customersQuickbook', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        fnNewDocto();
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
      request.PUT('/customersQuickbook', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        fnNewDocto();
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
    title: t("table.customer.quickbook.title"),
    columns: [
      {field: 'quickbookCompanyName', headerName: t('table.common.quickBookCompany'), flex: 1},
      {field: 'quickbookCustomerName', headerName: t('table.common.quickBookCustomers'), flex: 1},
      {
        field: 'statusIcon',
        headerName: t("table.common.status"),
        sortable: false,
        flex: 0.3,
        renderCell: ({ row, field }) => {
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 90,
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
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
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
      onInputChange,
      onQuickbookCompanyChange,
      listCustomerQuickbook,
      fnSave,
      fnNewDocto,
      openMsgDelete,
      setOpenMsgDelete,
      fnOkDelete
    }
  )
}
