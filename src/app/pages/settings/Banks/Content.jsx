import React from 'react'
import { Card, CardContent } from '@mui/material';
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { XDataGrid } from 'app/components/XDataGrid';
import { useBanks } from './useBanks';
import ModalNew from './ModalNew';

const Content = ({setLoading, sweetAlerts, controlAdmin}) => {

  const {table, openModalNew, setOpenModalNew, fnGetData, currentItem, openMsgDelete, setOpenMsgDelete, fnOkDelete} = useBanks({setLoading, sweetAlerts, controlAdmin});

  const propsToModalNew = {
    title: 'dialog.banks.title',
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: "sm",
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
      <Modal {...propsToModalNew}/>
      <ModalConfirm {...propsToModalConfirm}/>
    </>
  )
}

export default Content;