import React from 'react'
import { useEmployees } from './useEmployees';
import { Modal, ModalConfirm } from 'app/components';
import { ModalNewEmployee } from './ModalNewEmployee';
import { ModalEditEmployee } from './ModalEditEmployee';
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { ModalRates } from './ModalRates';

const Content = ({ setLoading, sweetAlerts, setActions, screenControl, adminControl }) => {

  const { dataToModalNew, dataToModalEdit, openModalNew, setOpenModalNew, openModalEdit, setOpenModalEdit, openModalEditRates, setOpenModalEditRates, table, fnGetEmployeeData, selectedRecord, customerList, openMsgDelete, setOpenMsgDelete, fnOkDeleteRecord, propsToModalCiaAccounts } = useEmployees({ setLoading, sweetAlerts, setActions, screenControl, adminControl });

  const propsToModalNew = {
    title: 'dialog.employees.title',
    DialogContent: ModalNewEmployee,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: 'md',
    data: {
      ...dataToModalNew,
      setLoading,
      sweetAlerts,
      onRefreshData: fnGetEmployeeData,
      screenControl
    }
  };

  const propsToModalEdit = {
    title: 'dialog.employees.edit',
    DialogContent: ModalEditEmployee,
    open: openModalEdit,
    setOpen: setOpenModalEdit,
    maxWidth: 'md',
    data: {
      ...dataToModalEdit,
      setLoading,
      sweetAlerts,
      onRefreshData: fnGetEmployeeData,
      screenControl
    }
  };

  const propsToModalEditRates = {
    title: 'dialog.editRates.title',
    DialogContent: ModalRates,
    open: openModalEditRates,
    setOpen: setOpenModalEditRates,
    maxWidth: "lg",
    data: {
      sweetAlerts,
      setLoading,
      selectedRecord,
      customerList
    }
  }

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDeleteRecord
  }

  return (
    <>
      <Card>
        <CardContent>
          <XDataGrid {...table} />
        </CardContent>
      </Card>
      <Modal {...propsToModalNew} />
      <Modal {...propsToModalEdit} />
      <Modal {...propsToModalEditRates} />
      <Modal {...propsToModalCiaAccounts} />
      <ModalConfirm {...propsToModalConfirm} />
    </>
  )
}

export default Content