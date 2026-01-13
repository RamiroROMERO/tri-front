import React from 'react'
import { useAccounts } from './useAccounts'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { ModalDetail } from './ModalDetail';
import { Modal } from 'app/components/Modal';

const Content = ({setLoading, sweetAlerts}) => {

  const {table, currentItem, openModalDetail, setOpenModalDetail, fnGetData} = useAccounts({setLoading});

  const propsToModalViewDetail = {
    title: 'dialog.accountsPayable.detail.title',
    DialogContent: ModalDetail,
    open: openModalDetail,
    setOpen: setOpenModalDetail,
    maxWidth: "lg",
    data:{
      sweetAlerts,
      setLoading,
      currentItem,
      fnGetData
    }
  }

  return (
    <>
    <Card>
      <CardContent>
        <XDataGrid {...table}/>
      </CardContent>
    </Card>
    <Modal {...propsToModalViewDetail}/>
    </>
  )
}

export default Content