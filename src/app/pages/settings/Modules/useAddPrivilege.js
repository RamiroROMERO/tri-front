import { Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useForm } from 'app/hooks'
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useAddPrivilege = ({setLoading, moduleId, sweetAlerts}) => {
  const {t} = useTranslation();
  const [sendForm, setSendForm] = useState(false);
  const [tableData, setTableData] = useState([]);

  const formValidations = {
    name: [(val) => val.length >= 4, t("alertMessages.warning.nameValid")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: 0,
    name: '',
    type: 0
  }, formValidations);

  const {id, name, type} = formState;

  const fnGetData = ()=>{
    setLoading(true);
    request.GET(`/privileges?moduleId=${moduleId}`, (resp)=>{
      const {provileges} = resp;
      const dataPrivileges = provileges.map((item)=>{
        item.typeName = item.type===1?"Administrative":"General"
        return item;
      });
      setTableData(dataPrivileges);
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

    const newData = {
      id,
      moduleId,
      name,
      type
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/privileges', newData, resp=>{
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
      request.PUT('/privileges', newData, resp=>{
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

  const fnNew = ()=>{
    onResetForm();
    setSendForm(false);
  }

  const fnEdit = (item)=>{
    onBulkForm(item);
  }

  const table = {
    title: t("table.privileges.title"),
    columns: [
      {field: 'id', headerName: t('table.common.num'), flex: 0.2 },
      {field: 'name', headerName: t('table.modules.column.name'), flex: 1 },
      {field: 'typeName', headerName: t('table.privileges.column.type'), flex: 0.4 },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 90,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnEdit(row)}
            color='info'
          />
        ]
      }
    ],
    data: tableData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [5, 10, 15, 20]
    }
  };

  useEffect(()=>{
    fnGetData();
  },[]);

  return (
    {
      formState,
      onInputChange,
      isFormValid,
      formValidation,
      sendForm,
      fnSave,
      fnNew,
      table
    }
  )
}
