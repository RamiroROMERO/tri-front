import { ImportExport } from '@mui/icons-material';
import { request } from 'app/utils/core';
import { formatDateToShowDay } from 'app/utils/helpers';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

export const useDailyHours = ({ setLoading, sweetAlerts, screenControl }) => {
  const { t } = useTranslation();
  const [listCustomers, setListCustomers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [dataWeek, setDataWeek] = useState([]);

  const defaultColumns = [
    { field: 'employeeName', headerName: t('table.common.employeeName'), flex: 1 },
    { field: 'project', headerName: t('table.common.project'), flex: 0.8 },
  ]

  const fnExportDocumentXLSX = async (customerId, weekId, arrayDates) => {
    const daysMap = { '1': 'm', '2': 't', '3': 'w', '4': 'th', '5': 'f', '6': 's', '7': 'su' };
    const daysMapTitle = { '1': 'Mon', '2': 'Tues', '3': 'Wends', '4': 'Thurs', '5': 'Fri', '6': 'Sat', '7': 'Sun' };
    const othersFields = [];
    arrayDates.forEach((date) => {
      let numberDay = (new Date(date + 'T12:00:00Z')).getDay();
      let day = daysMap[numberDay || 7];
      let dayTitle = daysMapTitle[numberDay || 7];
      othersFields.push({ title:  dayTitle + ' ' + formatDateToShowDay(date), field: date + '-' + day, type: 'decimal', length: 40, isSum: false, currency: false })
    });

    setLoading(true);
    const data = {
      view: "",
      where: {
        customerId, weekId
      },
      fields: [
        { title: 'Employee Name', field: 'employeeName', type: 'String', length: 120, isSum: false, curreny: false },
        { title: 'Project', field: 'projectName', type: 'String', length: 100 },
        ...othersFields,
        { title: 'Total Hours', field: 'totalHours', type: 'decimal', length: 40, isSum: false, currency: false },
        { title: 'OT Hours', field: 'oThours', type: 'decimal', length: 40, isSum: false, currency: false },
        { title: 'Notes', field: 'notes', type: 'String', length: 120, isSum: false, curreny: false },

      ],
      othersFields,
      headerData: [
        { title: "Customer Name:", description: customerName },
        { title: "Week Ending", description: formatDateToShowDay(dataWeek.startDate) + " | " + formatDateToShowDay(dataWeek.endDate)}
      ],
      reportTitle: "Daily Hours",
      typeFormat: 1,
      nameXLSXFile: `dailyHours-${customerName}.xlsx`,
    };
    await request.fnExportToXLSX("/dailiesPayrolls/exportDailyHoursXLSX", data, `dailyHours-${customerName}.xlsx`);
    setLoading(false);
  }

  const [table, setTable] = useState({
    title: t("table.dailyHours.title"),
    columns: [
      ...defaultColumns
    ],
    data: tableData,
    freeActions: [{
      Icon: () => <ImportExport />,
      label: t("action.exportToExcel"),
      onClick: fnExportDocumentXLSX,
      color: 'secondary',
      disabled: true,
    }],
    options: {
      pageSize: 20,
      rowsPerPageOptions: [20, 40, 60, 80],
      getCellClassName: (params) => {
        return params.row.typeHours === "S" ? 'divider-cell' : '';
      }
    }
  });

  useEffect(() => {
    setLoading(true);
    request.GET('/customers/list', (resp) => {
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
    defaultColumns,
    table,
    dataWeek,
    setTable,
    screenControl,
    setCustomerName,
    setDataWeek,
    fnExportDocumentXLSX
  }

  return (
    {
      table,
      propsToHeader
    }
  )
}
