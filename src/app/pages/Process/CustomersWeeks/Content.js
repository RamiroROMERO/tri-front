import React from 'react'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { ModalEdit } from './ModalEdit';
import { useCustomerWeeks } from './useCustomerWeeks'
import { ModalGenerateYear } from './ModalGenerateYear';
import FilterWeeks from './FilterWeeks';

const Content = ({setLoading, sweetAlerts, screenControl, controlAdmin}) => {

  const {table, openModalNew, setOpenModalNew, openModalGenerate, setOpenModalGenerate, openMsgDelete, setOpenMsgDelete, listYears, listCustomers, currentItem, formState, formValidation, isFormValid, onInputChange, sendForm, fnFilterWeeks, fnGenerateWeeks, t, fnGetData, fnOkDelete, yearFilter, customerFilter, titleModalNew} = useCustomerWeeks({setLoading, sweetAlerts, screenControl, controlAdmin});

  const propsToModalEdit = {
    title: titleModalNew,
    DialogContent: ModalEdit,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: "sm",
    data:{
      sweetAlerts,
      setLoading,
      fnGetData,
      currentItem,
      screenControl
    }
  }

  const propsToModalGenerate = {
    title: 'dialog.CustomerWeek.Edit.title',
    DialogContent: ModalGenerateYear,
    open: openModalGenerate,
    setOpen: setOpenModalGenerate,
    maxWidth: "sm",
    data:{
      sweetAlerts,
      setLoading,
      fnGetData,
      yearFilter,
      customerFilter,
      listCustomers
    }
  }

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDelete
  }

  const propsToFilterWeeks = {
    t,
    listYears,
    listCustomers,
    formState,
    formValidation,
    isFormValid,
    onInputChange,
    sendForm,
    fnFilterWeeks,
    fnGenerateWeeks
  }

  return (
    <>
    <FilterWeeks {...propsToFilterWeeks}/>
    <Card>
      <CardContent>
        <XDataGrid {...table}/>
      </CardContent>
    </Card>
    <Modal {...propsToModalEdit}/>
    <Modal {...propsToModalGenerate}/>
    <ModalConfirm {...propsToModalConfirm}/>
    </>
  )
}

export default Content