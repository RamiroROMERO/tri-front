import React from 'react'
import { useProvider } from './useProvider'
import { XDataGrid } from 'app/components/XDataGrid';
import { Card, CardContent } from '@mui/material';
import { Modal } from 'app/components/Modal';
import { ModalNew } from './ModalNew';
import { ModalConfirm } from 'app/components/ModalConfirm';

const Content = ({setLoading, sweetAlerts}) => {

  const {table, openModalNew, setOpenModalNew, openMsgDelete, setOpenMsgDelete, fnOkDelete, fnGetData, currentItem} = useProvider({setLoading, sweetAlerts});

  const propsToModalNewDocto = {
    title: 'dialog.providers.title',
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: "lg",
    data:{
      sweetAlerts,
      setLoading,
      fnGetData,
      currentItem
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
    <Modal {...propsToModalNewDocto}/>
    <ModalConfirm {...propsToModalConfirm}/>
    </>
  )
}

export default Content