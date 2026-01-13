import { useState, useEffect } from 'react';
import { request } from 'app/utils/core';
import { useTranslation } from 'react-i18next';
import { ImportExport } from '@mui/icons-material';
import { formatDateToShow } from 'app/utils/helpers';
import moment from 'moment';

export const useActiveEmployees = ({ setLoading, sweetAlerts, screenControl }) => {
  const { t } = useTranslation();
  const [listCustomers, setListCustomers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [paramsFilter, setParamsFilter] = useState({});
  const [enableFreeActions, setEnableFreeActions] = useState(true);

  const fnExportRoster = async () => {

    const currentDate = moment().format("MM/DD/YYYY");
    let data = {
      view: "",
      where: {
        customerId: paramsFilter.customerId,
        weekId: paramsFilter.weekId
      },
      fields: [
        { title: 'Count', field: 'count', type: 'String', length: 30 },
        { title: 'First Name', field: 'firstName', type: 'String', length: 120 },
        { title: 'Last Name', field: 'lastName', type: 'String', length: 120 },
        { title: 'Classification', field: 'classification', type: 'String', length: 50, isSum: false, curreny: false },
        { title: 'Bill Rate', field: 'invoiceRate', type: 'decimal', length: 60, isSum: false, currency: true },
        { title: 'Email', field: 'email', type: 'String', length: 120 },
        { title: 'Phone #', field: 'phone', type: 'String', length: 120 },
        { title: 'Home Location', field: 'address', type: 'String', length: 150 },
        { title: 'Date Started', field: 'dateStarted', type: 'String', length: 60, isSum: false, currency: false },
        { title: 'Jobsite Name', field: 'location', type: 'String', length: 150 },
      ],
      headerData: [
        { title: 'Date', description: currentDate },
        { title: 'Agency Name', description: 'TECHSOURCE WORKFORCE SOLUTION' },
        { title: 'Representative Name', description: 'Carlos A. Sanchez' },
        { title: 'Representative Email', description: 'csanchez@tsourcews.com' }
      ],
      reportTitle: "Temp Agency Weekly Roster",
      typeFormat: 1,
      nameXLSXFile: "WeeklyRoster.xlsx",
    };
    setLoading(true);
    await request.fnExportToXLSX("/weeklyPayrollsDetails/getEmployeeWorkedXLSX", data, "WeeklyRoster.xlsx", () => { setLoading(false) });
    setLoading(false);
  }

  const fnExportDocument = async () => {

    const filterCustomers = listCustomers.find(item => item.id === paramsFilter.customerId);

    const customerName = filterCustomers?.label || "";
    const weekDescription = `#${paramsFilter.noWeek} WEEK OF ${formatDateToShow(paramsFilter.startDate)} TO ${formatDateToShow(paramsFilter.endDate)}`;
    const currentDate = moment().format("MM/DD/YYYY");
    let data = {
      view: "",
      where: {
        customerId: paramsFilter.customerId,
        weekId: paramsFilter.weekId
      },
      fields: [
        { title: 'Name', field: 'name', type: 'String', length: 120 },
        { title: 'Classification', field: 'classification', type: 'String', length: 50, isSum: false, curreny: false },
        { title: 'Project Code', field: 'projectCode', type: 'String', length: 50, isSum: false, curreny: false },
        { title: 'Project Location', field: 'location', type: 'String', length: 50, isSum: false, currency: false },
        { title: 'Hours Worked', field: 'hoursWorked', type: 'decimal', length: 50, isSum: false, currency: false },
        { title: 'Payroll Rate', field: 'payrollRate', type: 'decimal', length: 60, isSum: false, currency: true },
        { title: 'Payroll OT Rate', field: 'payrollOTRate', type: 'decimal', length: 60, isSum: false, currency: true }, { title: 'Bill Rate', field: 'invoiceRate', type: 'decimal', length: 60, isSum: false, currency: true },
        { title: 'Invoice OT Rate', field: 'invoiceOTRate', type: 'decimal', length: 60, isSum: false, currency: true }, { title: 'Date Started', field: 'dateStarted', type: 'String', length: 60, isSum: false, currency: false }
      ],
      headerData: [
        { title: 'Date:', description: currentDate },
        { title: 'Customer Name:', description: customerName },
        { title: 'Week:', description: weekDescription }
      ],
      reportTitle: "Active Employees",
      typeFormat: 1,
      nameXLSXFile: "ActiveEmployees.xlsx",
    };
    setLoading(true);
    await request.fnExportToXLSX("/weeklyPayrollsDetails/getEmployeeWorkedXLSX", data, "ActiveEmployees.xlsx", () => { setLoading(false) });
    setLoading(false);
  }

  const table = {
    title: t("table.activeEmployees.title"),
    columns: [
      { field: 'name', headerName: t('table.activeEmployees.column.name'), flex: 0.8 },
      { field: 'classification', headerName: t('table.activeEmployees.column.classification'), flex: 0.6 },
      { field: 'location', headerName: t('table.activeEmployees.column.jobSite'), flex: 0.5 },
      { field: 'hoursWorked', headerName: t('table.payrolls.column.hoursWorked'), flex: 0.4, type: 'number' },
      { field: 'payrollRate', headerName: t('table.activeEmployees.column.payRate'), flex: 0.4, type: 'number' },
      { field: 'payrollOTRate', headerName: t('table.activeEmployees.column.payRateOvertime'), flex: 0.5 },
      { field: 'invoiceRate', headerName: t('table.activeEmployees.column.billRate'), flex: 0.5 },
      { field: 'invoiceOTRate', headerName: t('table.activeEmployees.column.billRateOvertime'), flex: 0.5 },
      { field: 'startDate', headerName: t('table.activeEmployees.column.startDate'), flex: 0.5 }
    ],
    data: tableData,
    freeActions: [{
      Icon: () => <ImportExport />,
      label: t("action.exportRoster"),
      showLabel: true,
      onClick: fnExportRoster,
      color: 'info',
      disabled: enableFreeActions
    }, {
      Icon: () => <ImportExport />,
      label: t("action.activeEmployees"),
      showLabel: true,
      onClick: fnExportDocument,
      color: 'primary',
      disabled: enableFreeActions
    }],
    options: {
      pageSize: 20,
      rowsPerPageOptions: [20, 40, 60, 80]
    }
  };

  useEffect(() => {
    setLoading(true);
    request.GET(`/customers/list`, (resp) => {
      const customers = resp.customers.map((item) => {
        return {
          id: item.id,
          value: item.id,
          label: item.name,
          code: item.code
        }
      });

      setListCustomers(customers);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }, []);

  const propsToHeader = {
    t,
    setLoading,
    sweetAlerts,
    listCustomers,
    setTableData,
    setEnableFreeActions,
    setParamsFilter,
    screenControl
  }

  return (
    {
      table,
      propsToHeader
    }
  )
}
