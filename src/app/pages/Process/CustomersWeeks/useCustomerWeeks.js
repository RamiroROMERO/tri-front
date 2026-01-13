import { useEffect, useState } from 'react'
import { request } from 'app/utils/core';
import { useTranslation } from 'react-i18next';
import { formatDateToShow, validInt } from 'app/utils/helpers';
import { useForm } from 'app/hooks';
import { Icon } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Delete, Edit } from '@mui/icons-material';

export const useCustomerWeeks = ({ setLoading, sweetAlerts, screenControl, controlAdmin }) => {
  const { optCreate, optDelete } = screenControl;
  const [currentItem, setCurrentItem] = useState({});
  const [tableData, setTableData] = useState([]);
  const [listYears, setListYears] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openModalGenerate, setOpenModalGenerate] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const [sendForm, setSendForm] = useState(false);
  const { t } = useTranslation();
  const [titleModalNew, setTitleModalNew] = useState('');

  const formValidations = {
    yearFilter: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    customerFilter: [(val) => validInt(val) !== 0, t("alertMessages.warning.customerId")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    yearFilter: "",
    customerFilter: 0,
  }, formValidations);

  const { yearFilter, customerFilter } = formState;

  const fnGetData = () => {
    setLoading(true);
    request.GET(`/customersWeeks?year=${yearFilter}&customerId=${customerFilter}`, (resp) => {
      const data = resp.customerWeeks.map((item) => {
        item.statusIcon = item.status == 1 ? "check_box" : "check_box_outline_blank"
        return item;
      });
      setTableData(data);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnNewDocument = () => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const filter = listCustomers.find(item => item.value === customerFilter);

    setCurrentItem({
      customerId: customerFilter,
      customerName: filter.label,
      year: yearFilter,
      status: 1
    });

    setTitleModalNew("dialog.CustomerWeek.new.title");
    setOpenModalNew(true);
  }

  const fnEdit = (item) => {
    setCurrentItem(item);
    setTitleModalNew("dialog.CustomerWeek.Edit.title");
    setOpenModalNew(true);
  }

  const fnDelete = (item) => {
    if (optDelete === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setOpenMsgDelete(true);
  }

  const fnOkDelete = () => {
    if (validInt(currentItem.id) <= 0) {
      return;
    }
    setLoading(true);
    request.DELETE(`/customersWeeks`, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetData();
      setLoading(false);
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    }, { id: currentItem.id });
  }

  const fnFilterWeeks = () => {
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    fnGetData();
  }

  const fnGenerateWeeks = () => {
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    setOpenModalGenerate(true);
  }

  const table = {
    title: t("table.manageWeeks.title"),
    columns: [
      { field: 'year', headerName: t('table.common.year'), flex: 0.8 },
      { field: 'noWeek', headerName: t('table.manageWeeks.column.noWeek'), flex: 0.8 },
      { field: 'startDate', headerName: t('table.manageWeeks.column.startDate'), flex: 1, valueFormatter: ({ value }) => formatDateToShow(value) },
      { field: 'endDate', headerName: t('table.manageWeeks.column.endDate'), flex: 1, valueFormatter: ({ value }) => formatDateToShow(value) },
      {
        field: 'statusIcon', headerName: t('table.common.status'), flex: 0.3,
        renderCell: ({ row, field }) => {
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnEdit(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label={t("button.delete")}
            onClick={() => fnDelete(row)}
            color='error'
          />
        ],
      }
    ],
    data: tableData,
    freeActions: [{
      Icon: () => <Add />,
      label: t("datatable.buttons.newDocument"),
      onClick: fnNewDocument
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
    request.GET('/customers/getSL', (resp) => {
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
  }, []);

  return (
    {
      table,
      openModalNew,
      setOpenModalNew,
      openModalGenerate,
      setOpenModalGenerate,
      openMsgDelete,
      setOpenMsgDelete,
      listYears,
      listCustomers,
      currentItem,
      formState,
      formValidation,
      isFormValid,
      onInputChange,
      sendForm,
      fnFilterWeeks,
      fnGenerateWeeks,
      t,
      fnGetData,
      fnOkDelete,
      yearFilter,
      customerFilter,
      titleModalNew
    }
  )
}
