import { useEffect, useState } from 'react';
import { request } from 'app/utils/core';
import { useTranslation } from 'react-i18next';
import { currencyFormatter, formatDateToShow, validFloat } from 'app/utils/helpers';
import { ImportExport } from '@mui/icons-material';

export const usePaymentHistory = ({ setLoading, sweetAlerts, screenControl }) => {
  const { t } = useTranslation();
  const [totalRegHours, setTotalRegHours] = useState(0);
  const [totalOTHours, setTotalOTHours] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [listYears, setListYears] = useState([]);
  const [listWeeksWorked, setListWeeksWorked] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listProjects, setListProjects] = useState([]);
  const [listEmployees, setListEmployees] = useState([]);
  const [listClassifications, setListClassificactions] = useState([]);
  const [listCiaAccount, setListCiaAccount] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [paramsFilter, setParamsFilter] = useState({});
  const [enableFreeActions, setEnableFreeActions] = useState(true);

  const fnExportDocument = async () => {
    setLoading(true);
    const data = {
      view: "",
      where: {
        ...paramsFilter
      },
      fields: [
        { title: 'Week Number', field: 'noWeek', type: 'String', length: 50 },
        { title: 'Customer Name', field: 'customerName', type: 'String', length: 120, isSum: false, curreny: false },
        { title: 'Employee Code', field: 'employeeCode', type: 'String', length: 50, isSum: false, currency: false },
        { title: 'Employee Name', field: 'employeeName', type: 'String', length: 120, isSum: false, currency: false },
        { title: 'Classification', field: 'classificationName', type: 'String', length: 100, isSum: false, currency: false },
        { title: 'Project Name', field: 'projectName', type: 'String', length: 100, isSum: false, currency: false },
        { title: 'Working Days', field: 'daysWorked', type: 'decimal', length: 60, isSum: true, currency: false },
        { title: 'Regular Hours', field: 'hours', type: 'decimal', length: 60, isSum: true, currency: false },
        { title: 'Overtime Hours', field: 'hoursOvertime', type: 'decimal', length: 60, isSum: true, currency: false },
        { title: 'Total Payment', field: 'totalPayment', type: 'decimal', length: 60, isSum: true, currency: true },
      ],
      headerData: [
      ],
      reportTitle: "Payment History",
      typeFormat: 1,
      nameXLSXFile: "paymentHistory.xlsx",
    };
    await request.fnExportToXLSX("/reportPayrollMain/groupByAllXLSX", data, "paymentHistory.xlsx");
    setLoading(false);
  }

  const table = {
    title: t("table.paymentHistory.title"),
    columns: [
      {
        field: 'noWeek', headerName: t('table.paymentHistory.column.week'), flex: 0.4,
        cellClassName: ({ row }) => (validFloat(row.hours) < 40 && validFloat(row.hoursOvertime) > 0) ? 'div-danger-color' : ''
      },
      {
        field: 'customerName', headerName: t('table.paymentHistory.column.customerName'), flex: 0.8,
        cellClassName: ({ row }) => (validFloat(row.hours) < 40 && validFloat(row.hoursOvertime) > 0) ? 'div-danger-color' : ''
      },
      {
        field: 'employeeName', headerName: t('table.paymentHistory.column.employeeName'), flex: 0.9,
        cellClassName: ({ row }) => (validFloat(row.hours) < 40 && validFloat(row.hoursOvertime) > 0) ? 'div-danger-color' : ''
      },
      {
        field: 'classificationName', headerName: t('table.paymentHistory.column.classificationName'), flex: 0.6,
        cellClassName: ({ row }) => (validFloat(row.hours) < 40 && validFloat(row.hoursOvertime) > 0) ? 'div-danger-color' : ''
      },
      {
        field: 'projectName', headerName: t('table.paymentHistory.column.projectName'), flex: 0.6,
        cellClassName: ({ row }) => (validFloat(row.hours) < 40 && validFloat(row.hoursOvertime) > 0) ? 'div-danger-color' : ''
      },
      {
        field: 'daysWorked', headerName: t('table.paymentHistory.column.days'), flex: 0.4,
        cellClassName: ({ row }) => (validFloat(row.hours) < 40 && validFloat(row.hoursOvertime) > 0) ? 'div-danger-color' : ''
      },
      {
        field: 'hours', headerName: t('table.paymentHistory.column.regularHours'), flex: 0.4, type: 'number',
        cellClassName: ({ row }) => (validFloat(row.hours) < 40 && validFloat(row.hoursOvertime) > 0) ? 'div-danger-color' : ''
      },
      { field: 'hoursOvertime', headerName: t('table.paymentHistory.column.overtimeHours'), flex: 0.4, type: 'number', cellClassName: ({ row }) => (validFloat(row.hours) < 40 && validFloat(row.hoursOvertime) > 0) ? 'div-danger-color' : '' },
      {
        field: 'totalPayment', headerName: t('table.paymentHistory.column.totalPayment'), flex: 0.6, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value),
        cellClassName: ({ row }) => (validFloat(row.hours) < 40 && validFloat(row.hoursOvertime) > 0) ? 'div-danger-color' : ''
      }
    ],
    data: tableData,
    freeActions: [{
      Icon: () => <ImportExport />,
      label: t("action.exportToExcel"),
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
    request.GET('/setWeekYear/getYears', (resp) => {
      const filterList = resp.yearsWeeks.filter((item) => {
        return item.year !== null
      });
      const yearsList = filterList.map((item) => {
        return {
          value: item.year,
          label: item.year
        }
      });
      setListYears(yearsList);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/setWeekYear', (resp) => {
      const weeksYear = resp.setWeekYear.map((item) => {
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
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/customers/getSL?active=1', (resp) => {
      const customers = resp.customers.map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      });
      setListCustomers(customers);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET(`/projects`, (resp) => {
      const projects = resp.projects.map((item) => {
        return {
          value: item.id,
          label: `${item.code} | ${item.name}`
        }
      });
      setListProjects(projects);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/employees/list', (resp) => {
      const employees = resp.employees.map((item) => {
        return {
          value: item.id,
          label: `${item.code} | ${item.name}`
        }
      });
      setListEmployees(employees);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/classifications', (resp) => {
      const classifications = resp.classifications.map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      });
      setListClassificactions(classifications);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET('/employees/findCiaAccount', (resp) => {
      const ciaAccount = resp.ciaAccount.map((item) => {
        return {
          value: item.ciaAccount,
          label: item.ciaAccount
        }
      });
      const filterCiaAccount = ciaAccount.filter(item => item.value !== "");
      setListCiaAccount(filterCiaAccount);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }, []);

  const propsToHeader = {
    t,
    setLoading,
    listYears,
    listWeeksWorked,
    listCustomers,
    listProjects,
    listEmployees,
    listClassifications,
    listCiaAccount,
    setTotalRegHours,
    setTotalOTHours,
    setTotalPayment,
    setTableData,
    setEnableFreeActions,
    setParamsFilter,
    screenControl,
    sweetAlerts
  }

  const propsToFooter = {
    t,
    totalRegHours,
    totalOTHours,
    totalPayment
  }

  return (
    {
      table,
      propsToHeader,
      propsToFooter
    }
  )
}
