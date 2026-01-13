import React from 'react'
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { useStores } from './useStores';
import { XDataGrid } from 'app/components/XDataGrid';
import { Card, CardContent } from '@mui/material';
import { ModalNew } from './ModalNew';

const Content = ({ setLoading, sweetAlerts, t }) => {

  const { table, openMsgDelete, setOpenMsgDelete, fnOkDelete, fnGetData, currentItem, openModalNew,
    setOpenModalNew } = useStores({ setLoading, sweetAlerts, t })

  const propsToModalNew = {
    title: 'dialog.stores.title',
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: "sm",
    data: {
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
          <XDataGrid {...table} />
          <Modal {...propsToModalNew} />
          <ModalConfirm {...propsToModalConfirm} />
        </CardContent>
      </Card></>
  )
}

export default Content
