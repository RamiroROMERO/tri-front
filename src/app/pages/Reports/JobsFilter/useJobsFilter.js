import React, { useState, useEffect } from 'react';
import { request } from 'app/utils/core';
import { useTranslation } from 'react-i18next';
import { formatDateToShow, validFloat } from 'app/utils/helpers';
import { Chip } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { LocalAtm, Receipt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ModalViewDetail } from 'app/pages/Process/Invoices/ModalViewDetail';
import { ModalGenerateInvoice } from 'app/pages/Process/Invoices/ModalGenerateInvoice';

export const useJobsFilter = ({setLoading, sweetAlerts, screenControl, controlAdmin}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [weekSelectedId, setWeekSelectedId] = useState(0);
  const [listYears, setListYears] = useState([]);
  const [listWeeksWorked, setListWeeksWorked] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listProjects, setListProjects] = useState([]);
  const [listLocations, setListLocations] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowsSelected, setRowsSelected] = useState([]);
  const [listQbAccounts, setListQbAccounts] = useState([]);
  const [listCustomerOnQbk, setListCustomerOnQbk] = useState([]);
  const [dataInvoiceReview, setDataInvoiceReview] = useState([]);
  const [dataInvoiceTotal, setDataInvoiceTotal] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [paramsFilter, setParamsFilter] = useState({});
  const [openInvoiceDetail, setOpenInvoiceDetail] = useState(false);
  const [openGenerateInvoice, setOpenGenerateInvoice] = useState(false);
  const [openInvoiceReview, setOpenInvoiceReview] = useState(false);

  const fnViewInvoice = (item)=>{
    const projectList = [item.idProject];

    const newDataItem = {
      customerName: item.customerName,
      projectName: item.projectName,
      customerId: item.customerId,
      projectList,
      isMissingTime: 0
    }

    setCurrentItem(newDataItem);

    const where = {
      customerId: item.customerId,
      weekId: item.weekId,
      projectList,
      invoiceMissingtime: 0
    }

    setLoading(true)
    request.POST('/weeklyPayrollsDetails/getInvoicesList', where, res=>{
      const data2 = res.invoices.map((item) => {
        return {
          id: item.id,
          idProject: item.id,
          projectName: item.code + ' - ' + item.name,
          location: item.location.name,
          regularHours: item.regularHours,
          overtimeHours: item.overtimeHours,
          subTotal: validFloat(item.subTotal),
          amountDiscount: validFloat(item.amountDiscount),
          total: validFloat(item.total),
          customerName: item.customer.name,
          isMissingTime: item.isMissingTime,
          projectList: projectList
        }
      });
      setRowsSelected(data2);
      setLoading(false)
    }, err=>{
      console.error(err);
      setLoading(false);
    });

    setWeekSelectedId(item.weekId);

    const dataParams = {
      weekSelect: `#${item.customersWeek.noWeek} WEEK OF ${formatDateToShow(item.customersWeek.startDate)} TO ${formatDateToShow(item.customersWeek.endDate)}`,
      weekId: item.weekId,
      customerId: item.customerId
    }
    setParamsFilter(dataParams);

    // data para modal de generar invoice
    setLoading(true);
    request.GET(`/viewQbkCustomers?customerId=${item.customerId}`, (resp)=>{
      const qbkAccounts = resp.data.map((item)=>{
        return {
          id: item.quickbookCompanyId,
          value: item.quickbookCompanyId,
          label: item.quickbookCompanyName
        }
      });

      setListQbAccounts(qbkAccounts);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET(`/customersQuickbook?customerId=${item.customerId}`, (resp)=>{
      setListCustomerOnQbk(resp.qbkCustomers);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });

    setOpenInvoiceDetail(true);
  }

  const fnViewPayroll = (item)=>{
    let customerId = item.customer.id;
    let { weekId, customersWeek, project } = item;
    let { noYear } = customersWeek;
    let { location } = project;
    let listProjects = [];
    listProjects[project.code + '-' + project.name] = { id: project.id, name: project.name, selected: true };
    let locationList = []
    locationList[location ? location.name : ''] = location ? { id: location.id, name: location.name, selected: true } : { id: 0, name: '', selected: true };
    let locationSelected = [location ? location.id : 0];
    let projectSelected = [project ? project.id : 0];

    const pathToReturn = '/reports/jobsFilter';

    const data = {
      customerId,
      noYear,
      weekId,
      projectSelected,
      locationSelected,
      customersWeek,
      pathToReturn
    }

    navigate(`/process/payroll`, {
      replace: true,
      state: data
    });
  }

  const table = {
    title: t("table.projects.title"),
    columns: [
      {field: 'customerCode', headerName: t('table.projects.column.customerCode'), flex: 0.6},
      {field: 'customerName', headerName: t('table.projects.column.customerName'), flex: 0.8},
      {field: 'code', headerName: t('table.projects.column.code'), flex: 0.6},
      {field: 'name', headerName: t('table.projects.column.name'), flex: 0.9},
      {field: 'locationName', headerName: t('table.projects.column.location'), flex: 0.6},
      {
        field: 'statusName',
        headerName: t("table.common.status"),
        flex: 0.6,
        renderCell: ({row, field})=>{
          return (<Chip label={row[field]} color={row[field]==="Finalized"?'success':(row[field]==="In Progress"?'warning':'error')} variant={"outlined"}/>)
        }
      },
      {field: 'noWeek', headerName: t('table.projects.column.no_week'), flex: 0.4},
      {field: 'weekOutFormat', headerName: t('table.projects.column.endDate'), flex: 0.6},
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 100,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Receipt />}
            label={t("action.viewInvoice")}
            onClick={() => fnViewInvoice(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<LocalAtm />}
            label= {t("action.viewPayroll")}
            onClick={() => fnViewPayroll(row)}
            color='warning'
          />
        ],
      }
    ],
    data: tableData,
    options: {
      pageSize: 20,
      rowsPerPageOptions: [20, 40, 60, 80]
    }
  };

  useEffect(()=>{
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

    setLoading(true);
    request.GET(`/projects`, (resp)=>{
      const projects = resp.projects.map((item)=>{
        return {
          value: item.id,
          label: `${item.code} | ${item.name}`
        }
      });
      setListProjects(projects);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/locations', (resp)=>{
      const locations = resp.locations.map((item)=>{
        return {
          value: item.id,
          label: item.name
        }
      });
      setListLocations(locations);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  },[]);

  const propsToModalInvoiceDetail = {
    title: 'dialog.invoiceReview.title',
    DialogContent: ModalViewDetail,
    open: openInvoiceDetail,
    setOpen: setOpenInvoiceDetail,
    maxWidth: 'xl',
    data: {
      setLoading,
      currentItem,
      paramsFilter,
      weekSelectedId,
      sweetAlerts,
      setOpenGenerateInvoice,
      screenControl
    }
  };

  const propsToModalGenerateInvoice = {
    title: 'dialog.generateInvoice.title',
    DialogContent: ModalGenerateInvoice,
    open: openGenerateInvoice,
    setOpen: setOpenGenerateInvoice,
    maxWidth: 'sm',
    data: {
      controlAdmin,
      paramsFilter,
      rowsSelected,
      listQbAccounts,
      listCustomerOnQbk,
      setLoading,
      sweetAlerts,
      dataInvoiceReview,
      dataInvoiceTotal,
      openInvoiceReview,
      setDataInvoiceReview,
      setDataInvoiceTotal,
      setOpenInvoiceReview
    }
  };

  const propsToHeader = {
    t,
    setLoading,
    listYears,
    listWeeksWorked,
    listCustomers,
    listProjects,
    listLocations,
    setTableData,
    screenControl,
    sweetAlerts
  }

  return (
    {
      propsToHeader,
      table,
      propsToModalInvoiceDetail,
      propsToModalGenerateInvoice
    }
  )
}
