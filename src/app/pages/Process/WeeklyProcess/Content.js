import React from 'react'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal } from 'app/components';
import { ModalSelectWeek } from './ModalSelectWeek';
import { useWeeklyProcess } from './useWeeklyProcess'
import FilterProjects from './FilterProjects';

const Content = ({setLoading, sweetAlerts, screenControl}) => {

  const {table, listCustomers, listYears, listWeeks, currentItem, formState, formValidation, isFormValid, onCustomerChange, sendForm, t, selectWeekTitle, openModalSelectWeek, setOpenModalSelectWeek} = useWeeklyProcess({setLoading, sweetAlerts, screenControl});

  const propsToModalSelectWeek = {
    title: selectWeekTitle,
    DialogContent: ModalSelectWeek,
    open: openModalSelectWeek,
    setOpen: setOpenModalSelectWeek,
    maxWidth: "sm",
    data:{
      sweetAlerts,
      currentItem,
      listYears,
      listWeeks
    }
  }

  const propsToFilterWeeks = {
    t,
    listCustomers,
    formState,
    formValidation,
    isFormValid,
    sendForm,
    onCustomerChange
  }

  return (
    <>
      <FilterProjects {...propsToFilterWeeks}/>
      <Card>
        <CardContent>
          <XDataGrid {...table}/>
        </CardContent>
      </Card>
      <Modal {...propsToModalSelectWeek}/>
    </>
  )
}

export default Content