import React from 'react'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { usePurchaseOrder } from './usePurchaseOrder'
import { ModalProcess } from './ModalProcess';
import { ModalNew } from './ModalNew';
import { ModalSendEmail } from './ModalSendEmail';
import ModalDetail from './ModalDetail';

const Content = ({setLoading, sweetAlerts}) => {

  const {table, openModalNew, setOpenModalNew, openModalDetail, setOpenModalDetail, openModalProcess, setOpenModalProcess, openModalSendEmail, setOpenModalSendEmail, openMsgDelete, setOpenMsgDelete, fnOkDelete, fnGetData, currentItem, listCustomers, listProjects, listProviders, listProducts} = usePurchaseOrder({setLoading, sweetAlerts});

  const propsToModalNewDocto = {
    title: 'dialog.purchaseOrders.title',
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: "md",
    data:{
      sweetAlerts,
      setLoading,
      fnGetData,
      currentItem,
      listCustomers,
      listProjects,
      listProviders
    }
  }

  const propsToModalDetailDocto = {
    title: 'dialog.purchaseOrders.detail.title',
    DialogContent: ModalDetail,
    open: openModalDetail,
    setOpen: setOpenModalDetail,
    maxWidth: "xl",
    data:{
      sweetAlerts,
      setLoading,
      fnGetData,
      currentItem,
      listProducts
    }
  }

  const propsToModalProcess = {
    title: 'dialog.purchaseOrders.proccess.title',
    DialogContent: ModalProcess,
    open: openModalProcess,
    setOpen: setOpenModalProcess,
    maxWidth: 'lg',
    data: {
      sweetAlerts,
      currentItem,
      setLoading,
      fnGetData
    }
  };

  const propsToModalSendEmail = {
    title: 'dialog.purchaseOrders.sendEmail.title',
    DialogContent: ModalSendEmail,
    open: openModalSendEmail,
    setOpen: setOpenModalSendEmail,
    maxWidth: 'sm',
    data: {
      sweetAlerts,
      currentItem,
      setLoading
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
    <Modal {...propsToModalNewDocto}/>
    <Modal {...propsToModalDetailDocto}/>
    <Modal {...propsToModalProcess}/>
    <Modal {...propsToModalSendEmail}/>
    <ModalConfirm {...propsToModalConfirm}/>
    </>
  )
}

export default Content