import React from 'react'
import { useState, useEffect } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { currencyFormatter, formatNumber, validFloat, validInt } from 'app/utils/helpers';
import { GridActionsCellItem } from '@mui/x-data-grid';

export const useModalOtherItems = ({ setLoading, sweetAlerts, fnGetInvoiceDetail, currentItem, t, weekSelectedId }) => {

  const [sendForm, setSendForm] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [detaCurrentItem, setDetaCurrentItem] = useState({});
  const [deleteCurrentItem, setDeleteCurrentItem] = useState(false);

  const formValidations = {
    description: [(val) => (val !== ""), t("alertMessages.warning.description")],
    qty: [(val) => validFloat(val) > 0, t("alertMessages.warning.value")],
    price: [(val) => validFloat(val) > 0, t("alertMessages.warning.value")],
    total: [(val) => validFloat(val) > 0, t("alertMessages.warning.value")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    id: 0,
    description: '',
    qty: 0,
    price: 0,
    total: 0,
    status: 1,
    isMissingtime: currentItem.isMissingTime || false
  }, formValidations);

  const { id, description, qty, price, total, status } = formState;

  const fnEditDocto = (item) => {
    onBulkForm(item);
    setSendForm(false);
  }

  const fnDeleteDocto = (item) => {
    setDetaCurrentItem(item);
    setDeleteCurrentItem(true);
  };

  const fnOkDelete = () => {
    const { id } = detaCurrentItem;
    if (validInt(id) === 0) return;
    setLoading(true);
    request.DELETE(`/invoiceSupplies/${id}`, res => {
      const { messages } = res;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetInvoiceDetail();
      setLoading(false);
      onResetForm();
      fnRefreshTable();
    }, err => {
      console.warn(err)
    })

  }

  const fnRefreshTable = () => {

    const { customerId, projectList } = currentItem;
    const projectId = projectList[0];
    request.GET(`/invoiceSupplies?customerId=${customerId}&weekId=${weekSelectedId}&projectId=${projectId}`, res => {
      const { data } = res;
      const currentTotal = data.reduce((acc, cur) => {
        acc += validFloat(cur.total);
        return acc
      }, 0)
      setTotalData(currentTotal);
      setTableData(data);
    }, err => {
      console.warn(err);
    });

  }

  const fnSave = () => {
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    let newData = {};
    if (validInt(id) === 0) {
      newData = {
        customerId: currentItem.customerId,
        projectId: currentItem.projectList[0],
        weekId: weekSelectedId,
        description,
        qty, price, total,
        isMissingtime: currentItem.isMissingTime || false,
        status
      };
    } else {
      newData = {
        description,
        qty, price, total,
        status
      };
    }

    if (validInt(id) === 0) {

      request.POST('/invoiceSupplies', newData, resp => {
        const { messages } = resp;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetInvoiceDetail();
        setSendForm(false);
        setLoading(false);
        onResetForm();
        fnRefreshTable();
      }, err => {
        const { messages } = err;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      })
    } else {
      request.PUT(`/invoiceSupplies/${id}`, newData, resp => {
        const { messages } = resp;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetInvoiceDetail();
        setSendForm(false);
        setLoading(false);
        onResetForm();
        fnRefreshTable();
      }, err => {
        const { messages } = err;
        if (messages?.length > 0) {
          messages.map(elem => {
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      })
    }
  };

  const table = {
    title: '',
    columns: [
      {
        headerName: t("table.invoice.column.description"), field: "description", flex: 1.5,
      },
      { headerName: t("table.common.qty"), field: "qty", flex: 0.5, type: "number" },
      { headerName: t("table.common.price"), field: "price", flex: 0.5, type: "number" },
      {
        headerName: t("table.common.total"), field: "total", flex: 0.5, type: "number",
        valueFormatter: ({ value }) => value > 0 ? currencyFormatter.format(value) : 0
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 75,
        getActions: ({ row }) => {
          return [
            <GridActionsCellItem
              icon={<Edit />}
              label={t("button.edit")}
              onClick={() => fnEditDocto(row)}
              color='info'
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label={t("button.delete")}
              onClick={() => fnDeleteDocto(row)}
              color='error'
            />,
          ]
        }
      }
    ],
    data: tableData,
    options: {
      pageSize: 5,
      rowsPerPageOptions: [5, 10]
    }
  };

  useEffect(() => {
    fnRefreshTable();
  }, [])

  useEffect(() => {

    let newTotal = validFloat(qty) * validFloat(price);
    onInputChange({ target: { name: 'total', value: validFloat(newTotal, 2) } });

  }, [qty, price]);

  const propsToModalConfirm = {
    open: deleteCurrentItem,
    setOpen: setDeleteCurrentItem,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDelete
  }

  return {
    formState,
    formValidation,
    isFormValid,
    sendForm,
    fnSave,
    table,
    onInputChange,
    onResetForm,
    propsToModalConfirm,
    totalItems: formatNumber(totalData, '$. ', 2)
  }

}
