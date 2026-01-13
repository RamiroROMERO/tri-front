import { Add, Delete, Edit } from '@mui/icons-material';
import { Icon } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { request } from 'app/utils/core';
import { formatDateToShow, validInt } from 'app/utils/helpers';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

export const useManageWeeks = ({ setLoading, sweetAlerts, controlAdmin }) => {
  const [yearFilter, setYearFilter] = useState(0);
  const [currentItem, setCurrentItem] = useState({});
  const [tableData, setTableData] = useState([]);
  const [listYears, setListYears] = useState([]);
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);
  const { t } = useTranslation();
  const [titleModalNew, setTitleModalNew] = useState('');

  const fnGetData = (year) => {
    setLoading(true);
    request.GET(`/setWeekYear?year=${year}`, (resp) => {
      const data = resp.setWeekYear.map((item) => {
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

  const fnNew = () => {
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem({});
    setTitleModalNew("dialog.Weeks.title");
    setOpenModalNew(true);
  }

  const fnEdit = (item) => {
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setTitleModalNew("dialog.Weeks.Edit.title");
    setOpenModalNew(true);
  }

  const fnDelete = (item) => {
    if (controlAdmin.status === 0) {
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
    request.DELETE(`/setWeekYear`, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetData(yearFilter);
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

  const fnFilterWeeks = e => {
    const year = e.target.value;
    setYearFilter(year);
    fnGetData(year);
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
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    },
    freeActions: [{
      Icon: () => <Add />,
      label: t("datatable.buttons.newDocument"),
      onClick: fnNew
    }]
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
  }, []);

  return (
    {
      table,
      openModalNew,
      setOpenModalNew,
      openMsgDelete,
      setOpenMsgDelete,
      fnOkDelete,
      yearFilter,
      listYears,
      fnFilterWeeks,
      t,
      fnGetData,
      currentItem,
      titleModalNew
    }
  )
}
