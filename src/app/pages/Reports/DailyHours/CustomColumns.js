import { formatDateToShowDay, formatNumber, validFloat } from 'app/utils/helpers';

export const CustomColumns = (defaultColumns, arrayDates, t) => {

  let customColumns = [...defaultColumns]
  const daysMap = { '1': 'm', '2': 't', '3': 'w', '4': 'th', '5': 'f', '6': 's', '7': 'su' };
  arrayDates.forEach((date) => {
    let numberDay = (new Date(date + 'T12:00:00Z')).getDay();
    let day = daysMap[numberDay || 7];
    customColumns.push({ headerName: t("table.common." + day) + ' ' + formatDateToShowDay(date), field: 'hoursWorked.' + date + '-' + day + '.hours', flex: 0.5, editable: false, sortable: false })
  });

  customColumns.push({
    headerName: t("table.dailyHours.totalhours"),
    field: 'totalHours',
    type: 'number',
    editable: false,
    flex: 0.6,
    valueFormatter: ({ value }) => formatNumber(value, '', 2)
  });

  customColumns.push({
    headerName: t("table.dailyHours.oThours"),
    field: 'oThours',
    type: 'number',
    editable: false,
    flex: 0.6,
    valueFormatter: ({ value }) => formatNumber(value, '', 2)
  });

  customColumns.push({
    headerName: t("table.dailyHours.notes"),
    field: 'notes',
    editable: false,
    flex: 0.6
  });

  customColumns.map((column) => {
    if (column.field !== 'project' && column.field !== 'totalHours' && column.field !== 'oThours' && column.field !== 'employeeName' && column.field !== 'notes' && column.field !== 'actions') {
      let fieldName = column.field.split('.')[1]
      column.renderCell = ({ row, field }) => {
        let hoursWorked = row?.hoursWorked[fieldName] || 0
        let value = hoursWorked?.hours || 0
        let valueOT = hoursWorked?.hoursOvertime || 0
        return validFloat(value) + validFloat(valueOT)
      }
    }
    return column
  })

  return customColumns;
}
