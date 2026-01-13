import React from 'react'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { useCustomers } from './useCustomers'
import { ModalNew } from './ModalNew';
import { ModalContacts } from './ModalContacts';
import { ModalClassifications } from './ModalClassifications';
import { ModalRates } from './ModalRates';
import { ModalQuickbookCustomer } from './ModalQuickbookCustomer';

const Content = ({ setLoading, sweetAlerts, screenControl, adminControl }) => {
  const {table, openModalNew, setOpenModalNew, openModalContacts, setOpenModalContacts, openModalClassifications, setOpenModalClassifications, openModalRates, setOpenModalRates, openModalQuickbookCust, setOpenModalQuickbookCust, openMsgDelete, setOpenMsgDelete, fnOkDelete, fnGetData, currentItem, listClassifications, listCompanyQuickbook, titleModalNew } = useCustomers({ setLoading, sweetAlerts, screenControl, adminControl });

  const propsToModalNew = {
    title: titleModalNew,
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: "lg",
    data: {
      sweetAlerts,
      setLoading,
      fnGetData,
      currentItem,
      screenControl
    }
  }

  const propsToModalContacts = {
    title: 'dialog.contacts.title',
    DialogContent: ModalContacts,
    open: openModalContacts,
    setOpen: setOpenModalContacts,
    maxWidth: "md",
    data: {
      sweetAlerts,
      setLoading,
      currentItem
    }
  }

  const propsToModalClassifications = {
    title: 'dialog.classificatons.title',
    DialogContent: ModalClassifications,
    open: openModalClassifications,
    setOpen: setOpenModalClassifications,
    maxWidth: "md",
    data: {
      sweetAlerts,
      setLoading,
      currentItem,
      listClassifications
    }
  }

  const propsToModalEditRates = {
    title: 'dialog.editRates.title',
    DialogContent: ModalRates,
    open: openModalRates,
    setOpen: setOpenModalRates,
    maxWidth: "lg",
    data: {
      sweetAlerts,
      setLoading,
      currentItem
    }
  }

  const propsToModalQuickbookCust = {
    title: 'dialog.customers.qbkCustomer',
    DialogContent: ModalQuickbookCustomer,
    open: openModalQuickbookCust,
    setOpen: setOpenModalQuickbookCust,
    maxWidth: "md",
    data: {
      sweetAlerts,
      setLoading,
      currentItem,
      listCompanyQuickbook
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
      <Card>
        <CardContent>
          <XDataGrid {...table} />
        </CardContent>
      </Card>
      <Modal {...propsToModalNew} />
      <Modal {...propsToModalContacts} />
      <Modal {...propsToModalClassifications} />
      <Modal {...propsToModalEditRates} />
      <Modal {...propsToModalQuickbookCust} />
      <ModalConfirm {...propsToModalConfirm} />
    </>
  )
}

export default Content