import React, { useEffect, useState } from 'react'
import { Delete, Edit } from '@mui/icons-material';
import { Icon } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { currencyFormatter, formatDateToShow, validInt } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';
import { request } from 'app/utils/core';

export const useMissingTimes = ({setLoading, sweetAlerts, screenControl}) => {
  const { optDelete } = screenControl;
  const {t} = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [listYears, setListYears] = useState([]);
  const [listWeeksWorked, setListWeeksWorked] = useState([]);
  const [listEmployees, setListEmployees] = useState([]);
  const listMissingType = [{ value: 1, label: "Missing Time" }, { value: 2, label: "Missing Overtime" }];
  const [currentItem, setCurrentItem] = useState({});
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);

  const fnGetData = ()=>{
    setLoading(true);
    request.GET("/missingTimes", (resp)=>{
      const data = resp.missingTimes.map((item)=>{
        item.weekYear = `${item.SetWeekYear1?.noWeek || ''} - ${item.SetWeekYear1?.year || ''}`;
        item.name = item.employee?.name || '';
        item.project = `${item.project?.code || ''} - ${item.project?.name || ''}`;
        item.type = item.typeId === 1 ? "Missing Time" : "Missing Overtime";
        item.hours = item.qty;
        item.inInvoiceIcon = item.inInvoice===1?'check_box':'check_box_outline_blank';
        item.inCheckIcon = item.inCheck===1?'check_box':'check_box_outline_blank';
        return item
      });

      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnEditDocto = (item)=>{
    setCurrentItem(item);
    setOpenModalEdit(true);
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
    request.DELETE(`/missingTimes`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setCurrentItem({});
      fnGetData();
      setLoading(false);
    }, err=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setCurrentItem({});
      setLoading(false);
    },{id: currentItem.id});
  }

  const table = {
    title: t("table.missingtime.title"),
    columns: [
      {field: 'name', headerName: t('table.missingtime.column.name'), flex: 1.2},
      {field: 'project', headerName: t('table.missingtime.column.project'), flex: 1},
      {field: 'weekYear', headerName: t('dialog.selectWeek.title'), flex: 0.5},
      {field: 'type', headerName: t('table.missingtime.column.type'), flex: 0.6},
      {
        field: 'hours', headerName: t('table.missingtime.column.hours'), flex: 0.5, type: 'number'
      },
      {
        field: 'totalPayroll', headerName: t('table.missingtime.column.totalPayroll'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'totalInvoice', headerName: t('table.missingtime.column.totalInvoice'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {field: 'inInvoiceIcon', headerName: t('table.missingtime.column.inInvoice'), flex: 0.3,
        renderCell: ({row, field})=>{
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {field: 'inCheckIcon', headerName: t('table.missingtime.column.inCheck'), flex: 0.3,
        renderCell: ({row, field})=>{
          return (<Icon>{row[field]}</Icon>)
        }
      },
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
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 40]
    }
  };

  useEffect(()=>{
    fnGetData();

    setLoading(true);
    request.GET('/setWeekYear/getYears', (resp)=>{
      const filterList = resp.yearsWeeks.filter((item)=>{
        return item.year !== null
      });
      const yearsList = filterList.map((item)=>{
        return {
          value: item.year,
          label: item.year
        }
      });
      setListYears(yearsList);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/setWeekYear', (resp)=>{
      const weeksYear = resp.setWeekYear.map((item)=>{
        return {
          id: item.id,
          value: item.id,
          label: `#${item.noWeek} WEEK OF ${formatDateToShow(item.startDate)} TO ${formatDateToShow(item.endDate)}`,
          year: item.year,
          startDate: item.startDate,
          endDate: item.endDate,
          noWeek: item.noWeek
        }
      });

      setListWeeksWorked(weeksYear);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });

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

  const propsToHeader = {
    t,
    setLoading,
    sweetAlerts,
    listYears,
    listWeeksWorked,
    listEmployees,
    listMissingType,
    fnGetData,
    screenControl
  }

  return (
    {
      propsToHeader,
      table,
      currentItem,
      openMsgDelete,
      setOpenMsgDelete,
      openModalEdit,
      setOpenModalEdit,
      fnOkDelete,
      fnGetData
    }
  )
}
