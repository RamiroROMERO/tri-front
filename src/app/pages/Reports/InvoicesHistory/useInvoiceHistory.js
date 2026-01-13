import { PictureAsPdf, Visibility, Receipt } from '@mui/icons-material';
// import ReceiptIcon from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { request } from 'app/utils/core';
import { currencyFormatter, formatDateToShow, validInt } from 'app/utils/helpers';
import React, { useState } from 'react'

export const useInvoiceHistory = ({ setLoading, sweetAlerts, screenControl, t }) => {

  const [dataTable, setDataTable] = useState([]);
  const [invoiceTotals, setInvoiceTotals] = useState(0);

  const fnGetInvoiceQbk = (row) => {

    const { qbkCompany: qboCompany, invoiceId, invoiceNumber, customer, project, customersWeek, jobReference } = row;

    if (validInt(qboCompany) === 0 || validInt(invoiceId) === 0) {
      sweetAlerts('warning', t('alertmessages.warning.noInvoiceQbk'));
      return;
    }

    const fileNameToDownload = `Invoice_${invoiceNumber}_${customer.name || ''}_${project?.code || ''}_${jobReference}_${customersWeek.noWeek}_${customersWeek.noYear}.pdf`;
    setLoading(true);
    request.GETPdf('/qboAPI/getInvoicePDF', { qboCompany, invoiceId }, fileNameToDownload, (err) => {
      setLoading(false);
      console.warn(err);
    }, () => {
      setLoading(false);
    });
  }

  const fnGetInvoiceInternal = (row) => {

    if (!row || !row.id) return;

    const { invoiceNumber, customer, project, customersWeek, jobReference } = row;
    const fileNameToDownload = `Invoice_${invoiceNumber}_${customer.name || ''}_${project?.code || ''}_${jobReference}_${customersWeek.noWeek}_${customersWeek.noYear}.pdf`;
    setLoading(true);
    request.GETPdf('/invoices/getInvoicePDF', row, fileNameToDownload, (err) => {
      setLoading(false);
      console.warn(err);
    }, () => {
      setLoading(false);
    });


  }


  const table = {
    title: t("table.invoiceHistory.title"),
    columns: [
      { field: 'invoiceNumber', headerName: t('table.invoiceHistory.invoiceNumber'), flex: 0.4 },
      { field: 'projectName', headerName: t('table.invoiceDetail.textField.projectName'), flex: 1 },
      { field: 'jobReference', headerName: t('table.dailiesPayrolls.header.jobReference'), flex: 0.3 },
      { field: 'week', headerName: t('table.invoiceDetail.textField.numWeek'), flex: 0.4 },
      { field: 'regularHours', headerName: t('table.common.regularHours'), flex: 0.4 },
      { field: 'overtimeHours', headerName: t('table.common.overtimeHours'), flex: 0.4 },
      { field: 'totalHours', headerName: t('table.common.totalHours'), flex: 0.4 },
      {
        field: 'total', headerName: t('table.common.total'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 90,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<PictureAsPdf />}
            label={t("button.document")}
            onClick={() => fnGetInvoiceQbk(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<Receipt />}
            label={t("button.document")}
            onClick={() => fnGetInvoiceInternal(row)}
            color='primary'
          />
        ],
      }
    ],
    data: dataTable,
    options: {
      pageSize: 20,
      rowsPerPageOptions: [20, 40, 60, 80]
    }
  };

  return {
    setDataTable,
    table,
    invoiceTotals, setInvoiceTotals
  }
}
