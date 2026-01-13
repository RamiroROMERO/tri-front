import React, { useEffect } from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { useForm } from 'app/hooks';
import { CheckBox, InputBox } from 'app/components';
import { validFloat, validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const ModalEditRates = ({setOpen, data, t}) => {
  const {wpdId, fnGetInvoiceDetail, setLoading, sweetAlerts} = data;

  const {formState, onInputChange, onBulkForm} = useForm({
    invoiceRate: 0,
    percentOT: 0,
    invoiceRateOT: 0,
    idPayroll: 0,
    employeeName: '',
    classification: '',
    changeInProfile: false
  });

  const {invoiceRate, percentOT, invoiceRateOT, idPayroll, employeeName, classification, changeInProfile} = formState;

  const onChangePercentOT = e =>{
    const value = e.target.value;

    if(validFloat(value)>0){
      onBulkForm({
        percentOT: value,
        invoiceRateOT: validFloat(invoiceRate) + (validFloat(invoiceRate)*(validFloat(value)/100))
      });
    }else{
      onBulkForm({
        percentOT: value
      });
    }
  }

  const fnSave = ()=>{
    const newData = {
      id: idPayroll,
      rateInvoice: validFloat(invoiceRate),
      rateInvoiceOvertime: validFloat(invoiceRateOT),
      editRateInvoiceInProfile: changeInProfile
    };

    if(validInt(idPayroll)>0){
      request.PUT('/weeklyPayrollsDetails', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetInvoiceDetail();
        setOpen(false);
        setLoading(false);
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
  };

  useEffect(()=>{
    setLoading(true);
    request.GET(`/weeklyPayrollsDetails?id=${wpdId}`, (resp)=>{
      const data = resp.weeklyPayrollsDetails[0];
      if(data){
        onBulkForm({
          idPayroll: data.id,
          invoiceRate: data.rateInvoice,
          invoiceRateOT: data.rateInvoiceOvertime,
          employeeName: data.employee?.name || '',
          classification: data.employee?.classification?.name || ''
        });
      }
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  },[]);

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={8}>
          <InputBox
            label={t('table.invoiceDetail.textField.employeeName')}
            name='employeeName'
            value={employeeName}
            onChange={onInputChange}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputBox
            label={t('table.invoiceDetail.textField.classification')}
            name='classification'
            value={classification}
            onChange={onInputChange}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputBox
            label={t('table.invoiceDetail.textField.invoiceRate')}
            name='invoiceRate'
            value={invoiceRate}
            onChange={onInputChange}
            type='number'
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputBox
            label={t('table.activeEmployees.column.percentOT')}
            name='percentOT'
            value={percentOT}
            onChange={onChangePercentOT}
            type='number'
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputBox
            label={t('table.invoiceDetail.textField.invoiceRateOT')}
            name='invoiceRateOT'
            value={invoiceRateOT}
            onChange={onInputChange}
            type='number'
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CheckBox
            label={t("modal.invoice.iditInvoiceRate.changeInProfile")}
            name="changeInProfile"
            checked={changeInProfile}
            onChange={onInputChange}
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
      <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
        {t('button.save')}
      </Button>
    </DialogActions>
  </>
  )
}