import React from 'react'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal, ModalConfirm } from 'app/components';
import { ModalEdit } from './ModalEdit';
import { useMissingTimes } from './useMissingTimes'
import HeaderSection from './HeaderSection';

const Content = ({setLoading, sweetAlerts, screenControl}) => {

  const {propsToHeader, table, currentItem, openMsgDelete, setOpenMsgDelete, openModalEdit, setOpenModalEdit, fnOkDelete, fnGetData} = useMissingTimes({setLoading, sweetAlerts, screenControl});

  const propsToModalEdit = {
    title: 'dialog.missingtimes.edit.title',
    DialogContent: ModalEdit,
    open: openModalEdit,
    setOpen: setOpenModalEdit,
    maxWidth: 'md',
    data: {
      currentItem,
      setLoading,
      sweetAlerts,
      fnGetData,
      screenControl
    }
  };

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDelete
  }

  return (
    <>
      <HeaderSection {...propsToHeader}/>
      <Card>
        <CardContent>
          <XDataGrid {...table}/>
        </CardContent>
      </Card>
      <Modal {...propsToModalEdit}/>
      <ModalConfirm {...propsToModalConfirm}/>
    </>
  )
}

export default Content