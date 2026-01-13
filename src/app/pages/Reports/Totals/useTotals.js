import { useEffect, useState } from 'react';
import { request } from 'app/utils/core';
import { currencyFormatter, formatDateToShow } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';
import { ImportExport, LocationCity, PictureAsPdf, Toc } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';

export const useTotals = ({ setLoading, sweetAlerts, screenControl }) => {
  const { t } = useTranslation();
  const [rowsSelectedCount, setRowsSelectedCount] = useState(0);
  const [listYears, setListYears] = useState([]);
  const [listWeeksWorked, setListWeeksWorked] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listProjects, setListProjects] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableRowsSelected, setTableRowsSelected] = useState([]);
  const [rowsSelected, setRowsSelected] = useState([]);
  const [paramsFilter, setParamsFilter] = useState({});
  const [totalsData, setTotalsData] = useState({});
  const [currentItem, setCurrentItem] = useState({});
  const [enableFreeActions, setEnableFreeActions] = useState(true);
  const [openModalViewByProject, setOpenModalViewByProject] = useState(false);
  const [openModalViewByClassification, setOpenModalViewByClassification] = useState(false);

  const fnViewByProject = (item) => {
    setCurrentItem(item);
    setOpenModalViewByProject(true);
  }

  const fnViewByClassification = (item) => {
    setCurrentItem(item);
    setOpenModalViewByClassification(true);
  }

  const fnExportDocument = async () => {
    let customersSelected = [];
    rowsSelected.sort((a, b) => {
      return a.orderCode.localeCompare(b.orderCode, 'en', { numeric: true });
    });
    rowsSelected.forEach(element => {
      customersSelected.push(element.customerId);
    });

    if (rowsSelected.length > 0) {
      paramsFilter.customersSelected = customersSelected;
    } else {
      delete paramsFilter.customersSelected;
    };

    setLoading(true);
    let data = {
      view: "",
      where: {
        ...paramsFilter
      },
      fields: [
        { title: 'Company Name', field: 'customerName', type: 'String', length: 120 },
        { title: 'Regular Hours', field: 'hours', type: 'decimal', length: 50, isSum: true, curreny: false },
        { title: 'Overtime Hours', field: 'hoursOvertime', type: 'decimal', length: 50, isSum: true, currency: false },
        { title: 'Total Hours', field: 'totalHours', type: 'decimal', length: 60, isSum: true, currency: false },
        { title: 'Regular Payment', field: 'payment', type: 'decimal', length: 60, isSum: true, currency: true },
        { title: 'Overtime Payment', field: 'paymentOvertime', type: 'decimal', length: 60, isSum: true, currency: true },
        { title: 'Adjustments', field: 'adjustmentsValue', type: 'decimal', length: 60, isSum: true, currency: true },
        { title: 'Deductions', field: 'deductionsValue', type: 'decimal', length: 60, isSum: true, currency: true },
        { title: 'Total Payment', field: 'totalPayment', type: 'decimal', length: 60, isSum: true, currency: true },
        { title: 'Total Invoice', field: 'totalInvoice', type: 'decimal', length: 60, isSum: true, currency: true },
      ],
      headerData: [
        { title: 'Week:', description: `Week Number: ${paramsFilter.noWeek} Year: ${paramsFilter.noYear}` }
      ],
      reportTitle: "Customer totals",
      typeFormat: 1,
      nameXLSXFile: "CustomerTotals.xlsx",
    };
    await request.fnExportToXLSX("/reportPayrollMain/groupByCustomerXLSX", data, "Totals.xlsx");
    setLoading(false);
  }

  const fnExportToPDF = async () => {
    setLoading(true);
    let data = {
      view: "users",
      where: {
        ...paramsFilter
      },
      fields: [
        { title: 'Company', field: 'customerName', type: 'String', length: 120 },
        { title: 'Regular Hours', field: 'hours', type: 'decimal', length: 50, isSum: true },
        { title: 'Overtime Hours', field: 'hoursOvertime', type: 'decimal', length: 50, isSum: true },
        { title: 'Total Hours', field: 'totalHours', type: 'decimal', length: 60, isSum: true },
        { title: 'Regular Payment', field: 'payment', type: 'decimal', length: 60, isSum: true },
        { title: 'Overtime Payment', field: 'paymentOvertime', type: 'decimal', length: 60, isSum: true },
        { title: 'Adjustments', field: 'adjustmentsValue', type: 'decimal', length: 60, isSum: true },
        { title: 'Deductions', field: 'deductionsValue', type: 'decimal', length: 60, isSum: true },
        { title: 'Total Payment', field: 'totalPayment', type: 'decimal', length: 60, isSum: true },
      ],
      reportTitle: "Customer totals",
      typeFormat: 1,
      namePDFFile: "Totals.pdf"
    };
    await request.fnExportToPDF("/reportPayrollMain/groupByCustomerPDF", data, "Totals.pdf");
    setLoading(false);
  }

  const fnTableRowSelected = (newSelectionModel) => {
    setTableRowsSelected([]);
    setRowsSelected([]);

    const dataSelected = [];

    newSelectionModel.forEach(idSelect => {
      const filterData = tableData.find(item => item.id === idSelect);
      dataSelected.push(filterData);
    });

    setRowsSelected(dataSelected);
    setRowsSelectedCount(dataSelected.length);
    setTableRowsSelected(newSelectionModel)
  }

  const table = {
    title: t("table.totals.title"),
    columns: [
      { field: 'customerName', headerName: t('table.paymentHistory.column.customerName'), flex: 0.8 },
      { field: 'hours', headerName: t('table.totals.column.regularHours'), flex: 0.4, type: 'number', hide: true },
      { field: 'hoursOvertime', headerName: t('table.totals.column.overtimeHours'), flex: 0.4, type: 'number', hide: true },
      { field: 'totalHours', headerName: t('table.totals.column.totalHours'), flex: 0.4, type: 'number' },
      {
        field: 'payment', headerName: t('table.totals.column.regularPayment'), flex: 0.6, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'paymentOvertime', headerName: t('table.totals.column.overtimePayment'), flex: 0.6, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'adjustmentsValue', headerName: t('table.totals.column.totalAdjustments'), flex: 0.6, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'deductionsValue', headerName: t('table.totals.column.totalDeductions'), flex: 0.6, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'totalPayment', headerName: t('table.totals.column.totalPayment'), flex: 0.6, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'totalInvoice', headerName: t('table.totals.column.totalInvoice'), flex: 0.6, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 100,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<LocationCity />}
            label={t("action.reportForProject")}
            onClick={() => fnViewByProject(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<Toc />}
            label={t("action.reportForClassification")}
            onClick={() => fnViewByClassification(row)}
            color='warning'
          />
        ],
      }
    ],
    data: tableData,
    freeActions: [{
      Icon: () => <ImportExport />,
      label: t("action.exportToExcel"),
      onClick: fnExportDocument,
      color: 'primary',
      disabled: enableFreeActions
    }, {
      Icon: () => <PictureAsPdf />,
      label: t("action.exportToPDF"),
      onClick: fnExportToPDF,
      color: 'primary',
      disabled: enableFreeActions
    }],
    options: {
      pageSize: 20,
      rowsPerPageOptions: [20, 40, 60, 80],
      checkboxSelection: true,
      onSelectionModelChange: (newSelectionModel) => fnTableRowSelected(newSelectionModel),
      selectionModel: tableRowsSelected
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

    setLoading(true);
    request.GET(`/projects`, (resp) => {
      const projects = resp.projects.map((item) => {
        return {
          id: item.id,
          value: item.id,
          label: `${item.code} | ${item.name}`,
          customerId: item.customerId
        }
      });

      setListProjects(projects);
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
    listYears,
    listWeeksWorked,
    listCustomers,
    listProjects,
    setTableData,
    setTotalsData,
    setEnableFreeActions,
    setParamsFilter,
    screenControl
  }

  const propsToFooter = {
    t,
    totalsData
  }

  return (
    {
      table,
      propsToHeader,
      propsToFooter,
      paramsFilter,
      openModalViewByProject,
      setOpenModalViewByProject,
      openModalViewByClassification,
      setOpenModalViewByClassification,
      currentItem,
      rowsSelectedCount
    }
  )
}
