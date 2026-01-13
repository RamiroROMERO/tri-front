import { useEffect, useState } from 'react';
import { request } from 'app/utils/core';
import { useTranslation } from 'react-i18next';
import { currencyFormatter } from 'app/utils/helpers';
import { ImportExport, PictureAsPdf } from '@mui/icons-material';

export const useTotalPayments = ({ setLoading, sweetAlerts, screenControl }) => {
  const { t } = useTranslation();
  const [listCustomers, setListCustomers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [paramsFilter, setParamsFilter] = useState({});
  const [enableFreeActions, setEnableFreeActions] = useState(true);

  const fnExportDocument = () => {
    setLoading(true);
    request.GETPdf("/reportPayrollMain/exportPDFPayments", paramsFilter, `Total Payments.pdf`);
    setLoading(false);
  }

  const fnExportDocumentXLSX = async () => {
    setLoading(true);
    const data = {
      view: "",
      where: {
        ...paramsFilter
      },
      fields: [
        { title: '#', field: 'num', type: 'String', length: 50 },
        { title: 'Name', field: 'name', type: 'String', length: 120, isSum: false, curreny: false },
        { title: 'Type', field: 'typeHours', type: 'String', length: 20 },
        { title: 'HRS', field: 'totalHours', type: 'decimal', length: 40, isSum: false, currency: false },
        { title: 'Hourly Rate', field: 'rateByHourInvoice', type: 'decimal', length: 40, isSum: false, currency: true },
        { title: 'Total OT & ST.', field: 'totalOtStInvoice', type: 'decimal', length: 40, isSum: false, currency: true },
        { title: 'Perdiem Total', field: 'totalPerdiemInvoice', type: 'decimal', length: 40, isSum: false, currency: true },
        { title: 'INVOICE', field: 'totalInvoice', type: 'decimal', length: 40, isSum: true, currency: true },
        { title: 'Perdiem Days', field: 'perdiemDaysPayroll', type: 'decimal', length: 40, isSum: false, currency: false },
        { title: 'Perdiem Rate', field: 'perdiemRatePayroll', type: 'decimal', length: 40, isSum: false, currency: true },
        { title: 'Perdiem Total', field: 'perdiemTotalPayroll', type: 'decimal', length: 40, isSum: false, currency: true },
        { title: 'WAGE', field: 'wagePayroll', type: 'decimal', length: 40, isSum: false, currency: true },
        { title: 'Overtime', field: 'overtimePayroll', type: 'decimal', length: 40, isSum: false, currency: true },
        { title: 'PAYROLL', field: 'totalPayroll', type: 'decimal', length: 40, isSum: true, currency: true },
        { title: 'CIA Account', field: 'ciaAccount', type: 'String', length: 40, isSum: false, currency: false }
      ],
      headerData: [
      ],
      reportTitle: "Total Payments",
      typeFormat: 1,
      nameXLSXFile: "totalPayments.xlsx",
    };
    await request.fnExportToXLSX("/reportPayrollMain/exportPaymentsXLSX", data, "totalPayments.xlsx");
    setLoading(false);
  }

  const table = {
    title: t("table.totalPayments.title"),
    columns: [
      { field: 'num', headerName: "", flex: 0.1 },
      { field: 'name', headerName: t('table.common.name'), flex: 0.8 },
      { field: 'typeHours', headerName: "", flex: 0.1 },
      { field: 'totalHours', headerName: t('table.common.totalhrs'), flex: 0.4, type: 'number' },
      {
        field: 'rateByHourInvoice', headerName: t('table.payrolls.column.rateByHour'), flex: 0.4, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'totalOtStInvoice', headerName: t('table.totalPayments.column.totalOtSt'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'totalPerdiemInvoice', headerName: t('table.totalPayments.column.totalPerdiem'), flex: 0.4, type: 'number', valueFormatter: ({ value }) => value === "" ? "" : currencyFormatter.format(value)
      },
      {
        field: 'totalInvoice', headerName: t('table.common.totalInvoice'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => value === "" ? "" : currencyFormatter.format(value)
      },
      {
        field: 'perdiemDaysPayroll', headerName: t('table.totalPayments.column.perdiemDays'), flex: 0.5, type: 'number'
      },
      {
        field: 'perdiemRatePayroll', headerName: t('table.totalPayments.column.perdiemRate'), flex: 0.5, type: 'number', valueFormatter: ({ value }) => value === "" ? "" : currencyFormatter.format(value)
      },
      {
        field: 'perdiemTotalPayroll', headerName: t('table.totalPayments.column.perdiemTotal'), flex: 0.5, type: 'number', valueFormatter: ({ value }) => value === "" ? "" : currencyFormatter.format(value)
      },
      {
        field: 'wagePayroll', headerName: t('table.totalPayments.column.wage'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'overtimePayroll', headerName: t('table.totalPayments.column.overtime'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'totalPayroll', headerName: t('table.common.totalPayroll'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => value === "" ? "" : currencyFormatter.format(value)
      }
    ],
    data: tableData,
    freeActions: [{
      Icon: () => <PictureAsPdf />,
      label: t("action.exportToPDF"),
      onClick: fnExportDocument,
      color: 'primary',
      disabled: enableFreeActions
    }, {
      Icon: () => <ImportExport />,
      label: t("action.exportToExcel"),
      onClick: fnExportDocumentXLSX,
      color: 'primary',
      disabled: enableFreeActions
    }],
    options: {
      pageSize: 20,
      rowsPerPageOptions: [20, 40, 60, 80],
      getCellClassName: (params) => {
        return params.row.typeHours === "S" ? 'divider-cell' : '';
      }
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
