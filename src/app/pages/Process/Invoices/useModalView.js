import React, { useEffect, useState } from 'react'
import { request } from 'app/utils/core';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Edit, PostAdd } from '@mui/icons-material';
import { currencyFormatter, validFloat, validInt } from 'app/utils/helpers';
import { ModalEditRates } from './ModalEditRates';
import { Button, Grid } from '@mui/material';
import { ModalOtherItems } from './ModalOtherItems';

export const useModalView = ({ setLoading, currentItem, weekSelectedId, t, sweetAlerts, setOpenGenerateInvoice, screenControl, paramsFilter }) => {
  const { optCreate, optUpdate, optDelete } = screenControl;
  const [wpdId, setWpdId] = useState(0);
  const [openModalEditRates, setOpenModalEditRates] = useState(false);
  const [openModalAddItem, setOpenModalAddItem] = useState(false);
  const [invoiceTotals, setInvoiceTotals] = useState({});
  const [tableData, setTableData] = useState([]);

  const fnEditDocto = (item) => {
    setWpdId(item.wpdId);
    setOpenModalEditRates(true);
  }

  const fnAddItem = () => {
    setOpenModalAddItem(true);
  }

  const table = {
    title: t("table.invoiceDetail.title"),
    columns: [
      {
        headerName: t("table.invoice.column.description"), field: "employeeName", flex: 2,
        colSpan: ({ row }) => {
          return ((validInt(row.isTitle) !== 0) ? undefined : 5);
        },
        renderCell: ({ row, field }) => {
          return ((validInt(row.isTitle) !== 0 && validInt(row.Amount) !== 0) ? row[field] : (validInt(row.isTitle) !== 0 && validInt(row.Amount) === 0) ? <font color="#d10000">{row[field]}</font> : <font style={{ fontWeight: "600" }}>{row[field]}</font>);
        }
      },
      { headerName: t("table.invoice.column.hours"), field: "qty", flex: 0.2, type: "number" },
      {
        headerName: t("table.dailiesPayrolls.column.cclRateByHour"), field: "invoiceRate", flex: 0.3, type: "number",
        renderCell: ({ row, field }) => {
          return validFloat(row.invoiceRate)
        }
      },
      {
        headerName: t("table.invoice.column.amount"), field: "amount", flex: 0.3, type: "number",
        valueFormatter: ({ value }) => value > 0 ? currencyFormatter.format(value) : 0
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 75,
        getActions: ({ row }) => {
          return (validInt(row.isTitle) !== 0 ? [
            <GridActionsCellItem
              icon={<Edit />}
              label={t("button.edit")}
              onClick={() => fnEditDocto(row)}
              color='warning'
            />,
          ] : [])
        }
      }
    ],
    data: tableData,
    options: {
      pageSize: 20,
      rowsPerPageOptions: [20, 40, 60]
    },
    customControls: [
      <Grid xs={12} sm={5} lg={3} >
        <Button startIcon={<PostAdd />} onClick={fnAddItem} color='primary' variant='contained'>
          {t('button.addItem')}
        </Button>
      </Grid>
    ]
  };

  const fnGenerateInvoice = () => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setOpenGenerateInvoice(true);
  }

  const fnExportDetail = async () => {
    const { customerName, projectName, weekSelect } = currentItem;
    let numberRandom = Math.round(Math.random() * 1000000);
    let data = {
      data: tableData,
      fields: [
        { title: 'Employee', field: 'employeeName', type: 'String', length: 120 },
        { title: 'Qty', field: 'qty', type: 'decimal', length: 50, isSum: true, curreny: false },
        { title: 'Rate', field: 'invoiceRate', type: 'decimal', length: 50, isSum: true, curreny: true },
        { title: 'Total', field: 'amount', type: 'decimal', length: 50, isSum: true, curreny: true },
      ],
      headerData: [
        { title: 'Customer:', description: customerName },
        { title: 'Project:', description: projectName },
        { title: 'Week:', description: paramsFilter.weekSelect }
      ],
      reportTitle: "Invoice Detail",
      typeFormat: 1,
      nameXLSXFile: `DetailInvoice-${numberRandom}.xlsx`,
    };
    setLoading(true);
    await request.fnExportToXLSX("/invoices/exportDetailXLSX", data, `DetailInvoice-${numberRandom}.xlsx`, () => { setLoading(false) });
  }

  const fnGetInvoiceDetail = () => {
    const { customerId, projectList, isMissingTime, hasPerDiems } = currentItem;
    setLoading(true)
    request.POST('/weeklyPayrollsDetails/getInvoice', { customerId, projectList, isMissingTime, weekId: weekSelectedId, hasPerDiems }, res => {
      const data = res.detaInvoice.map((item, idx) => {
        item.id = idx
        item.employeeName = item.Description
        item.amount = item.Amount
        item.qty = item.SalesItemLineDetail && item.SalesItemLineDetail.Qty ? item.SalesItemLineDetail.Qty : ''
        item.invoiceRate = item.Amount > 0 ? item.rateByHour : 0
        return item;
      });
      setTableData(data);
      setInvoiceTotals(res?.invoiceTotals || {});
      setLoading(false)
    }, err => {
      console.error(err);
      setLoading(false);
    });
  }

  useEffect(() => {
    fnGetInvoiceDetail();
  }, []);

  const propsToModalEditRates = {
    title: 'dialog.invoiceDetail.editRateInvoice.title',
    DialogContent: ModalEditRates,
    open: openModalEditRates,
    setOpen: setOpenModalEditRates,
    maxWidth: 'sm',
    data: {
      wpdId,
      fnGetInvoiceDetail,
      setLoading,
      sweetAlerts
    }
  };

  const propsToModalAddItem = {
    title: 'dialog.invoiceDetail.otherValues.title',
    DialogContent: ModalOtherItems,
    open: openModalAddItem,
    setOpen: setOpenModalAddItem,
    maxWidth: 'md',
    data: {
      currentItem,
      weekSelectedId,
      setLoading,
      sweetAlerts,
      fnGetInvoiceDetail
    }
  }

  return (
    {
      table,
      invoiceTotals,
      propsToModalEditRates,
      propsToModalAddItem,
      fnGenerateInvoice,
      fnExportDetail
    }
  )
}
