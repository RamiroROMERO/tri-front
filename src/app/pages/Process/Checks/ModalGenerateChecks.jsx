import React, { useState } from 'react'
import { DialogActions, DialogContent, Button, Grid, Table, TableHead, TableRow, TableCell, TableBody, Icon, TableContainer, Paper, Divider, LinearProgress, Card, CardContent, CardHeader, Typography } from '@mui/material'
import { ExitToApp, LocalAtm } from '@mui/icons-material'
import { formatDateToShow, formatNumber, validFloat } from 'app/utils/helpers';
import { InputBox, Modal, SearchSelect } from 'app/components';
import { request } from 'app/utils/core';
import Div from '@jumbo/shared/Div/Div';
import { ModalReviewChecks } from './ModalReviewChecks';

export const ModalGenerateChecks = ({ setOpen, data, t }) => {
  const { rowsSelected, detailData, listBanks, quickBookCompany, endDate, setTableRowsSelected, sweetAlerts, controlAdmin, expenseSelected } = data;
  const [bankSelected, setBankSelected] = useState(0);
  const [percentBar, setPercentBar] = useState(0);
  const [dataChecksReview, setDataChecksReview] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [openChecksReview, setOpenChecksReview] = useState(false);
  const [noteInCheck, setNoteInCheck] = useState('FIRMAR ASISTENCIA CADA DÍA - EVITE FALTANTES');
  const checksData = [];

  const fnGenarateChecks = () => {
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setDisabledButton(true)
    rowsSelected.map((item2) => {
        detailData.map((item) => {
        if (item.employee.id == item2.id) {
          checksData.push(item);
        }
      })
    });
    fnGenerateChecksRecursive(0, [])
  }

  const fnGenerateChecksRecursive = (index, checks = []) => {
    let checksGenerated = []
    let percent = index/checksData.length * 100;

    if(bankSelected===0) {
      sweetAlerts('error', t("warning.bankSelected"));
      setDisabledButton(false);
      return;
    }

    const filterBanks = listBanks.find(item => item.value === bankSelected);

    setPercentBar(validFloat(percent));

    const newData = {
      checkData: checksData[index],
      dateEnd: formatDateToShow(endDate),
      dataQB: { idCompany: quickBookCompany, ExpenseRef: expenseSelected, AccountRef: {id: bankSelected, name: filterBanks.label}, noteInCheck }
    }

    request.POST(`/weeklyPayrollsDetails/generateChecks`, newData, (resp)=>{
      rowsSelected.map((item)=>{
        if(checksData[index].employee.id === item.id){
          item.iconStatus = 'check_circle'
          item.colorStatus = '#229954'
        }
      });

      index += 1
      checksGenerated = [...checks, ...resp.Checks];
      if (index < checksData.length) {
        fnGenerateChecksRecursive(index, checksGenerated)
      } else {
        setPercentBar(100);
        setDataChecksReview(checksGenerated);
        setOpenChecksReview(true);
        setDisabledButton(false);
        setTableRowsSelected([]);
      }
    }, (err)=>{
      console.warn(err);
      if (index < checksData.length) {
        setDisabledButton(false);
        rowsSelected.map((item)=>{
          if(checksData[index].employee.id === item.id){
            item.iconStatus = 'highlight_off'
            item.colorStatus = '#c0392b'
          }
        });
      }else{
        setTableRowsSelected([]);
      }
    });
  }

  const propsToModalReviewChecks = {
    title: 'dialog.checksReview.title',
    DialogContent: ModalReviewChecks,
    open: openChecksReview,
    setOpen: setOpenChecksReview,
    maxWidth: 'sm',
    data: {
      dataChecksReview
    }
  };

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table" size="small">
                <TableHead>
                  <TableRow>
                  <TableCell>No.</TableCell>
                    <TableCell>{t("table.dailiesPayrolls.column.employeeName")}</TableCell>
                    <TableCell>{t("table.employees.column.bankName")}</TableCell>
                    <TableCell>{t("dialog.generateChecks.checkValue")}</TableCell>
                    <TableCell>{t("table.common.employeeCIAAccount")}</TableCell>
                    <TableCell>{t("table.common.deliveryType")}</TableCell>
                    <TableCell>{t("table.common.project")}</TableCell>
                    <TableCell>{t("table.checks.status")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowsSelected.map((elem, idx) => {
                    return (
                      <TableRow>
                        <TableCell>{idx+1}</TableCell>
                        <TableCell>{elem.name}</TableCell>
                        <TableCell>{elem.bankName}</TableCell>
                        <TableCell>{formatNumber(elem.totalPayment, '$', 2)}</TableCell>
                        <TableCell>{elem.ciaAccount}</TableCell>
                        <TableCell>{elem.deliveryTypeName}</TableCell>
                        <TableCell>{elem.project}</TableCell>
                        <TableCell><Icon sx={{ color: elem.colorStatus }}>{elem.iconStatus}</Icon></TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Divider sx={{mt: 2, mb: 2}}/>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} md={6}>
            <SearchSelect
              label={t("table.checks.bankAccount")}
              name="bankSelected"
              value={bankSelected}
              onChange={(e)=>setBankSelected(e.target.value)}
              optionList={listBanks}
            />
          </Grid>
          <Grid item xs={12} md={6}>
          <InputBox
            label={t('table.checks.noteInCheck')}
            name='noteInCheck'
            value={noteInCheck}
            onChange={(e)=>setNoteInCheck(e.target.value)}
          />
          </Grid>

        </Grid>
        {/* <Grid container spacing={3} direction={'row'} style={{marginTop: '5px'}}>
          
        </Grid> */}
        <Grid container spacing={3} direction={'row'} sx={{mt: .5}}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={'Processing Checks...'}/>
              <CardContent sx={{pt: 0}}>
                <Div sx={{display: 'flex', alignItems: 'center'}}>
                  <Div sx={{width: '100%', mr: 1}}>
                    <LinearProgress variant="determinate" value={percentBar}/>
                  </Div>
                  <Div sx={{minWidth: 35}}>
                    <Typography variant="body2" color="text.primary">{`${percentBar}%`}</Typography>
                  </Div>
                </Div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<LocalAtm />} onClick={fnGenarateChecks} color='primary' variant='contained' disabled={disabledButton}>
          {t('button.generate')}
        </Button>
      </DialogActions>
      <Modal {...propsToModalReviewChecks}/>
    </>
  )
}