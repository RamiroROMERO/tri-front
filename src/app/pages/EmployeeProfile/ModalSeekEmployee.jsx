import React from 'react'
import { DialogContent } from '@mui/material'
import { useFormEmployee } from './useFormEmployee';
import FormEmployee from './FormEmployee';

export const ModalSeekEmployee = ({setOpen, data, t}) => {

  const { setLoading, sweetAlerts, employeeId, currentItem, fnGetEmployeeList, listBanks, listCiaAccount, listClassification, listCustomer, listSector, listStatus } = data;

  const {formState, onInputChange, onBulkForm, isFormValid, formValidation, sendForm, activeStep, steps, handleBack, handleNext} = useFormEmployee({t, setLoading, sweetAlerts, employeeId, currentItem, fnGetEmployeeList, setOpen});

  const propsToFormEmployee = {
    t,
    formState,
    onInputChange,
    onBulkForm,
    isFormValid,
    formValidation,
    sendForm,
    activeStep,
    steps,
    listBanks,
    listCiaAccount,
    listClassification,
    listCustomer,
    listSector,
    listStatus,
    handleNext,
    handleBack
  }

  return (
    <>
    <DialogContent dividers>
      <FormEmployee {...propsToFormEmployee}/>
    </DialogContent>
  </>
  )
}
