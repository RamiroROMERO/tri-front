import React, { useState, useEffect } from 'react'
import { Switch } from '@mui/material';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useModalAddEmployees = ({ t, projectId, customerId, setLoading, sweetAlerts, fnGetPayroll, setOpen }) => {
  const [titleMsgChangeStatus, setTitleMsgChangeStatus] = useState('');
  const [openMsgChangeStatus, setOpenMsgChangeStatus] = useState(false);
  const [sendForm, setSendForm] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [listEmployeesToShow, setListEmployeesToShow] = useState([]);
  const [listAllEmployees, setListAllEmployees] = useState([]);
  const [currentItem, setCurrentItem] = useState({});

  const formValidations = {
    employeeId: [(val) => validInt(val) !== 0, t("alertMessages.warning.employeeId")]
  }

  const { formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm } = useForm({
    id: 0,
    employeeId: 0,
    status: true,
    noPayment: 0
  }, formValidations);

  const { id, employeeId, status, noPayment } = formState;

  const onStatusChange = (e, row) => {
    const valueStatus = e.target.checked;

    setTitleMsgChangeStatus(valueStatus === true ? 'component.sweetAlert.question.enableEmployee' : 'component.sweetAlert.question.disableEmployee');

    setCurrentItem(row);
    onBulkForm({ status: valueStatus });
    setOpenMsgChangeStatus(true);
  }

  const fnOkChangeStatus = () => {

    const newData = {
      id: currentItem.id,
      employeeId: currentItem.employeeId,
      projectId,
      status
    }
    setLoading(true);
    request.PUT('/weeklyPayrolls', newData, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetEmployeesInProject(listAllEmployees);
      fnGetPayroll();
      setLoading(false);
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  }

  const table = {
    title: '',
    columns: [
      { field: 'employeeName', headerName: t('table.common.employee'), flex: 1.5 },
      {
        field: 'statusIcon', headerName: t('table.common.status'), flex: 0.3,
        renderCell: ({ row, field, id }) => {
          return (
            <Switch
              id={'switch-' + id}
              checked={row[field]}
              onChange={(e) => onStatusChange(e, row)}
              inputProps={{ 'aria-label': 'controlled' }}
            />)
        }
      },
    ],
    data: tableData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  };

  const filterEmployeeList = (empList, empInProject) => {
    let filterArr = empList.filter(item => {
      let finding = empInProject.find(item2 => item2.employeeId === item.id);
      return (finding && finding.employeeId) ? false : true;
    });
    return filterArr
  }

  const fnGetEmployeesInProject = (employeesList) => {
    setLoading(true);
    request.GET(`/weeklyPayrolls/findEmployeesInProject?projectId=${projectId}`, (resp) => {
      const dataEmployees = resp.weeklyPayrolls.map((item) => {
        item.employeeName = item.employee.name
        item.statusIcon = item.status === 1 ? true : false
        return item
      });
      const employeesListFiltered = filterEmployeeList(employeesList, dataEmployees);
      setListEmployeesToShow(employeesListFiltered);

      const filterDataEmployees = dataEmployees.filter(item => item.employee.statusId === 4);

      setTableData(filterDataEmployees);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnAddEmployee = () => {
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.employeeId"));
      return;
    }

    const newData = {
      projectId,
      employeeId,
      status: 1
    }

    setLoading(true);
    request.POST('/weeklyPayrolls', newData, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }

      const employeesListFiltered = filterEmployeeList(listAllEmployees, [...tableData, newData]);
      setListEmployeesToShow(employeesListFiltered);
      fnGetEmployeesInProject(employeesListFiltered);
      fnGetPayroll();
      setSendForm(false);
      // setOpen(false);
      setLoading(false);
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

  useEffect(() => {
    setLoading(true);
    request.GET(`/employees/list?customerId=${customerId}&status=1`, (resp) => {
      const employees = resp.employees.map((item) => {
        return {
          id: item.id,
          value: item.id,
          label: item.code + " | " + item.name
        }
      });
      setListAllEmployees(employees);
      fnGetEmployeesInProject(employees);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }, []);

  return (
    {
      titleMsgChangeStatus,
      table,
      formState,
      formValidation,
      isFormValid,
      sendForm,
      listEmployeesToShow,
      openMsgChangeStatus,
      setOpenMsgChangeStatus,
      onInputChange,
      fnOkChangeStatus,
      fnAddEmployee
    }
  )
}
