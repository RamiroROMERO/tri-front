import React from 'react'
import { useProducts } from './useProducts'
import { XDataGrid } from 'app/components/XDataGrid';
import { Card, CardContent } from '@mui/material';
import { ProductDetailModal } from './ProductDetailModal';
import { Modal, ModalConfirm } from 'app/components';
const Content = ({setLoading, sweetAlerts, t}) => {

  const {tableConfig, dataToModalDetail, openModalDetail, setOpenModalDetail, openMsgDelete, setOpenMsgDelete, fnOkDelete} = useProducts({setLoading, sweetAlerts, t});

  const propsToModalDetail = {
    title: 'dialog.products.title',
    DialogContent: ProductDetailModal,
    open: openModalDetail,
    setOpen: setOpenModalDetail,
    maxWidth: 'md',
    data: {
      setLoading,
      sweetAlerts,
      ...dataToModalDetail
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
        <XDataGrid  {...tableConfig} />
        <Modal {...propsToModalDetail} />
        <ModalConfirm {...propsToModalConfirm}/>
      </CardContent>
    </Card>
    </>
  )
}

export default Content