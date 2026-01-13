import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography, TableContainer, Table, Paper, TableHead, TableRow, TableCell, TableBody, TableFooter, CardContent, Card, Stack } from '@mui/material';
import { ExitToApp, ImportExport, PictureAsPdf } from '@mui/icons-material';
import { formatNumber, validFloat } from 'app/utils/helpers';
import { useModalViewByProject } from './useModalViewByProject';

export const ModalViewByProject = ({setOpen, data, t}) => {
  const {currentItem, paramsFilter, setLoading} = data;

  const {detailTable, totalDataProjects, fnExportPdf, fnExportXlsx} = useModalViewByProject({setLoading, paramsFilter, currentItem});

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
                  <TableCell style={{width: '12rem'}}>{t("table.totals.column.project")}</TableCell>
                  <TableCell align="center">{t("table.totals.column.employeeCount")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.regularHours")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.overtimeHours")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.totalHours")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.regularPayment")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.overtimePayment")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.totalAdjustments")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.totalDeductions")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.totalPayment")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.totalInvoice")}</TableCell>
                  <TableCell align="right">{t("table.totals.column.totalBalance")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detailTable.map((row, index) => (
                  <TableRow key={`detail-for-project-${index}`}>
                    <TableCell component="th" scope="row">
                      {row.projectName}
                    </TableCell>
                    <TableCell align="center">{formatNumber(row.employeeCount)}</TableCell>
                    <TableCell align="right">{formatNumber(row.hours)}</TableCell>
                    <TableCell align="right">{formatNumber(row.hoursOvertime)}</TableCell>
                    <TableCell align="right">{formatNumber(row.totalHours)}</TableCell>
                    <TableCell align="right">{formatNumber(row.payment)}</TableCell>
                    <TableCell align="right">{formatNumber(row.paymentOvertime)}</TableCell>
                    <TableCell align="right">{formatNumber(row.adjustmentsValue)}</TableCell>
                    <TableCell align="right">{formatNumber(row.deductionsValue)}</TableCell>
                    <TableCell align="right">{formatNumber(row.totalPayment)}</TableCell>
                    <TableCell align="right">{formatNumber(row.totalInvoice)}</TableCell>
                    <TableCell align="right">{formatNumber(row.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell component="th" scope="row">{t("pages.Reports.Totals")}</TableCell>
                  <TableCell align="center">{formatNumber(totalDataProjects.totalEmp)}</TableCell>
                  <TableCell align="right">{formatNumber(totalDataProjects.regularHours)}</TableCell>
                  <TableCell align="right">{formatNumber(totalDataProjects.overtimeHours)}</TableCell>
                  <TableCell align="right">{formatNumber(totalDataProjects.totalHours)}</TableCell>
                  <TableCell align="right">{formatNumber(totalDataProjects.regularPayment)}</TableCell>
                  <TableCell align="right">{formatNumber(totalDataProjects.overtimePayment)}</TableCell>
                  <TableCell align="right">{formatNumber(totalDataProjects.totalAdjustments)}</TableCell>
                  <TableCell align="right">{formatNumber(totalDataProjects.totalDeductions)}</TableCell>
                  <TableCell align="right">{formatNumber(totalDataProjects.totalPayment)}</TableCell>
                  <TableCell align="right">{formatNumber(totalDataProjects.totalInvoice)}</TableCell>
                  <TableCell align="right">{formatNumber(totalDataProjects.balance)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Grid container direction='row' spacing={3}>
        <Grid item xs={12} sm={8}>
          <Grid container direction='row'>
            <Grid item style={{marginRight:'20px'}}>
              <Typography variant='subtitle1'>{t("table.totals.column.totalPayment")}</Typography>
              <Typography variant='h4'> {formatNumber(totalDataProjects.totalPayment)}</Typography>    
            </Grid>
          <Grid item style={{marginRight:'20px'}}>
            <Typography variant='subtitle1'>{t("table.totals.column.totalInvoice")}</Typography>
            <Typography variant='h4'> {formatNumber(totalDataProjects.totalInvoice)}</Typography>    
          </Grid>
          <Grid item style={{marginRight:'20px'}}>
            <Typography variant='subtitle1'>{t("table.totals.column.totalBalance")}</Typography>
            <Typography variant='h4'> {formatNumber(totalDataProjects.balance)}</Typography>    
          </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Button style={{marginRight:'10px'}} startIcon={<PictureAsPdf />} onClick={fnExportPdf} color='primary' variant='contained'>
              {t('action.print')}
            </Button>
            <Button startIcon={<ImportExport />} onClick={fnExportXlsx} color='secondary' variant='contained'>
              {t('action.exportToExcel')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </DialogActions>
  </>
  )
}