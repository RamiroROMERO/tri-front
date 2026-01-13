import React, { useState, useEffect } from 'react';
import { Add, Delete, Edit, ViewList, WrapText } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { currencyFormatter, formatDateToShow, validInt } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';
import { request } from 'app/utils/core';

export const useLoans = ({setLoading, sweetAlerts, screenControl}) => {
  const { optDelete } = screenControl;
  const {t} = useTranslation();
  const [typeDetail, setTypeDetail] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [listEmployees, setListEmployees] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);

  const fnGetData = ()=>{
    setLoading(true);
    request.GET("/loans", (resp)=>{
      const data = resp.loans.map((item)=>{
        item.valPay = item.Pay || 0;
        item.statusIcon = item.valRest === 0 ? "Pagado" : "Pendiente";
        item.date = formatDateToShow(item.date);
        return item
      });

      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnNewDocto = ()=>{
    setCurrentItem({});
    setOpenModalNew(true);
  }

  const fnEditDocto = (item)=>{
    setCurrentItem(item);
    setOpenModalNew(true);
  }

  const fnDeleteDocto = (item)=>{
    if (optDelete === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setOpenMsgDelete(true);
  }

  const fnOkDelete = ()=>{
    if(validInt(currentItem.id)<=0){
      return;
    }
    setLoading(true);
    request.DELETE(`/loans`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
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
    },{id: currentItem.id});
  }

  const fnViewDetail = (item)=>{
    setTypeDetail(1);
    setCurrentItem(item);
    setOpenModalDetail(true);
  }

  const fnChangeCuote = (item)=>{
    setTypeDetail(2);
    setCurrentItem(item);
    setOpenModalDetail(true);
  }

  const table = {
    title: t("table.loans.title"),
    columns: [
      {field: 'date', headerName: t('table.loans.date'), flex: 0.6},
      {field: 'employeeName', headerName: t('table.loans.employee'), flex: 1},
      {
        field: 'value', headerName: t('table.loans.value'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {field: 'noCuotes', headerName: t('table.loans.cuotes'), flex: 0.5},
      {
        field: 'valCuote', headerName: t('table.loans.valCuote'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {field: 'description', headerName: t('table.loans.description'), flex: 1},
      {
        field: 'valPay', headerName: t('table.loans.valPay'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'valRest', headerName: t('table.loans.valRest'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {field: 'statusIcon', headerName: t('table.common.status'), flex: 0.5,
        renderCell: ({ row, field }) => {
          return (<Chip label={row[field]} color={row[field] === "Pagado" ? 'success' : 'warning'} variant={"outlined"} />)
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
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
          />,
          <GridActionsCellItem
            icon={<ViewList />}
            label= {t("action.detail")}
            onClick={() => fnViewDetail(row)}
            color='primary'
            showInMenu
          />,
          <GridActionsCellItem
            icon={<WrapText />}
            label= {t("action.changeCuote")}
            onClick={() => fnChangeCuote(row)}
            color='primary'
            showInMenu
          />
        ],
      },
    ],
    data: tableData,
    options: {
      pageSize: 20,
      rowsPerPageOptions: [20, 40, 60, 80]
    },
    freeActions: [{
      Icon: () => <Add />,
      label: t("datatable.buttons.newDocument"),
      onClick: fnNewDocto
    }]
  };

  useEffect(()=>{
    fnGetData();

    setLoading(true);
    request.GET('/employees/list?statusId=4', (resp)=>{
      const employees = resp.employees.map((item)=>{
        return {
          id: item.id,
          value: item.id,
          label: `${item.code} | ${item.name}`
        }
      });

      setListEmployees(employees);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  },[]);

  return (
    {
      table,
      currentItem,
      typeDetail,
      listEmployees,
      openModalNew,
      setOpenModalNew,
      openMsgDelete,
      setOpenMsgDelete,
      openModalDetail,
      setOpenModalDetail,
      fnGetData,
      fnOkDelete
    }
  )
}
