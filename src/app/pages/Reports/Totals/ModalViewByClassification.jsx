import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableFooter } from '@mui/material'
import { ExitToApp, PictureAsPdf } from '@mui/icons-material'
import { formatNumber } from 'app/utils/helpers';
import { useModalViewByClassification } from './useModalViewByClassification';

export const ModalViewByClassification = ({setOpen, data, t}) => {
  const {currentItem, paramsFilter, setLoading} = data;

  const {detailTable, totalData, fnExportPdf} = useModalViewByClassification({setLoading, paramsFilter, currentItem});

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={6}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.customer')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.customer.code} - ${currentItem.customer.name}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.select.selectWeekNoWeek')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${paramsFilter.noWeek} - ${paramsFilter.noYear}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{width: '12rem'}}>{t("table.totals.column.classification")}</TableCell>
                  <TableCell align="center">{t("table.totals.column.employeeCount")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.regularHours")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.overtimeHours")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.totalHours")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.regularPayment")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.overtimePayment")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.totalAdjustments")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.totalDeductions")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.totalPayment")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detailTable.map((row, index) => (
                  <TableRow key={`detail-for-project-${index}`}>
                    <TableCell component="th" scope="row">{row.classificationName}</TableCell>
                    <TableCell align="center">{formatNumber(row.employeeCount)}</TableCell>
                    <TableCell align="right">{formatNumber(row.hours)}</TableCell>
                    <TableCell align="right">{formatNumber(row.hoursOvertime)}</TableCell>
                    <TableCell align="right">{formatNumber(row.totalHours)}</TableCell>
                    <TableCell align="right">{formatNumber(row.payment)}</TableCell>
                    <TableCell align="right">{formatNumber(row.paymentOvertime)}</TableCell>
                    <TableCell align="right">{formatNumber(row.adjustmentsValue)}</TableCell>
                    <TableCell align="right">{formatNumber(row.deductionsValue)}</TableCell>
                    <TableCell align="right">{formatNumber(row.totalPayment)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell component="th" scope="row">{t("pages.Reports.Totals")}</TableCell>
                  <TableCell align="center">{formatNumber(totalData.totalEmp)}</TableCell>
                  <TableCell align="right">{formatNumber(totalData.regularHours)}</TableCell>
                  <TableCell align="right">{formatNumber(totalData.overtimeHours)}</TableCell>
                  <TableCell align="right">{formatNumber(totalData.totalHours)}</TableCell>
                  <TableCell align="right">{formatNumber(totalData.regularPayment)}</TableCell>
                  <TableCell align="right">{formatNumber(totalData.overtimePayment)}</TableCell>
                  <TableCell align="right">{formatNumber(totalData.totalAdjustments)}</TableCell>
                  <TableCell align="right">{formatNumber(totalData.totalDeductions)}</TableCell>
                  <TableCell align="right">{formatNumber(totalData.totalPayment)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
      <Button startIcon={<PictureAsPdf />} onClick={fnExportPdf} color='primary' variant='contained'>
        {t('action.print')}
      </Button>
    </DialogActions>
  </>
  )
}