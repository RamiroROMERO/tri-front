import { useState, useEffect } from 'react';
import { request } from 'app/utils/core';
import { useTranslation } from 'react-i18next';
import { currencyFormatter, formatDateToShow } from 'app/utils/helpers';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Visibility } from '@mui/icons-material';
import moment from 'moment';

export const useChecksHistory = ({ setLoading, sweetAlerts, screenControl }) => {
  const { t } = useTranslation();
  const [listEmployees, setListEmployees] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [openModalViewDetail, setOpenModalViewDetail] = useState(false);
  const [yearList, setYearList] = useState([]);
  const fnGetInitData = () => {
    setLoading(true);
    request.GET('/employees/list?statusId=4', (resp) => {
      const employees = resp.employees.map((item) => {
        return {
          id: item.id,
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

    request.GET('/setWeekYear/getYears', resp => {
      const { yearsWeeks } = resp;
      const currentYearList = yearsWeeks.map(item => {
        const newItem = { label: item.year, value: item.year };
        return newItem;
      });
      setYearList(currentYearList);
    }, err => {
      console.error(err);
    });
  }

  const fnViewDetail = (item) => {
    item.name = item.employeeName;
    item.linesCheck = {
      lines: item.checkDetails,
      employee: {
        bankAccount: item.ctaNumber,
        bankName: item.bankName
      }
    };
    item.totalPayment = item.total;
    setCurrentItem(item);
    setOpenModalViewDetail(true);
  }

  const fnExportData = async () => {

    if (tableData.length <= 0) {
      return;
    }
    const nameXLSXFile = `checksHistory.xlsx`;
    setLoading(true);
    const exportData = {
      fields: [
        { title: 'Date', field: 'date', type: 'String', length: 50, isSum: false, currency: false },
        { title: 'Check Number', field: 'qbkNumber', type: 'String', length: 40, isSum: false, currency: false },
        { title: 'Employee Name', field: 'employeeName', type: 'String', length: 100, isSum: false, currency: false },
        { title: 'Banck', field: 'bankName', type: 'String', length: 70, isSum: false, currency: false },
        { title: 'Week Ending', field: 'dateEndExport', type: 'String', length: 40, isSum: false, currency: false },
        { title: 'Total', field: 'total', type: 'decimal', length: 50, isSum: true, currency: false }
      ],
      data: tableData,
      headerData: [
        { title: 'Employee', description: tableData[0].employeeName || '' },
        { title: 'Year', description: moment(tableData[0].date, 'MM/DD/YYYY').format('YYYY') }
      ],
      reportTitle: "Check History",
      typeFormat: 1,
      nameXLSXFile
    };
    await request.fnExportToXLSX("/checks/exportXLSX", exportData, nameXLSXFile);
    setLoading(false);

  }

  const table = {
    title: t("table.checksHistory.title"),
    columns: [
      { field: 'date', headerName: t('table.common.date'), flex: 0.4 },
      { field: 'qbkNumber', headerName: t('table.checksHistory.noCheck'), flex: 0.4 },
      { field: 'employeeName', headerName: t('table.checksHistory.employeeName'), flex: 0.8 },
      { field: 'bankName', headerName: t('table.checksHistory.bankName'), flex: 0.6 },
      { field: 'dateEnd', headerName: t('table.checksHistory.dateEnd'), flex: 0.4, valueFormatter: ({ value }) => formatDateToShow(value) },
      {
        field: 'total', headerName: t('table.checksHistory.total'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 90,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Visibility />}
            label={t("button.edit")}
            onClick={() => fnViewDetail(row)}
            color='info'
          />
        ],
      }
    ],
    data: tableData,
    options: {
      pageSize: 20,
      rowsPerPageOptions: [20, 40, 60, 80]
    }
  };

  useEffect(() => {
    fnGetInitData();
  }, []);


  const propsToHeader = {
    t,
    setLoading,
    sweetAlerts,
    listEmployees,
    setTableData,
    screenControl,
    yearList,
    fnExportData
  }

  return (
    {
      table,
      propsToHeader,
      currentItem,
      openModalViewDetail,
      setOpenModalViewDetail,
      yearList
    }
  )
}
