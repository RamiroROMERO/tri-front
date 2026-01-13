import React from 'react';
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { useProductTypes } from './useProductTypes';
import { ModalNew } from './ModalNew';
import { XDataGrid } from 'app/components/XDataGrid';
import { Card, CardContent } from '@mui/material';

const Content = ({ setLoading, sweetAlerts }) => {
  const { table, openMsgDelete, setOpenMsgDelete, fnOkDelete, fnGetData, currentItem, openModalNew, setOpenModalNew } = useProductTypes({ setLoading, sweetAlerts })

  const propsToModalNew = {
    title: 'dialog.productTypes.title',
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
      </Card>
    </>
  )
}

export default Content