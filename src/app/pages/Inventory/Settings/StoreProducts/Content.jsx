import React from 'react'
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { ModalNew } from './ModalNew';
import { useStoreProducts } from './useStoreProducts';
import { XDataGrid } from 'app/components/XDataGrid';
import { Card, CardContent } from '@mui/material';

const Content = ({ setLoading, sweetAlerts, t }) => {
  const { table, openMsgDelete, setOpenMsgDelete, openModalNew, setOpenModalNew, currentItem, fnGetData, fnOkDelete, listStores, productList, listLocation } = useStoreProducts({ setLoading, sweetAlerts, t })

  const propsToModalNew = {
    title: 'dialog.storeproducts.title',
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: "md",
    data: {
      sweetAlerts,
      setLoading,
      fnGetData,
      currentItem,
      listStores,
      productList,
      listLocation
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