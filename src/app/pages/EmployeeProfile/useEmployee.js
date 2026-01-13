import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { request } from 'app/utils/core';
import { Chip, Grid } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Edit } from '@mui/icons-material';
import { SimpleSelect } from 'app/components/SimpleSelect';
import { validInt } from 'app/utils/helpers';
import { SearchSelect } from 'app/components/SearchSelect';

export const useEmployee = ({ setLoading, sweetAlerts }) => {
  const { state } = useLocation();
  const employeeSelected = state?.employeeSelected || 0;
  const [employeeStatusSelected, setEmployeeStatusSelected] = useState(4);
  const [employeeId, setEmployeeId] = useState(employeeSelected);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [listCustomer, setListCustomer] = useState([]);
  const [listClassification, setListClassification] = useState([]);
  const [listSector, setListSector] = useState([]);
  const [listBanks, setListBanks] = useState([]);
  const [listCiaAccount, setListCiaAccount] = useState([]);
  const [listStatus, setListStatus] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [openSeekEmployee, setOpenSeekEmployee] = useState(false);
  const { t } = useTranslation();

  const fnSelectEmp = (row)=>{
    setLoading(true);
    request.GET(`/employeeProfileToEdit/${row.id}`, (resp) => {
      const { data } = resp;
      const { employeeData } = data;
      if (employeeData.id) setCurrentItem(employeeData);
      setEmployeeId(row.id);
      setOpenSeekEmployee(true);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const onStatusChange = e => {
    const status = e.target.value;
    setEmployeeStatusSelected(status);
  }

  const onCustomerChange = e => {
    const value = e.target.value;
    setCustomerSelected(value);
  }

  const table = {
    title: t("dialog.employeeProfile.seek"),
    columns: [
      {field: 'code', headerName: t('table.employees.code'), flex: 0.5},
      {field: 'name', headerName: t('table.employees.column.name'), flex: 1},
      {field: 'classificationName', headerName: t('table.employees.column.classificationName'), flex: 0.5},
      {field: 'statusName', headerName: t('table.employees.column.status'), flex: 0.5,
        renderCell: ({row})=>{
          if(row.statusName === 'Active') return <Chip label="Active" color="info" />
          if(row.statusName === 'Inactive') return <Chip label="Inactive" color="warning" />
          if(row.statusName === 'Retired') return <Chip label="Retired" color="error" />
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 90,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={< Edit />}
            label={t("button.select")}
            onClick={() => fnSelectEmp(row)}
            color='warning'
          />,
        ],
      },
    ],
    data: employeeList,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    },
    freeActions: [],
    customControls: [
      <Grid container spacing={2} marginTop={1} direction='row'>
        <Grid item xs={12} sm={8} lg={9} >
          <SearchSelect
            label={t("table.employees.customerId")}
            name='customerSelected'
            value={customerSelected}
            onChange={onCustomerChange}
            optionList={listCustomer}
          />
        </Grid>
        <Grid item xs={12} sm={4} lg={3} >
          <SimpleSelect
            label={t('table.activeEmployees.column.status')}
            name='employeeStatusSelected'
            value={employeeStatusSelected}
            onChange={onStatusChange}
            optionList={listStatus}
          />
        </Grid>
      </Grid>
    ]
  };

  const fnGetEmployeeList = () => {
    setLoading(true);
    let urlGet = '/employees/list';
    if(validInt(employeeStatusSelected)>0){
      urlGet = `/employees/list?statusId=${employeeStatusSelected}`
    }
    if(validInt(customerSelected)>0){
      urlGet = `/employees/list?customerId=${customerSelected}`
    }
    if(validInt(employeeStatusSelected)>0 && validInt(customerSelected)>0){
      urlGet = `/employees/list?statusId=${employeeStatusSelected}&customerId=${customerSelected}`
    }
    request.GET(urlGet, res => {
      const listEmployees = res.employees.map(employee => {
        const item = {
          id: employee.id,
          name: employee.name,
          code: employee.code,
          classificationName: employee?.classification?.name || '',
          statusName: employee.statusId === 4 ? 'Active' : employee.statusId === 5 ? 'Inactive' : 'Retired'
        }
        return item;
      });
      setEmployeeList(listEmployees);
      setLoading(false);
    }, err => {
      console.error(err);
      setLoading(false);
    });
  };

  const fnGetEmployees = () => {
    setLoading(true);
    request.GET(`/employeeProfileToEdit/0`, (resp) => {
      const { data } = resp;
      const { bankList, classificationList, sectorList, customerList, ciaAccountList, statusList, employeeData } = data;
      setListBanks([...bankList]);
      setListClassification([...classificationList]);
      setListSector([...sectorList]);
      setListCustomer([...customerList]);
      setListCiaAccount([...ciaAccountList]);
      setListStatus([...statusList]);
      // if (employeeData.id) onBulkForm(employeeData);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  useEffect(() => {
    fnGetEmployees();
    fnGetEmployeeList();
  }, [employeeStatusSelected, customerSelected]);

  return (
    {
      employeeId,
      currentItem,
      table,
      listCustomer,
      listClassification,
      listSector,
      listBanks,
      listCiaAccount,
      listStatus,
      openSeekEmployee,
      setOpenSeekEmployee,
      fnGetEmployeeList
    }
  )
}
