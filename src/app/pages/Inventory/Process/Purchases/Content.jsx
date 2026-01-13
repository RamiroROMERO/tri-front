import React from 'react'
import { usePurchases } from './usePurchases'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { ModalNew } from './ModalNew';
import { ModalDetail } from './ModalDetail';

const Content = ({setLoading, sweetAlerts}) => {

  const {table, fnGetData, openModalNew, setOpenModalNew, openModalDetail, setOpenModalDetail, openMsgDelete, setOpenMsgDelete, openMsgClose, setOpenMsgClose, fnOkDelete, fnOkCloseDocto, currentItem, listCustomers, listProducts, listProjects, listProviders} = usePurchases({setLoading, sweetAlerts});

  const propsToModalNew = {
    title: 'dialog.purchases.title',
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: 'md',
    data: {
      fnGetData,
      sweetAlerts,
      setLoading,
      currentItem,
      listCustomers,
      listProjects,
      listProviders
    }
  };

  const propsToModalDetail = {
    title: 'dialog.purchases.detail.title',
    DialogContent: ModalDetail,
    open: openModalDetail,
    setOpen: setOpenModalDetail,
    maxWidth: 'lg',
    data: {
      fnGetData,
      sweetAlerts,
      setLoading,
      currentItem,
      listProducts
    }
  };

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDelete
  }

  const propsToModalConfirmClose = {
    open: openMsgClose,
    setOpen: setOpenMsgClose,
    message: "dialog.confirm.text.closeDocto",
    onSuccess: fnOkCloseDocto
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
    <ModalConfirm {...propsToModalConfirmClose}/>
    </>
  )
}

export default Content