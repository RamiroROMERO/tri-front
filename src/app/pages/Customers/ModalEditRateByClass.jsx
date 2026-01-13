import React, { useEffect, useState } from 'react'
import { DialogActions, DialogContent, Button, Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { ContainerWithLabel, InputBox, SearchSelect } from 'app/components';
import { useForm } from 'app/hooks';
import { validFloat, validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';

export const ModalEditRateByClass = ({setOpen, data, t}) => {
  const {rowsSelected, customerId, setLoading, sweetAlerts, fnGetData} = data;
  const [sendForm, setSendForm] = useState(false);
  const [listClassifications, setListClassification] = useState([]);

  const formValidations = {
    classificationId: [(val) => validInt(val) !== 0, t("alertMessages.warning.classification")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: 0,
    classificationId: 0,
    ratePayroll: 0,
    rateOtPayroll: 0,
    rateInvoice: 0,
    rateOtInvoice: 0,
    percOtPayroll: 0,
    percOtInvoice: 0
  }, formValidations);

  const {classificationId, ratePayroll, rateOtPayroll, rateInvoice, rateOtInvoice, percOtPayroll, percOtInvoice} = formState;

  const {classificationIdValid} = formValidation;

  const onClassificationChange = e =>{
    const classification = e.target.value;

    if(classification===0) return;
    const filter = listClassifications.find(item => item.value === classification);

    onBulkForm({
      classificationId: classification,
      ratePayroll: validFloat(filter.ratePayroll),
      rateOtPayroll: validFloat(filter.rateOtPayroll),
      rateInvoice: validFloat(filter.rateInvoice),
      rateOtInvoice: validFloat(filter.rateOtInvoice),
      percOtPayroll: validFloat(filter.percOtPayroll),
      percOtInvoice: validFloat(filter.percOtInvoice)
    });
  }

  const fnSave = async()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    await rowsSelected.forEach(item => {
      const newData = {
        id: item.idRate,
        customerId,
        employeeId: item.id,
        rate: ratePayroll,
        rateOvertime: rateOtPayroll,
        rateInvoice: rateInvoice,
        rateInvoiceOvertime: rateOtInvoice,
        percOtPayroll,
        percOtInvoice,
        status: 1
      }

      setLoading(true);
      request.PUT('/employeeCustomers', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
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

      const newDataEmployee = {
        id: item.id,
        classificationId
      }

      setLoading(true);
      request.PUT('/employees', newDataEmployee, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
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
    });

    fnGetData();
    onResetForm();
    setSendForm(false);
    setOpen(false);
  };

  useEffect(()=>{
    setLoading(true);
    request.GET(`/customerClassifications?customerId=${customerId}`, (resp)=>{
      const classifications = resp.customersClassifications.map((item)=>{
        return {
          value: item.id,
          label: item.classification?.name || "",
          ratePayroll: item.ratePayroll,
          rateOtPayroll: item.rateOtPayroll,
          rateInvoice: item.rateInvoice,
          rateOtInvoice: item.rateOtInvoice,
          percOtPayroll: item.percOtPayroll,
          percOtInvoice: item.percOtInvoice
        }
      });
      setListClassification(classifications);
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
        <Grid item xs={12}>
          <SearchSelect
            label={t("table.employees.classificationId")}
            name="classificationId"
            value={classificationId}
            onChange={onClassificationChange}
            optionList={listClassifications}
            error={(sendForm&&classificationIdValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&classificationIdValid}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ContainerWithLabel label={t("dialog.classifications.title.payroll")}>
            <Grid container spacing={3} direction='row'>
              <Grid item xs={12} sm={6}>
                <InputBox
                  label={t('table.activeEmployees.column.rate')}
                  name='ratePayroll'
                  value={ratePayroll}
                  onChange={onInputChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputBox
                  label={t('table.payrolls.column.overtimeRate')}
                  name='rateOtPayroll'
                  value={rateOtPayroll}
                  onChange={onInputChange}
                  disabled
                />
              </Grid>
            </Grid>
          </ContainerWithLabel>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ContainerWithLabel label={t("dialog.classifications.title.invoice")}>
            <Grid container spacing={3} direction='row'>
              <Grid item xs={12} sm={6}>
                <InputBox
                  label={t('table.activeEmployees.column.rate')}
                  name='rateInvoice'
                  value={rateInvoice}
                  onChange={onInputChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputBox
                  label={t('table.payrolls.column.overtimeRate')}
                  name='rateOtInvoice'
                  value={rateOtInvoice}
                  onChange={onInputChange}
                  disabled
                />
              </Grid>
            </Grid>
          </ContainerWithLabel>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{width: '25px'}}>{t("table.common.num")}</TableCell>
                  <TableCell>{t("table.common.employee")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsSelected.map((elem, idx) => {
                  return (
                    <TableRow>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{elem.name}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
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