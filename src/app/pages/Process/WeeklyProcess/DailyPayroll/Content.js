import React from 'react'
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal } from 'app/components';
import { useDailyPayroll } from './useDailyPayroll';
import { ModalEnterHours } from './ModalEnterHours';
import { ModalChangeProject } from './ModalChangeProject';
import { ModalAddEmployees } from './ModalAddEmployees';
import { ModalImportXLSX } from './ModalImportXLSX';
import Header from './Header';
import FooterTotals from './FooterTotals';
import { ModalNewEmployee } from 'app/pages/Employees/ModalNewEmployee';
import ModalEmployeesWithoutH from '../../Payroll/ModalEmployeesWithoutH';

const Content = ({ setLoading, sweetAlerts, setActions, screenControl, adminControl }) => {
  const { customerData, weekData, pathToReturn, weekId } = useLocation().state;
  const customerName = customerData.customerName;
  const customerId = customerData.customerId;
  const projectId = customerData.id;
  const projectCode = customerData.code;
  const projectName = customerData.name;
  const weekSelect = weekData.label;

  const { t, table, currentItem, totalsHours, payrollLineTypes, openModalEnterHours, valueTabSelect, listDates, openChangeProject, listProjectsCustomer, classificationList, sectorList, listEmployees, dataEmployeesWithoutH, openAddEmployee, openNewEmployee, openModalEmployeesWithoutHours, setOpenNewEmployee, setOpenAddEmployee, setOpenChangeProject, setOpenModalEnterHours, setOpenModalEmployeesWithoutHours, setValueTabSelect, fnUpdateDataToUpdate, fnSaveAll, navigate, fnGetPayroll, onRefreshData, openModalImportXLSX, setOpenModalImportXLSX, sortGridModel, setSortGridModel, complementaryData, propsToModalApplyAll } = useDailyPayroll({ customerData, weekId, weekData, setLoading, sweetAlerts, setActions, pathToReturn, adminControl });

  const propsToHeader = {
    customerName,
    projectCode,
    projectName,
    weekSelect,
    t,
    setLoading,
    complData: complementaryData
  }

  const propstToFooterTotal = {
    t,
    ...totalsHours
  }

  const propsToModalEnterHours = {
    title: 'table.dailiesPayrolls.title',
    DialogContent: ModalEnterHours,
    open: openModalEnterHours,
    setOpen: setOpenModalEnterHours,
    maxWidth: 'lg',
    data: {
      currentItem,
      valueTabSelect,
      payrollLineTypes,
      sweetAlerts,
      customerData,
      listDates,
      setLoading,
      setValueTabSelect,
      fnUpdateDataToUpdate,
      fnSaveAll,
      fnGetPayroll
    }
  };

  const propsToModalChangeProject = {
    title: 'dialog.enterHours.changeProject',
    DialogContent: ModalChangeProject,
    open: openChangeProject,
    setOpen: setOpenChangeProject,
    maxWidth: 'xs',
    data: {
      listProjectsCustomer,
      customerData,
      locationData: useLocation().state,
      navigate,
      setSortGridModel
    }
  };

  const propsToModalAddEmployees = {
    title: 'dialog.projects.title',
    DialogContent: ModalAddEmployees,
    open: openAddEmployee,
    setOpen: setOpenAddEmployee,
    maxWidth: 'sm',
    data: {
      projectId,
      customerId,
      setLoading,
      sweetAlerts,
      fnGetPayroll
    }
  };

  const propsToModalNewEmployees = {
    title: 'dialog.employees.title',
    DialogContent: ModalNewEmployee,
    open: openNewEmployee,
    setOpen: setOpenNewEmployee,
    maxWidth: 'md',
    data: {
      projectId,
      customerId,
      classificationList,
      sectorList,
      listEmployees,
      setLoading,
      sweetAlerts,
      onRefreshData,
      screenControl
    }
  };

  const propsToModalImportXLXS = {
    title: "dialog.enterHours.importXLSX",
    DialogContent: ModalImportXLSX,
    open: openModalImportXLSX,
    setOpen: setOpenModalImportXLSX,
    maxWidth: 'xl',
    data: {
      customerId,
      customerName,
      projectId,
      projectCode,
      projectName,
      weekSelect,
      setLoading,
      weekId,
      weekData
    }
  };

  const propsToModalEmployeesWithoutHours = {
    title: 'modal.payroll.employeesWithoutHours.title',
    DialogContent: ModalEmployeesWithoutH,
    open: openModalEmployeesWithoutHours,
    setOpen: setOpenModalEmployeesWithoutHours,
    maxWidth: "md",
    data: {
      weekId,
      customerId,
      dataEmployeesWithoutH,
      customerName,
      weekSelect,
      // numWeek,
      // startDate,
      // endDate,
      setLoading
    }
  }

  return (
    <>
      <Header {...propsToHeader} />
      <Card sx={{ mt: 3, mb: 3 }}>
        <CardContent>
          <XDataGrid {...table} sortModel={sortGridModel} onSortModelChange={(newSortModel) => setSortGridModel(newSortModel)} />
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.dailiesPayrolls.title.footer')}</Typography>
        </CardContent>
      </Card>
      <FooterTotals {...propstToFooterTotal} />
      <Modal {...propsToModalEnterHours} />
      <Modal {...propsToModalChangeProject} />
      <Modal {...propsToModalAddEmployees} />
      <Modal {...propsToModalNewEmployees} />
      <Modal {...propsToModalImportXLXS} />
      <Modal {...propsToModalApplyAll} />
      <Modal {...propsToModalEmployeesWithoutHours} />
    </>
  )
}

export default Content