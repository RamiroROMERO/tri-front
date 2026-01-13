import React from 'react'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal } from 'app/components/Modal';
import { ModalNew } from './ModalNew';
import { useCustomers } from './useCustomers'
import { ModalConfirm } from 'app/components/ModalConfirm';
import { ModalContacts } from './ModalContacts';
import { ModalProjects } from './ModalProjects';

const Content = ({setLoading, sweetAlerts}) => {
  const {table, openModalNew, setOpenModalNew, openModalContacts, setOpenModalContacts, openModalProjects, setOpenModalProjects, openMsgDelete, setOpenMsgDelete, fnGetData, fnOkDelete, currentItem, listStatus} = useCustomers({setLoading, sweetAlerts});

  const propsToModalNew = {
    title: 'dialog.customers.title',
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: "md",
    data:{
      sweetAlerts,
      setLoading,
      fnGetData,
      currentItem
    }
  };

  const propsToModalContacts = {
    title: 'dialog.contacts.title',
    DialogContent: ModalContacts,
    open: openModalContacts,
    setOpen: setOpenModalContacts,
    maxWidth: "md",
    data:{
      sweetAlerts,
      setLoading,
      currentItem
    }
  }

  const propsToModalProjects = {
    title: 'dialog.newProjects.title',
    DialogContent: ModalProjects,
    open: openModalProjects,
    setOpen: setOpenModalProjects,
    maxWidth: "md",
    data:{
      sweetAlerts,
      setLoading,
      currentItem,
      listStatus
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
          <XDataGrid {...table}/>
        </CardContent>
      </Card>
      <Modal {...propsToModalNew}/>
      <Modal {...propsToModalContacts}/>
      <Modal {...propsToModalProjects}/>
      <ModalConfirm {...propsToModalConfirm}/>
    </>
  )
}

export default Content