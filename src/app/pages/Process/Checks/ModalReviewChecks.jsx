import React from 'react'
import { DialogActions, DialogContent, Button, Grid, TableContainer, Table, TableHead, TableRow, TableCell, Paper, Typography, TableBody, Divider } from '@mui/material'
import { ExitToApp } from '@mui/icons-material'
import { useState } from 'react';
import { useEffect } from 'react';
import { formatNumber } from 'app/utils/helpers';

export const ModalReviewChecks = ({setOpen, data, t}) => {
  const {dataChecksReview} = data;
  const [rowSuccess, setRowSuccess] = useState([]);
  const [rowError, setRowError] = useState([]);

  useEffect(()=>{
    if (dataChecksReview && dataChecksReview.length) {
      let arrayError = []
      let arratSuccess = []
      dataChecksReview.forEach((row) => {
        if (row['Error']) {
          arrayError.push(row.Error[0])
        } else {
          arratSuccess.push(row)
        }
      });
      setRowError(arrayError);
      setRowSuccess(arratSuccess);
    }
  }, []);

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <Typography variant={"h3"} mb={.25}>Log Checks Generated</Typography>
          <Typography variant={"h5"} mb={.50}>Successfully Generated Checks</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("table.common.name")}</TableCell>
                  <TableCell>{t("table.common.total")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowSuccess.length>0?rowSuccess.map(elem => {
                  return (
                    <TableRow>
                      <TableCell>{elem.EntityRef.name}</TableCell>
                      <TableCell style={{textAlign: 'right'}}>{`${elem.TotalAmt? formatNumber(elem.TotalAmt, '$. ', 2): '0.00'} ${elem.CurrencyRef.value}`}</TableCell>
                    </TableRow>
                  )
                }):
                  <TableRow>
                    <TableCell colSpan={2} style={{textAlign: 'center'}}>None</TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Divider sx={{mb:2, mt:3}}/>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <Typography variant={"h5"} mb={.50}>Checks Not Generated</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("table.common.name")}</TableCell>
                  <TableCell>{t("table.common.detail")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowError.length>0?rowError.map(elem => {
                  return (
                    <TableRow>
                      <TableCell>{elem.LineDetail.EntityRef.name}</TableCell>
                      <TableCell>{t(elem.Detail)}</TableCell>
                    </TableRow>
                  )
                }):
                  <TableRow>
                    <TableCell colSpan={2} style={{textAlign: 'center'}}>None</TableCell>
                  </TableRow>
                }
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
    </DialogActions>
  </>
  )
}