import React from 'react'
import { Card, CardContent } from '@mui/material';
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { XDataGrid } from 'app/components/XDataGrid';
import { useManageWeeks } from './useManageWeeks';
import ModalNew from './ModalNew';
import FilterWeeks from './FilterWeeks';

const Content = ({setLoading, sweetAlerts, controlAdmin}) => {
  const {table, openModalNew, setOpenModalNew, openMsgDelete, setOpenMsgDelete, fnOkDelete, yearFilter, fnFilterWeeks, listYears, t, fnGetData, currentItem, titleModalNew} = useManageWeeks({setLoading, sweetAlerts, controlAdmin});

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
      yearFilter
    }
  }

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDelete
  }

  const propsToFilterWeeks = {
    yearFilter,
    listYears,
    fnFilterWeeks,
    t
  }

  return (
    <>
      <FilterWeeks {...propsToFilterWeeks}/>
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