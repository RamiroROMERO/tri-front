import React, { useState, useEffect } from 'react'
import { Chip } from '@mui/material';
import { request } from 'app/utils/core';
import { formatDateToShow, validInt } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';
import { useForm } from 'app/hooks';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Edit, FormatIndentIncrease } from '@mui/icons-material';

export const useWeeklyProcess = ({setLoading, sweetAlerts, screenControl}) => {
  const { optCreate, optUpdate } = screenControl;
  const {t} = useTranslation();
  const [currentItem, setCurrentItem] = useState({});
  const [tableData, setTableData] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listYears, setListYears] = useState([]);
  const [listWeeks, setListWeeks] = useState([]);
  const [listAllWeeks, setListAllWeeks] = useState([]);
  const [sendForm, setSendForm] = useState(false);
  const [openModalSelectWeek, setOpenModalSelectWeek] = useState(false);
  const [selectWeekTitle, setSelectWeekTitle] = useState('dialog.selectWeek.title');

  const formValidations = {
    customerFilter: [(val) => validInt(val) !== 0, t("alertMessages.warning.customerId")]
  }

  const {formState, formValidation, isFormValid, onBulkForm} = useForm({
    customerFilter :0,
  }, formValidations);

  const {customerFilter} = formState;

  const fnGetData = (customerId=customerFilter)=>{
    setLoading(true);
    request.GET(`/viewWeeklyPayrollsReport/findProjects?customerId=${customerId}&statusId=1`, (resp)=>{
      const data = resp.payrollsReport.map((item)=>{
        item.statusIcon = item.status == 1 ? "check_box" : "check_box_outline_blank"
        return item;
      });
      setTableData(data);

      const filterWeeks = resp.listWeeks.filter(item => item.customerId === customerId);
      setListAllWeeks(filterWeeks);

      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const onCustomerChange = e =>{
    const customer = e.target.value;

    fnGetData(customer);
    onBulkForm({customerFilter: customer});
  }

  const fnEditHours = (item)=>{
    if (optUpdate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    let customerId = item.customerId?item.customerId:0;
    let projectId = item.id?item.id:0;
    setSelectWeekTitle('dialog.editWeek.title');

    setLoading(true);
    request.GET(`/weeklyPayrollsDetails/customerWeeksWorks?customerId=${customerId}&projectId=${projectId}`, (resp)=>{
      const data = resp.weeksWorks;

      // llenar select de semanas
      const weeksList = data.map((item)=>{
        return {
          value: item.weekId,
          label: `#${item.customersWeek.noWeek}  WEEK OF ${formatDateToShow(item.customersWeek.startDate)} TO ${formatDateToShow(item.customersWeek.endDate)}`,
          noYear: item.customersWeek.noYear,
          startDate: item.customersWeek.startDate,
          endDate: item.customersWeek.endDate
        }
      });
      setListWeeks(weeksList);

      // llenar select de años
      const yearsList = data.map((item)=>{
        return {
          value: item.customersWeek.noYear,
          label: item.customersWeek.noYear
        }
      });
      const filterYears = [...new Map(yearsList.map((item) => [item.label, item])).values()];
      setListYears(filterYears);

      setOpenModalSelectWeek(true);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnInsertHours = (item)=>{
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    let customerId = item.customerId?item.customerId:0;
    let projectId = item.id?item.id:0;
    setSelectWeekTitle('dialog.insertWeek.title');

    setLoading(true);
    request.GET(`/weeklyPayrolls/findWeeksDontWork?customerId=${customerId}&projectId=${projectId}`, (resp)=>{
      const data = resp.weeksDontWork;

      // llenar select de semanas
      const weeksList = data.map((item)=>{
        return {
          value: item.id,
          label: `#${item.noWeek} WEEK OF ${formatDateToShow(item.startDate)} TO ${formatDateToShow(item.endDate)}`,
          noYear: item.noYear,
          startDate: item.startDate,
          endDate: item.endDate
        }
      });
      setListWeeks(weeksList);

      // llenar select de años
      const yearsList = data.map((item)=>{
        return {
          value: item.noYear,
          label: item.noYear
        }
      });
      const filterYears = [...new Map(yearsList.map((item) => [item.label, item])).values()];
      setListYears(filterYears);

      setOpenModalSelectWeek(true);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnNewHours = (item)=>{
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    let customerId = item.customerId?item.customerId:0;
    let projectId = item.id?item.id:0;
    setSelectWeekTitle('dialog.newWeek.title');

    setLoading(true);
    request.GET(`/viewPayrollMain/maxDateSave?customerId=${customerId}&projectId=${projectId}`, (resp)=>{
      let data = [];

      let maxDateSave = resp.payrollMaxDateSave[0];
      if (maxDateSave && maxDateSave.endDate) {
        let maxDate = new Date(maxDateSave.endDate);
        let filterWeeks = listAllWeeks.filter(item => {
          return new Date(item.startDate) > maxDate;
        });
        data = filterWeeks
      } else {
        data = listAllWeeks
      }

      // llenar select de semanas
      const weeksList = data.map((item)=>{
        return {
          value: item.id,
          label: `#${item.noWeek}  WEEK OF ${formatDateToShow(item.startDate)} TO ${formatDateToShow(item.endDate)}`,
          noYear: item.noYear,
          startDate: item.startDate,
          endDate: item.endDate
        }
      });
      setListWeeks(weeksList);

      // llenar select de años
      const yearsList = data.map((item)=>{
        return {
          value: item.noYear,
          label: item.noYear
        }
      });
      const filterYears = [...new Map(yearsList.map((item) => [item.label, item])).values()];
      setListYears(filterYears);

      setOpenModalSelectWeek(true);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const table = {
    title: `${t("table.projects.title")}`,
    columns: [
      {field: 'customerName', headerName: t('table.projects.column.customerName'), flex: 1},
      {field: 'name', headerName: t('table.projects.column.name'), flex: 1},
      {field: 'code', headerName: t('table.projects.column.code'), flex: 0.6},
      {field: 'location_name', headerName: t('table.projects.column.location'), flex: 0.6},
      {
        field: 'statusName',
        headerName: t("table.common.status"),
        flex: 0.6,
        renderCell: ({row, field})=>{
          return (<Chip label={row[field]} color={row[field]==="Finalized"?'success':(row[field]==="In Progress"?'warning':'error')} variant={"outlined"}/>)
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
            label={t("action.editWeek")}
            onClick={() => fnEditHours(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<FormatIndentIncrease />}
            label= {t("action.insertWeek")}
            onClick={() => fnInsertHours(row)}
            color='warning'
          />,
          <GridActionsCellItem
            icon={<Add />}
            label= {t("action.newWeek")}
            onClick={() => fnNewHours(row)}
            color='success'
          />
        ],
      }
    ],
    data: tableData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  };

  useEffect(()=>{
    setLoading(true);
    request.GET('/customers/getSL?active=1', (resp)=>{
      const customers = resp.customers.map((item)=>{
        return {
          value: item.id,
          label: item.name
        }
      });
      setListCustomers(customers);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  },[]);

  return (
    {
      table,
      listCustomers,
      listYears,
      listWeeks,
      currentItem,
      formState,
      formValidation,
      isFormValid,
      sendForm,
      t,
      selectWeekTitle,
      openModalSelectWeek,
      setOpenModalSelectWeek,
      onCustomerChange
    }
  )
}
