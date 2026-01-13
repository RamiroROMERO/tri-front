import React from 'react'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal, ModalConfirm } from 'app/components';
import { useOtherPayments } from './useOtherPayments'
import ModalNew from './ModalNew';

const Content = ({setLoading, sweetAlerts, controlAdmin}) => {

  const {table, openModalNew, setOpenModalNew, fnGetData, currentItem, openMsgDelete, setOpenMsgDelete, fnOkDelete, titleModalNew, listCustomers} = useOtherPayments({setLoading, sweetAlerts, controlAdmin});

  const propsToModalNew = {
    title: titleModalNew,
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: "sm",
    data:{
      sweetAlerts,
      setLoading,
      fnGetData,
      currentItem,
      listCustomers
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
      <ModalConfirm {...propsToModalConfirm}/>
    </>
  )
}

export default Content