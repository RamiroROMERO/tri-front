import React, { useEffect, useState } from 'react'
import { ChangeCircle, Edit, ImportExport, Paid } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { request } from 'app/utils/core';
import { validFloat } from 'app/utils/helpers';
import { Button, Icon } from '@mui/material';

export const useModalRates = ({ t, setLoading, customerId, customerName }) => {
  const [tableData, setTableData] = useState([]);
  const [tableRowsSelected, setTableRowsSelected] = useState([]);
  const [rowsSelected, setRowsSelected] = useState([]);
  const [currentItemRate, setCurrentItemRate] = useState({});
  const [openModalEditRate, setOpenModalEditRate] = useState(false);
  const [enableFreeActions, setEnableFreeActions] = useState(true);
  const [openModalEditRateByClass, setOpenModalEditRateByClass] = useState(false);
  const [openModalViewRates, setOpenModalViewRates] = useState(false);

  const fnGetData = () => {
    setLoading(true);
    request.GET(`/employees/list?customerId=${customerId}&status=1`, (resp) => {
      const data = resp.employees.map((item) => {
        return {
          idRate: item.employeeCustomers[0].id,
          id: item.id,
          name: item.name,
          code: item.code,
          classificationName: item.classification.name,
          rate: validFloat(item.employeeCustomers[0].rate, 4),
          rateOvertime: validFloat(item.employeeCustomers[0].rateOvertime, 4),
          rateInvoice: validFloat(item.employeeCustomers[0].rateInvoice, 4),
          rateInvoiceOvertime: validFloat(item.employeeCustomers[0].rateInvoiceOvertime, 4),
          payPerdiem: validFloat(item.employeeCustomers[0].payPerdiem, 4),
          invoicePerdiem: validFloat(item.employeeCustomers[0].invoicePerdiem, 4),
          fixedPerdiem: item.employeeCustomers[0].fixedPerdiem,
          fixedPerdiem2: item.employeeCustomers[0].fixedPerdiem2,
          status: item.employeeCustomers[0].status,
          statusIcon: item.employeeCustomers[0].status == 1 ? "check_box" : "check_box_outline_blank"
        }
      });
      setTableData(data);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnEditDocto = (item) => {
    setCurrentItemRate(item);
    setOpenModalEditRate(true);
  }

  const fnExportXLSXDocto = async () => {
    setLoading(true);
    let data = {
      view: "",
      where: {
        customerId,
        statusId: 1
      },
      fields: [
        { title: 'Employee Name', field: 'name', type: 'String', length: 120 },
        { title: 'Classification', field: 'classificationName', type: 'String', length: 50, isSum: false, curreny: false },
        { title: 'Payroll Rate', field: 'payrollRate', type: 'decimal', length: 60, isSum: false, currency: true },
        { title: 'Payroll OT Rate', field: 'payrollOTRate', type: 'decimal', length: 60, isSum: false, currency: true },
        { title: 'Invoice Rate', field: 'invoiceRate', type: 'decimal', length: 60, isSum: false, currency: true },
        { title: 'Invoice OT Rate', field: 'invoiceOTRate', type: 'decimal', length: 60, isSum: false, currency: true },
        { title: 'Date Started', field: 'dateStarted', type: 'String', length: 60, isSum: false, currency: false },
      ],
      headerData: [
        { title: 'Customer Name', description: customerName }
      ],
      reportTitle: "Rates Employees",
      typeFormat: 1,
      nameXLSXFile: "RatesEmployees.xlsx",
    };
    await request.fnExportToXLSX("/employeeCustomers/exportXLSX", data, "RatesEmployees.xlsx");
    setLoading(false);
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
      dataSelected.push(filterData);
    });

    setRowsSelected(dataSelected);
    setTableRowsSelected(newSelectionModel)
  }

  const fnChangeClassification = () => {
    setOpenModalEditRateByClass(true);
  }

  const fnViewRatesHistory = (item) => {
    setCurrentItemRate(item);
    setOpenModalViewRates(true);
  }

  const table = {
    title: t("table.rates.title"),
    columns: [
      { field: 'name', headerName: t('table.common.employee'), flex: 1 },
      { field: 'classificationName', headerName: t('table.common.classifications'), flex: 1 },
      { field: 'rate', headerName: t('table.activeEmployees.column.payRate'), flex: 0.5 },
      { field: 'rateOvertime', headerName: t('table.payrolls.column.overtimeRate'), flex: 0.5 },
      { field: 'rateInvoice', headerName: t('table.employees.column.rateInvoice'), flex: 0.5 },
      { field: 'rateInvoiceOvertime', headerName: t('table.employees.column.rateInvoiceOvertime'), flex: 0.5 },
      {
        field: 'statusIcon',
        headerName: t("table.common.status"),
        sortable: false,
        flex: 0.3,
        renderCell: ({ row, field }) => {
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 90,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnEditDocto(row)}
            color='warning'
          />,
          <GridActionsCellItem
            icon={<Paid />}
            label={t("action.viewHistoryRates")}
            onClick={() => fnViewRatesHistory(row)}
            color='info'
          />
        ],
      },
    ],
    data: tableData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50],
      checkboxSelection: true,
      onSelectionModelChange: (newSelectionModel) => fnTableRowSelected(newSelectionModel),
      selectionModel: tableRowsSelected
    },
    freeActions: [{
      Icon: () => <ImportExport />,
      label: t("action.exportToExcel"),
      onClick: fnExportXLSXDocto
    }],
    customControls: [
      <Button
        startIcon={<ChangeCircle />}
        onClick={fnChangeClassification}
        color='primary'
        variant='outlined'
        disabled={enableFreeActions}
      >
        {t('button.changeClassification')}
      </Button>
    ]
  };

  useEffect(() => {
    fnGetData();
  }, []);

  return (
    {
      table,
      openModalEditRate,
      setOpenModalEditRate,
      openModalEditRateByClass,
      setOpenModalEditRateByClass,
      openModalViewRates,
      setOpenModalViewRates,
      rowsSelected,
      currentItemRate,
      fnGetData
    }
  )
}
