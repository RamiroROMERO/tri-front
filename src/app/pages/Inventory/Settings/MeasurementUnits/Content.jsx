import React from 'react'
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { useMeasurementUnits } from './useMeasurementUnits';
import { ModalNew } from './ModalNew';
import { XDataGrid } from 'app/components/XDataGrid';
import { Card, CardContent } from '@mui/material';

const Content = ({ setLoading, sweetAlerts, t }) => {
  const { table, openMsgDelete, setOpenMsgDelete, openModalNew, setOpenModalNew, currentItem, fnGetData, fnOkDelete } = useMeasurementUnits({ setLoading, sweetAlerts, t })

  const propsToModalNew = {
    title: 'dialog.measurementUnits.title',
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