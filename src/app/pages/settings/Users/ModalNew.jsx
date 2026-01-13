import React from 'react'
import { Button, Card, CardContent, DialogActions, DialogContent, Grid, Tab, Tabs } from '@mui/material'
import { AddOutlined, ExitToApp, Save } from '@mui/icons-material'
import { CheckBox, InputBox, ModalConfirm, SearchSelect, SimpleSelect, TabPanel } from 'app/components';
import { useModalNew } from './useModalNew';
import Div from '@jumbo/shared/Div';
import { XDataGrid } from 'app/components/XDataGrid';

const ModalNew = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, fnGetData, currentItem, listTypes} = data;

  const {formState, isFormValid, formValidation, sendForm, onInputChange, fnSave, activeTab, setActiveTab, titleMsgChangeStatus, table, customerId, listCustomersToShow, onCustomerChange, fnAddCustomer, propsToModalConfirm, disabledPanel2} = useModalNew({t, sweetAlerts, setLoading, fnGetData, currentItem, setOpen});

  const {name, userName, email, type, defaultCustomer, status} = formState;

  const {nameValid, userNameValid, typeValid} = formValidation;

  return (
    <>
      <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <Div sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)}>
              <Tab label={t('table.users.tabPanel.panel1')} />
              <Tab label={t('table.users.tabPanel.panel2')} disabled={disabledPanel2}/>
            </Tabs>
          </Div>
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3} direction='row'>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <InputBox
                  label={t('table.users.column.userName')}
                  name='userName'
                  value={userName}
                  onChange={onInputChange}
                  error={(sendForm&&userNameValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&userNameValid}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputBox
                  label={t('table.users.column.email')}
                  name='email'
                  value={email}
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SimpleSelect
                  label={t("table.users.column.type")}
                  name="type"
                  value={type}
                  onChange={onInputChange}
                  optionList={listTypes}
                  error={(sendForm&&typeValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&typeValid}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CheckBox
                  label={t("modal.input.checkbox.defaultCustomer")}
                  name="defaultCustomer"
                  checked={defaultCustomer}
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CheckBox
                  label={t("modal.input.checkbox.status")}
                  name="status"
                  checked={status}
                  onChange={onInputChange}
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3} direction={'row'}>
              <Grid item xs={12} sm={9}>
                <SearchSelect
                  label={t("table.common.customer")}
                  name="customerId"
                  value={customerId}
                  onChange={onCustomerChange}
                  optionList={listCustomersToShow}
                />
              </Grid>
              <Grid item xs={12} sm={3} textAlign={'right'}>
                <Button startIcon={<AddOutlined />} onClick={fnAddCustomer} color='primary' variant='contained'>
                  {t('button.add')}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <XDataGrid {...table}/>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
        </Button>
        <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained' disabled={activeTab===1?true:false}>
          {t("button.save")}
        </Button>
      </DialogActions>
      <ModalConfirm {...propsToModalConfirm}/>
    </>
  )
}

export default ModalNew