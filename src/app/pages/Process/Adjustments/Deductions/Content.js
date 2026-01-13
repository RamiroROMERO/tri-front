import React from 'react'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal, ModalConfirm } from 'app/components';
import { useAdjustments } from '../Adjustment/useAdjustments';
import { ModalExport } from '../Adjustment/ModalExport';
import HeaderSection from '../Adjustment/HeaderSection';

const Content = ({setLoading, sweetAlerts, screenControl}) => {
  const typeId = 2;

  const {propsToHeaderSection, propsToModalExport, table, openMsgDelete, openModalExport, setOpenMsgDelete, setOpenModalExport, fnOkDelete} = useAdjustments({setLoading, sweetAlerts, typeId, screenControl});

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDelete
  }

  const propsToModalExportAdjustments = {
    title: 'dialog.exportAdjustments.title',
    DialogContent: ModalExport,
    open: openModalExport,
    setOpen: setOpenModalExport,
    maxWidth: 'sm',
    data: propsToModalExport
  };

  return (
    <>
      <HeaderSection {...propsToHeaderSection}/>
      <Card>
        <CardContent>
          <XDataGrid {...table}/>
        </CardContent>
      </Card>
      <ModalConfirm {...propsToModalConfirm}/>
      <Modal {...propsToModalExportAdjustments}/>
    </>
  )
}

export default Content