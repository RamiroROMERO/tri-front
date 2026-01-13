import { useState } from "react";

const useModalApplyAll = ({ customerData, setLoading, t, payrollLinesAll, employeesAll }) => {

  const [selectedPRL, setSelectedPRL] = useState(0);
  const [employeeSelected, setEmployeeSelected] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);

  const [table, setTable] = useState({
    title: `${t('dialog.enterHours.applyAllSelected')}`,
    columns: [
      { field: 'employeeCode', headerName: t('table.employees.column.code'), flex: 0.6 },
      { field: 'employeeName', headerName: t('table.employees.column.name'), flex: 1 },
      { field: 'classification', headerName: t('table.common.classifications'), flex: 0.9 },
    ],
    data: employeesAll,
    options: {
      checkboxSelection: true,
      onSelectionModelChange: (selected) => { setEmployeeSelected(selected) },
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  });

  const fnSaveAll = () => {
    console.log(employeeSelected);
  }

  return {
    table,
    fnSaveAll,
    selectedPRL,
    setSelectedPRL,
    selectedValue,
    setSelectedValue
  }
}

export default useModalApplyAll;