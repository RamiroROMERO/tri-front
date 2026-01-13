import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography, Card, CardContent } from '@mui/material'
import { Autorenew, ExitToApp, Refresh } from '@mui/icons-material'
import { InputBox } from 'app/components';
import { XDataGrid } from 'app/components/XDataGrid';
import { useModalDetail } from './useModalDetail';

export const ModalDetail = ({setOpen, data, t}) => {
  const {currentItem, setLoading, typeDetail, sweetAlerts, fnGetData, controlAdmin} = data;

  const {table, formState, formValidation, isFormValid, sendForm, buttonActive, buttonRegActive, onInputChange, onValCuoteChange, fnGenerate, fnRegenerate} = useModalDetail({t, currentItem, setLoading, sweetAlerts, fnGetData, controlAdmin});

  const {value, valCuote, noCuotes} = formState;

  const {valueValid, valCuoteValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.date')}</Typography>
          <Typography variant={"h5"} mb={2}>{currentItem?.date || ''}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.employee')}</Typography>
          <Typography variant={"h5"} mb={2}>{currentItem?.employeeName || ''}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={6} md={4}>
          <InputBox
            label={t("table.loans.value")}
            name="value"
            value={value}
            onChange={onInputChange}
            error={(sendForm&&valueValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&valueValid}
            type='number'
            required
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputBox
            label={t("table.loans.valCuote")}
            name="valCuote"
            value={valCuote}
            onChange={onValCuoteChange}
            error={(sendForm&&valCuoteValid)?true:false}
            helperText={(sendForm &&!isFormValid)&&valCuoteValid}
            type='number'
            required
            disabled={typeDetail===1?true:false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputBox
            label={t("table.loans.cuotes")}
            name="noCuotes"
            value={noCuotes}
            onChange={onInputChange}
            type='number'
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.description')}</Typography>
          <Typography variant={"h5"} >{currentItem?.description || ''}</Typography>
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
      <Button startIcon={<Refresh />} onClick={fnGenerate} color='primary' variant='contained' disabled={buttonActive} style={{display: typeDetail===1?'flex':'none'}}>
        {t('button.generate')}
      </Button>
      <Button startIcon={<Autorenew />} onClick={fnRegenerate} color='primary' variant='contained' disabled={buttonRegActive} style={{display: typeDetail===2?'flex': 'none'}}>
        {t('button.reGenerate')}
      </Button>
    </DialogActions>
  </>
  )
}