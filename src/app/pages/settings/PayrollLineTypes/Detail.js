import React from 'react'
import { DialogActions, Grid, Button, DialogContent } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from 'app/hooks';
import { InputBox } from 'app/components';
import { useEffect } from 'react';
import { useState } from 'react';
import { validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const Detail = props => {

  const {setOpen, data, t} = props;
  const {rowSelected, onRefreshTable, setLoading, sweetAlerts} = data;
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    name: [(val)=>val.length>5, t('payrollLineTypes.validation.name')],
    qtyPrice: [(val)=>validInt(val)>=0, t('payrollLineTypes.validation.qtyPrice')],
    qtyMax: [(val)=>validInt(val)>=0, t('payrollLineTypes.validation.qtyMax')],
    excedentPrice: [(val)=>validInt(val)>=0, t('payrollLineTypes.validation.exedentPrice')],
  };

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm} = useForm({
    id:0,
    name:'',
    description: '',
    qtyPrice: 0,
    qtyMax:0,
    excedentPrice:0
  }, formValidations);

  const {id, name, description, qtyPrice, qtyMax, excedentPrice} = formState;
  const {nameValid, qtyPriceValid, qtyMaxValid, excedentPriceValid} = formValidation;

  const fnSave = ()=>{

    setSendForm(true);
    if(!isFormValid){
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/payrollLineTypes', formState, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        onRefreshTable();
        setSendForm(false);
        setLoading(false);
        setOpen(false);
      }, err=>{
        const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      })
    }else{
      request.PUT('/payrollLineTypes', formState, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        onRefreshTable();
        setSendForm(false);
        setLoading(false);
        setOpen(false);
      }, err=>{
        const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      });
    }

  }

  useEffect(()=>{
    if(rowSelected.id){
      onBulkForm(rowSelected);
    }
  }, []);

  return (
    <>
    <DialogContent dividers>
      <Grid container spacing={3} direction='row'>
        <Grid item xs={12}>
          <InputBox
            label={t('table.payrollLineTypes.column.name')}
            name='name'
            value={name}
            onChange={onInputChange}
            error={(sendForm&&nameValid)?true:false}
            helperText = {(sendForm &&!isFormValid)&&nameValid}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <InputBox
            label={t('table.payrollLineTypes.column.description')}
            name='description'
            value={description}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputBox
            label={t('table.payrollLineTypes.column.qtyPrice')}
            name='qtyPrice'
            value={qtyPrice}
            onChange={onInputChange}
            error={(sendForm&&qtyPriceValid)?true:false}
            helperText = {(sendForm &&!isFormValid)&&qtyPriceValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputBox
            label={t('table.payrollLineTypes.column.qtyMax')}
            name='qtyMax'
            value={qtyMax}
            onChange={onInputChange}
            error={(sendForm&&qtyMaxValid)?true:false}
            helperText = {(sendForm &&!isFormValid)&&qtyMaxValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputBox
            label={t('table.payrollLineTypes.column.excedentPrice')}
            name='excedentPrice'
            value={excedentPrice}
            onChange={onInputChange}
            error={(sendForm&&excedentPriceValid)?true:false}
            helperText = {(sendForm &&!isFormValid)&&excedentPriceValid}
            required
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToAppIcon />} onClick={()=>setOpen(false)}  color='secondary' variant='contained'>
      {t('button.exit')}
      </Button>
      <Button startIcon={<SaveIcon />} onClick={fnSave} color='primary' variant='contained' >{t("button.save")}</Button>
    </DialogActions>
    </>
  )
}
