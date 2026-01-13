import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent } from '@mui/material'
import { Clear, ExitToApp, Save } from '@mui/icons-material'
import { InputBox } from 'app/components/InputBox';
import { useModalProjects } from './useModalProjects';
import { SimpleSelect } from 'app/components/SimpleSelect';
import { XDataGrid } from 'app/components/XDataGrid';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { ContainerWithLabel } from 'app/components/ContainerWithLabel';

export const ModalProjects = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, currentItem, listStatus} = data;
  const customerName = currentItem.name?currentItem.name:'';
  const customerId = currentItem?.id || 0;

  const {table, formState, formValidation, isFormValid, sendForm, openMsgDelete, setOpenMsgDelete, onInputChange, fnSaveDocto, fnNewDocto, fnOkDelete} = useModalProjects({t, sweetAlerts, setLoading, customerId});

  const {ocCode, ocCurrent, code, name, description, location, status} = formState;

  const {codeValid, nameValid, ocCodeValid} = formValidation;

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDelete
  }

  return (
  <>
    <DialogContent dividers>
      <Card sx={{mb: 2}}>
        <CardContent>
          <Grid container spacing={3} direction={'row'}>
            <Grid item xs={12} sm={6} lg={4}>
              <InputBox
                label={t('table.common.customer')}
                name='customerName'
                value={customerName}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <InputBox
                label={t('table.projects.column.code')}
                name='code'
                value={code}
                onChange={onInputChange}
                error={(sendForm&&codeValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&codeValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={5}>
              <InputBox
                label={t('table.common.name')}
                name='name'
                value={name}
                onChange={onInputChange}
                error={(sendForm&&nameValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&nameValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={7}>
              <InputBox
                label={t("table.projects.column.location")}
                name="location"
                value={location}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={5}>
              <SimpleSelect
                label={t("table.employees.column.status")}
                name="status"
                value={status}
                onChange={onInputChange}
                optionList={listStatus}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBox
                label={t('table.deductions.column.description')}
                name='description'
                value={description}
                onChange={onInputChange}
                multiline
                maxRows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ContainerWithLabel label={t("dialog.projects.title.currentOrder")}>
                <Grid container spacing={3} direction={'row'}>
                  <Grid item xs={12} sm={6} lg={6}>
                    <InputBox
                      label={t('table.projects.column.ocCode')}
                      name='ocCode'
                      value={ocCode}
                      onChange={onInputChange}
                      error={(sendForm&&ocCodeValid)?true:false}
                      helperText={(sendForm &&!isFormValid)&&ocCodeValid}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <InputBox
                      label={t('table.projects.column.ocCurrent')}
                      name='ocCurrent'
                      value={ocCurrent}
                      onChange={onInputChange}
                      disabled
                    />
                  </Grid>
                </Grid>
              </ContainerWithLabel>
            </Grid>
            <Grid item xs={12} md={6} textAlign={'right'}>
              <Button sx={{marginRight: '10px'}} startIcon={<Clear />} onClick={fnNewDocto} color='secondary' variant='contained'>
                {t("button.clear")}
              </Button>
              <Button startIcon={<Save />} onClick={fnSaveDocto} color='primary' variant='contained'>
                {t("button.save")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container spacing={3} direction={'row'}>
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