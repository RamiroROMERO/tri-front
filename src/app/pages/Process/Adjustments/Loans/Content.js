import React from 'react'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal, ModalConfirm } from 'app/components';
import { ModalNew } from './ModalNew';
import { useLoans } from './useLoans'
import { ModalDetail } from './ModalDetail';

const Content = ({setLoading, sweetAlerts, screenControl, controlAdmin}) => {

  const {table, currentItem, typeDetail, listEmployees, openModalNew, setOpenModalNew, openMsgDelete, setOpenMsgDelete, openModalDetail, setOpenModalDetail, fnGetData, fnOkDelete} = useLoans({setLoading, sweetAlerts, screenControl});

  const propsToModalNew = {
    title: 'dialog.loansAdd',
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: 'sm',
    data: {
      currentItem,
      listEmployees,
      sweetAlerts,
      setLoading,
      fnGetData,
      screenControl
    }
  };

  const propsToModalDetail = {
    title: 'dialog.loansDetail',
    DialogContent: ModalDetail,
    open: openModalDetail,
    setOpen: setOpenModalDetail,
    maxWidth: 'md',
    data: {
      currentItem,
      setLoading,
      typeDetail,
      sweetAlerts,
      fnGetData,
      controlAdmin
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
      <Card>
        <CardContent>
          <XDataGrid {...table}/>
        </CardContent>
      </Card>
      <Modal {...propsToModalNew}/>
      <Modal {...propsToModalDetail}/>
      <ModalConfirm {...propsToModalConfirm}/>
    </>
  )
}

export default Content