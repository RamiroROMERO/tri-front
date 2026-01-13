import React from 'react'
import { formatDateToShow, formatNumber, validFloat } from 'app/utils/helpers';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { AutoDelete, Edit } from '@mui/icons-material';
import { InputEnterHours } from 'app/components/InputEnterHours';

const CustomColumns = (defaultColumns, arrayDates, data, handleTableData, fnEditHours, fnClearHours, setOpenModalEnterHours, setCurrentItem, setValueTabSelect, t, rowsEdited, maxReghoursPayroll) => {

  const onChange = (value, fieldName, row, customColumns, hasOT = false) => {
    if (isNaN(value)) {
      let sNumber = value.replace(/[^ 0-9,.]/g, '');
      if (sNumber === '' || isNaN(sNumber)) {
        return
      } else {
        value = sNumber
      }
    }

    handleTableData(value, fieldName, row, data, customColumns, rowsEdited, hasOT)
  }

  let customColumns = [...defaultColumns]
  const daysMap = { '1': 'm', '2': 't', '3': 'w', '4': 'th', '5': 'f', '6': 's', '7': 'su' };
  arrayDates.forEach((date) => {
    let numberDay = (new Date(date + 'T12:00:00Z')).getDay();
    let day = daysMap[numberDay || 7];
    customColumns.push({ headerName: t("table.common." + day), field: 'hoursWorked.' + date + '-' + day + '.hours', flex: 0.5, editable: false, sortable: false })
  });

  customColumns.push({
    headerName: t("table.common.totalRT"),
    field: 'regularTime',
    type: 'number',
    editable: false,
    flex: 0.6,
    valueFormatter: ({ value }) => formatNumber(value, '', 2)
  });

  customColumns.push({
    headerName: t("table.common.totalOT"),
    field: 'extraTime',
    type: 'number',
    editable: false,
    flex: 0.6,
    valueFormatter: ({ value }) => formatNumber(value, '', 2)
  });

  customColumns.push({
    headerName: t("table.common.totalHours"),
    field: 'totalHoursFather',
    type: 'number',
    editable: false,
    flex: 0.6,
    valueFormatter: ({ value }) => formatNumber(value, '', 2)
  });

  customColumns.push({
    headerName: t("table.common.actions"),
    field: 'actions',
    type: 'actions',
    width: 120,
    getActions: ({ row }) => [
      <GridActionsCellItem
        icon={<Edit />}
        label={t("action.editWeek")}
        onClick={() => fnEditHours(row)}
        color='info'
      />,
      <GridActionsCellItem
        icon={<AutoDelete />}
        label={t("action.clear")}
        onClick={() => fnClearHours(row, data)}
        color='error'
      />,
    ]
  });

  customColumns.map((column) => {
    if (column.field !== 'totalHoursFather' && column.field !== 'extraTime' && column.field !== 'regularTime' && column.field !== 'employeeName' && column.field !== 'actions') {
      let fieldName = column.field.split('.')[1]
      column.renderCell = ({ row, field }) => {
        let hoursWorked = row.hoursWorked[fieldName]
        let value = hoursWorked.hours
        let valueOT = hoursWorked.hoursOvertime
        let date = formatDateToShow(hoursWorked.date)
        return (
          <InputEnterHours
            name={date}
            value={value}
            valueOvertime={valueOT}
            onChange={onChange}
            fieldName={fieldName}
            currentRow={row}
            customColumns={customColumns}
            colorInput={valueOT>0?'info':'secondary'}
            enableFocused={valueOT>0?true:false}
          />
        )
      }
    } else if (column.field === 'employeeName') {
      column.renderCell = ({ row }) => {
        const openDialog = () => {
          setCurrentItem(row);
          setValueTabSelect(1);
          setOpenModalEnterHours(true);
        }
        let { nTotal } = row.totalHoursRegister.reduce((res, curr, idx) => {
          res.nTotal +=curr.dailies_payrolls.reduce((re, cr) => { re += cr.isTotal ? 0 : validFloat(cr.hours); return re; }, 0);
          return res;
        }, { nTotal: 0});
        return <div onClick={(row.anotherProject && row.anotherProject == 1) ? openDialog : undefined} className={(row.anotherProject && row.anotherProject == 1 && nTotal <= maxReghoursPayroll) ? 'div-identifier-another-project' : (nTotal > maxReghoursPayroll ? 'div-identifier-hours-exceeded' : '')}> {row.employee.name}</div>
      }
    }
    return column
  })

  return customColumns;
}

export default CustomColumns