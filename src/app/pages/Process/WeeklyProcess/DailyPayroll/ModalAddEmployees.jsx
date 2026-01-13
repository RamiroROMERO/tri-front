import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent } from '@mui/material'
import { AddOutlined, ExitToApp } from '@mui/icons-material'
import { XDataGrid } from 'app/components/XDataGrid';
import { ModalConfirm, SearchSelect } from 'app/components';
import { useModalAddEmployees } from './useModalAddEmployees';

export const ModalAddEmployees = ({setOpen, data, t}) => {
  const {projectId, customerId, setLoading, sweetAlerts, fnGetPayroll} = data;

  const {titleMsgChangeStatus, table, formState, formValidation, isFormValid, sendForm, listEmployeesToShow, openMsgChangeStatus, setOpenMsgChangeStatus, onInputChange, fnAddEmployee, fnOkChangeStatus } = useModalAddEmployees({t, projectId, customerId, setLoading, sweetAlerts, fnGetPayroll, setOpen});

  const {employeeId} = formState;

  const {employeeIdValid} = formValidation;

  const propsToModalConfirm = {
    open: openMsgChangeStatus,
    setOpen: setOpenMsgChangeStatus,
    message: titleMsgChangeStatus,
    onSuccess: fnOkChangeStatus
  }

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12} sm={9}>
                  <SearchSelect
                    label={t("table.common.employee")}
                    name="employeeId"
                    value={employeeId}
                    onChange={onInputChange}
                    optionList={listEmployeesToShow}
                    error={(sendForm&&employeeIdValid)?true:false}
                    helperText={(sendForm &&!isFormValid)&&employeeIdValid}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={3} textAlign={'right'}>
                  <Button startIcon={<AddOutlined />} onClick={fnAddEmployee} color='primary' variant='contained'>
                    {t('button.add')}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <XDataGrid {...table}/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
    </DialogActions>
    <ModalConfirm {...propsToModalConfirm}/>
  </>
  )
}