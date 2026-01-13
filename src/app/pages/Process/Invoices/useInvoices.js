import { useState } from 'react';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { currencyFormatter } from 'app/utils/helpers';
import { Chip, Icon } from '@mui/material';
import { TimerOff } from '@mui/icons-material';
import { ModalGenerateInvoice } from './ModalGenerateInvoice';

export const useInvoices = (setLoading, t, sweetAlerts, screenControl, setActions, controlAdmin) => {
  const { optCreate } = screenControl;
  const [weekSelectedId, setWeekSelectedId] = useState(0);
  const [rowsSelectedCount, setRowsSelectedCount] = useState(0);
  const [currentItem, setCurrentItem] = useState({});
  const [paramsFilter, setParamsFilter] = useState({});
  const [openInvoiceDetail, setOpenInvoiceDetail] = useState(false);
  const [openGenerateInvoice, setOpenGenerateInvoice] = useState(false);
  const [openInvoiceReview, setOpenInvoiceReview] = useState(false);
  const [enableFreeActions, setEnableFreeActions] = useState(true);
  const [openUpdateRates, setOpenUpdateRates] = useState(false);
  const [openViewUpdateRates, setOpenViewUpdateRates] = useState(false);
  const [openReviewPerdiems, setOpenReviewPerdiems] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableRowsSelected, setTableRowsSelected] = useState([]);
  const [rowsSelected, setRowsSelected] = useState([]);
  const [listQbAccounts, setListQbAccounts] = useState([]);
  const [listCustomerOnQbk, setListCustomerOnQbk] = useState([]);
  const [dataInvoiceReview, setDataInvoiceReview] = useState([]);
  const [dataInvoiceTotal, setDataInvoiceTotal] = useState([]);
  const [dataPerdiems, setDataPerdiems] = useState([]);
  const [dataRatesUpdated, setDataRatesUpdated] = useState([]);

  const fnViewDetail = (row) => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setRowsSelected([row]);
    setCurrentItem(row);
    setOpenInvoiceDetail(true);
  };

  const fnGenerate = (row) => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setRowsSelected([row]);
    setOpenGenerateInvoice(true);
  }

  const fnGenerateInvoices = () => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    rowsSelected.sort((a, b) => {
      return a.orderCode.localeCompare(b.orderCode, 'en', { numeric: true });
    });
    setOpenGenerateInvoice(true);
  }

  const fnTableRowSelected = (newSelectionModel) => {
    if (newSelectionModel.length > 0) {
      setEnableFreeActions(false);
    } else {
      setEnableFreeActions(true);
    }

    setTableRowsSelected([]);
    setRowsSelected([]);

    const dataSelected = [];

    newSelectionModel.forEach(idSelect => {
      const filterData = tableData.find(item => item.id === idSelect);
      dataSelected.push({ ...filterData, colorStatus: '#ea9c10', iconStatus: 'pending', qbkNumber: '' });
    });

    setRowsSelected(dataSelected);
    setRowsSelectedCount(dataSelected.length);
    setTableRowsSelected(newSelectionModel)
  }

  const table = {
    title: t("table.invoice.title"),
    columns: [
      {
        headerName: t("table.invoice.column.project"), field: "projectIcon", flex: 2,
        renderCell: ({ row, field }) => {
          return (row.isMissingTime ? <Chip icon={<TimerOff />} label={row[field]} variant="outlined" color='error' /> : row[field]);
        }
      },
      { headerName: t("table.invoice.column.location"), field: "location", flex: 1 },
      { headerName: t("table.invoice.column.regularHours"), field: "regularHours", flex: 0.5 },
      { headerName: t("table.invoice.column.overtimeHours"), field: "overtimeHours", flex: 0.5 },
      { headerName: t("table.invoice.column.subTotal"), field: "subTotal", flex: 1, type: "number", valueFormatter: ({ value }) => currencyFormatter.format(value) },
      { headerName: t("table.invoice.column.amountDiscount"), field: "amountDiscount", flex: 1, type: "number", valueFormatter: ({ value }) => currencyFormatter.format(value) },
      { headerName: t("table.invoice.column.total"), field: "total", flex: 1, type: "number", valueFormatter: ({ value }) => currencyFormatter.format(value) },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label={t("button.delete")}
            onClick={() => fnViewDetail(row)}
            color={row.missingRate ? 'error' : 'info'}
          />,
          <GridActionsCellItem
            icon={<ReceiptIcon />}
            label={t("action.generateInvoice")}
            onClick={() => fnGenerate(row)}
            color='warning'
          />,
        ]
      }
    ],
    freeActions: [{
      Icon: () => <ReceiptIcon />,
      label: t("action.generateInvoice"),
      onClick: fnGenerateInvoices,
      disabled: enableFreeActions
    }],
    options: {
      checkboxSelection: true,
      pageSize: 20,
      rowsPerPageOptions: [20, 40, 60],
      onSelectionModelChange: (newSelectionModel) => fnTableRowSelected(newSelectionModel),
      selectionModel: tableRowsSelected
    }
  };

  const fnMenuOptions = () => {
    let actions = [
      { icon: () => <Icon>attach_money</Icon>, name: "button.updateInvoiceRates", onClick: setOpenUpdateRates },
      { icon: () => <Icon>price_check</Icon>, name: "button.reviewPayrollPerdiems", onClick: setOpenReviewPerdiems }
    ];

    setActions(actions);
  };

  const propsToModalInvoiceDetail = {
    title: 'dialog.invoiceReview.title',
    open: openInvoiceDetail,
    setOpen: setOpenInvoiceDetail,
    maxWidth: 'xl',
    data: {
      currentItem,
      screenControl,
      setLoading,
      paramsFilter,
      weekSelectedId,
      sweetAlerts,
      setOpenGenerateInvoice
    }
  };

  const propsToModalGenerateInvoice = {
    title: 'dialog.generateInvoice.title',
    DialogContent: ModalGenerateInvoice,
    open: openGenerateInvoice,
    setOpen: setOpenGenerateInvoice,
    maxWidth: 'md',
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

  const propsToFilters = {
    t,
    setTableData,
    setLoading,
    sweetAlerts,
    setWeekSelectedId,
    setParamsFilter,
    setListQbAccounts,
    setListCustomerOnQbk,
    fnMenuOptions,
    openReviewPerdiems,
    setOpenReviewPerdiems,
    openUpdateRates,
    setOpenUpdateRates,
    openViewUpdateRates,
    setOpenViewUpdateRates,
    dataPerdiems,
    setDataPerdiems,
    dataRatesUpdated,
    setDataRatesUpdated
  }

  return {
    table,
    tableData,
    propsToModalInvoiceDetail,
    propsToModalGenerateInvoice,
    propsToFilters,
    rowsSelectedCount
  }

}
