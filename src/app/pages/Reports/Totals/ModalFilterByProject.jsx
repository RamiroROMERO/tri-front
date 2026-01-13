import React from 'react'
import { DialogActions, DialogContent, Button, Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@mui/material'
import { ExitToApp, ImportExport, Search } from '@mui/icons-material'
import { SearchSelect, SimpleSelect } from 'app/components';
import { formatNumber } from 'app/utils/helpers';
import { useModalFilterByProject } from './useModalFilterByProject';

export const ModalFilterByProject = ({ setOpen, data, t }) => {
  const { setLoading, sweetAlerts, listYears, listCustomers, listProjects } = data;

  const { formState, formValidation, isFormValid, sendForm, projectsFilter, detailTable, totalDataProjects, onInputChange, onCustomerChange, fnExportToXLSX, fnGetData } = useModalFilterByProject({ setLoading, listProjects, listCustomers, t, sweetAlerts });

  const { noYear, customerId, projectId } = formState;

  const { noYearValid, customerIdValid, projectIdValid } = formValidation;

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} sm={3} lg={2}>
            <SimpleSelect
              label={t("table.common.year")}
              name="noYear"
              value={noYear}
              onChange={onInputChange}
              optionList={listYears}
              error={(sendForm && noYearValid) ? true : false}
              helperText={(sendForm && !isFormValid) && noYearValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={9} lg={4}>
            <SearchSelect
              label={t("table.employees.customerId")}
              name="customerId"
              value={customerId}
              onChange={onCustomerChange}
              optionList={listCustomers}
              error={(sendForm && customerIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && customerIdValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={9} lg={4}>
            <SearchSelect
              label={t("table.common.projects")}
              name="projectId"
              value={projectId}
              onChange={onInputChange}
              optionList={projectsFilter}
              error={(sendForm && projectIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && projectIdValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3} lg={2} textAlign={'right'}>
            <Button startIcon={<Search />} onClick={fnGetData} color='primary' variant='contained'>
              {t('button.search')}
            </Button>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table" size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '6rem' }}>{t("table.totals.column.week")}</TableCell>
                    <TableCell align="center">{t("table.totals.column.employeeCount")}</TableCell>
                    <TableCell align="right">{t("table.totals.column.regularHours")}</TableCell>
                    <TableCell align="right">{t("table.totals.column.overtimeHours")}</TableCell>
                    <TableCell align="right">{t("table.totals.column.totalHours")}</TableCell>
                    <TableCell align="right">{t("table.totals.column.regularPayment")}</TableCell>
                    <TableCell align="right">{t("table.totals.column.overtimePayment")}</TableCell>
                    <TableCell align="right">{t("table.totals.column.payrollPerdiem")}</TableCell>
                    <TableCell align="right">{t("table.totals.column.totalPayment")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detailTable.map((row, index) => (
                    <TableRow key={`detail-for-project-${index}`}>
                      <TableCell component="th" scope="row">
                        {row.numberWeek}
                      </TableCell>
                      <TableCell align="center">{formatNumber(row.employeeCount)}</TableCell>
                      <TableCell align="right">{formatNumber(row.hours)}</TableCell>
                      <TableCell align="right">{formatNumber(row.hoursOvertime)}</TableCell>
                      <TableCell align="right">{formatNumber(row.totalHours)}</TableCell>
                      <TableCell align="right">{formatNumber(row.payment)}</TableCell>
                      <TableCell align="right">{formatNumber(row.paymentOvertime)}</TableCell>
                      <TableCell align="right">{formatNumber(row.payrollPerdiem)}</TableCell>
                      <TableCell align="right">{formatNumber(row.totalPayment)}</TableCell>
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
                    <TableCell align="right">{formatNumber(totalDataProjects.payrollPerdiem)}</TableCell>
                    <TableCell align="right">{formatNumber(totalDataProjects.totalPayment)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<ImportExport />} onClick={fnExportToXLSX} color='primary' variant='contained'>
          {t('action.exportToExcel')}
        </Button>
      </DialogActions>
    </>
  )
}