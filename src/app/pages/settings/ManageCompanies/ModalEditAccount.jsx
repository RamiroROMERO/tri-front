import React, { useEffect, useState } from 'react';
import Div from '@jumbo/shared/Div';
import { DialogActions, DialogContent, Button, Grid, Tabs, Tab, Icon } from '@mui/material';
import { CheckBox, InputBox, Modal, ModalConfirm, SimpleSelect, TabPanel } from 'app/components';
import { Add, Delete, Edit, ExitToApp, Save } from '@mui/icons-material';
import { request } from 'app/utils/core';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { XDataGrid } from 'app/components/XDataGrid';
import { validInt } from 'app/utils/helpers';
import { useModalNewAccount } from './useModalNewAccount';
import { ModalAddQbCompany } from './ModalAddQbCompany';

export const ModalEditAccount = ({setOpen, data, t}) => {
  const {companyId, setLoading, sweetAlerts, currentItem, fnGetData} = data;
  const [activeTab, setActiveTab] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [currentItemQb, setCurrentItemQb] = useState({});
  const [openModalAddQb, setOpenModalAddQb] = useState(false);
  const [openMsgDelete, setOpenMsgDelete] = useState(false);

  const {formState, formValidation, isFormValid, sendForm, listType, onInputChange, fnSaveDocto} = useModalNewAccount({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem, companyId});

  const {name, email, consumerKey, consumerSecret, type, status} = formState;

  const {nameValid, emailValid, consumerKeyValid, consumerSecretValid} = formValidation;

  const fnGetDataQbCompany = ()=>{
    setLoading(true);
    request.GET(`/qbCompanies?accountId=${currentItem.id}`, (resp)=>{
      const data= resp.QBCompanies.map((item)=>{
        item.statusIcon = item.status == 1 ? "check_box" : "check_box_outline_blank"
        return item;
      });
      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnEditDocto = (item)=>{
    setCurrentItemQb(item);
    setOpenModalAddQb(true);
  }

  const fnDeleteDocto = (item)=>{
    setCurrentItemQb(item);
    setOpenMsgDelete(true);
  }

  const fnOkDeleteQbCompany = ()=>{
    if(validInt(currentItem.id)<=0){
      return;
    }
    setLoading(true);
    request.DELETE(`/qbCompanies`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetDataQbCompany();
      setLoading(false);
    }, err=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    },{id: currentItemQb.id});
  }

  const fnNewDocto = ()=>{
    setCurrentItemQb({});
    setOpenModalAddQb(true);
  }

  const [table, setTable] = useState({
    title: t('table.manageCompanies.tabPanel.panel2'),
      columns: [
        {field: 'name', headerName: t('table.manageCompanies.qboCompanycolumn.name'), flex: 0.8},
        {field: 'realmId', headerName: t('table.manageCompanies.qboCompanycolumn.realmId'), flex: 1},
        {field: 'expireToken', headerName: t('table.manageCompanies.qboCompanycolumn.expire'), flex: 0.6},
        {field: 'statusIcon', headerName: t('table.common.status'), flex: 0.3,
          renderCell: ({row, field})=>{
            return (<Icon>{row[field]}</Icon>)
          }
        },
        {
          field: 'actions',
          type: 'actions',
          headerName: t("table.common.actions"),
          width: 100,
          getActions: ({ row }) => [
            <GridActionsCellItem
              icon={<Edit />}
              label={t("button.edit")}
              onClick={() => fnEditDocto(row)}
              color='info'
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label= {t("button.delete")}
              onClick={() => fnDeleteDocto(row)}
              color='error'
            />
          ],
        }
      ],
      data: [],
      freeActions: [{
        Icon: () => <Add />,
        label: t("datatable.buttons.newDocument"),
        onClick: fnNewDocto
      }],
      options: {
        pageSize: 10,
        rowsPerPageOptions: [10, 20, 30, 50]
      }
  });

  useEffect(()=>{
    fnGetDataQbCompany();
  },[]);

  useEffect(()=>{
    setTable({...table, data: tableData});
  },[tableData]);

  const propsToModalAddQbCompany = {
    title: 'table.manageCompanies.textField.companyTitle',
    DialogContent: ModalAddQbCompany,
    open: openModalAddQb,
    setOpen: setOpenModalAddQb,
    maxWidth: 'sm',
    data: {
      currentItemQb,
      accountId: currentItem.id,
      setLoading,
      sweetAlerts,
      fnGetDataQbCompany
    }
  };

  const propsToModalConfirm = {
    open: openMsgDelete,
    setOpen: setOpenMsgDelete,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOkDeleteQbCompany
  }

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <Div sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)}>
              <Tab label={t('table.manageCompanies.tabPanel.panel1')} />
              <Tab label={t('table.manageCompanies.tabPanel.panel2')} />
            </Tabs>
          </Div>
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3} direction={'row'}>
              <Grid item xs={12}>
                <InputBox
                  label={t('table.manageCompanies.textField.name')}
                  name='name'
                  value={name}
                  onChange={onInputChange}
                  error={(sendForm&&nameValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&nameValid}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBox
                  label={t('table.manageCompanies.textField.email')}
                  name='email'
                  value={email}
                  onChange={onInputChange}
                  error={(sendForm&&emailValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&emailValid}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBox
                  label={t('table.manageCompanies.column.consumerKey')}
                  name='consumerKey'
                  value={consumerKey}
                  onChange={onInputChange}
                  error={(sendForm&&consumerKeyValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&consumerKeyValid}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBox
                  label={t('table.manageCompanies.column.consumerSecret')}
                  name='consumerSecret'
                  value={consumerSecret}
                  onChange={onInputChange}
                  error={(sendForm&&consumerSecretValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&consumerSecretValid}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <SimpleSelect
                  label={t("table.categories.column.type")}
                  name="type"
                  value={type}
                  onChange={onInputChange}
                  optionList={listType}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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
            <Grid item xs={12}>
              <XDataGrid {...table}/>
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
      <Button startIcon={<Save />} onClick={fnSaveDocto} color='primary' variant='contained'>
        {t('button.save')}
      </Button>
    </DialogActions>
    <Modal {...propsToModalAddQbCompany}/>
    <ModalConfirm {...propsToModalConfirm}/>
  </>
  )
}