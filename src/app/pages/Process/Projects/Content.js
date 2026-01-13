import React from 'react'
import { Card, CardContent, Grid } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal, ModalConfirm } from 'app/components';
import { useProjects } from './useProjects'
import { useTableProjects } from './useTableProjects';
import { ModalNew } from './ModalNew';
import CardListCustomer from './CardListCustomer'
import FilterStatus from './FilterStatus';
import { ModalChangeStatus } from './ModalChangeStatus';
import { ModalLocations } from './ModalLocations';
import { ModalViewInfo } from './ModalViewInfo';
import ModalProjectsWithoutH from '../Payroll/ModalProjectsWithoutH';

const Content = ({ setLoading, sweetAlerts, setActions, screenControl, adminControl }) => {

  const { t, yearId, customerId, customerName, noRecords1, noRecords2, noRecords3, tableData, weekId, listYears, listCustomers, listStatus, listLocations, listWeeksWorked, dataLocations, fnGetProjects, onYearChange, fnGetListCustomers, fnGetLocations, openModalLocations, openModalProjectsWithoutHours, setWeekId, setOpenModalLocations, setOpenModalProjectsWithoutHours } = useProjects({ setLoading, setActions, adminControl });

  const { table, openModalNew, setOpenModalNew, openMsgDelete, setOpenMsgDelete, openEditStatus, setOpenEditStatus, fnOkDelete, currentItem, titleModalNew, openModalViewInfo, setOpenModalViewInfo } = useTableProjects({ t, tableData, customerName, customerId, fnGetProjects, fnGetListCustomers, sweetAlerts, setLoading, screenControl });

  const propsToCardListCustomer = {
    t,
    yearId,
    customerId,
    onYearChange,
    listYears,
    listCustomers,
    fnGetProjects
  }

  const propsToFilterStatus = {
    t,
    noRecords1,
    noRecords2,
    noRecords3,
    customerId,
    yearId,
    fnGetProjects
  }

  const propsToModalNew = {
    title: titleModalNew,
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: "sm",
    data: {
      sweetAlerts,
      setLoading,
      currentItem,
      customerId,
      listCustomers,
      listStatus,
      listLocations,
      screenControl,
      fnGetProjects,
      fnGetListCustomers
    }
  }

  const propsToModalViewInfo = {
    title: "dialog.projects.viewInfo",
    DialogContent: ModalViewInfo,
    open: openModalViewInfo,
    setOpen: setOpenModalViewInfo,
    maxWidth: "md",
    data: {
      setLoading,
      currentItem
    }
  }

  const propsToModalEditStatus = {
    title: 'dialog.closeProject.title',
    DialogContent: ModalChangeStatus,
    open: openEditStatus,
    setOpen: setOpenEditStatus,
    maxWidth: "xs",
    data: {
      sweetAlerts,
      setLoading,
      currentItem,
      customerId,
      listStatus,
      screenControl,
      fnGetProjects,
      fnGetListCustomers
    }
  }

  const propsToModalLocations = {
    title: 'table.common.addProjectLocation',
    DialogContent: ModalLocations,
    open: openModalLocations,
    setOpen: setOpenModalLocations,
    maxWidth: "sm",
    data: {
      sweetAlerts,
      setLoading,
      dataLocations,
      screenControl,
      fnGetLocations
    }
  }

  const propsToModalProjectsWithoutHours = {
    title: 'modal.payroll.projectsWithoutHours.title',
    DialogContent: ModalProjectsWithoutH,
    open: openModalProjectsWithoutHours,
    setOpen: setOpenModalProjectsWithoutHours,
    maxWidth: "md",
    data: {
      weekId,
      customerId,
      customerName,
      listWeeksWorked,
      setLoading,
      setWeekId
    }
  }

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDelete
  }

  return (
    <>
      <Grid container spacing={3} direction='row'>
        <Grid item xs={12} sm={4} md={3} xl={3}>
          <CardListCustomer {...propsToCardListCustomer} />
        </Grid>
        <Grid item xs={12} sm={8} md={9} xl={9}>
          <Grid container spacing={3} direction='row'>
            <Grid item xs={12}>
              <FilterStatus {...propsToFilterStatus} />
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <XDataGrid {...table} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal {...propsToModalNew} />
      <Modal {...propsToModalEditStatus} />
      <Modal {...propsToModalLocations} />
      <Modal {...propsToModalViewInfo} />
      <Modal {...propsToModalProjectsWithoutHours} />
      <ModalConfirm {...propsToModalConfirm} />
    </>
  )
}

export default Content