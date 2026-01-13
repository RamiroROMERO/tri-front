import React, { useEffect, useState } from 'react'
import { CheckBox, CheckBoxOutlineBlank, ExitToApp } from '@mui/icons-material'
import { Button, Card, CardContent, DialogActions, DialogContent, Divider, Grid, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Tabs, Typography } from '@mui/material'
import Div from '@jumbo/shared/Div/Div';
import { TabPanel } from 'app/components';
import { formatNumber, validFloat, validInt } from 'app/utils/helpers';
import moment from 'moment';

let totalHours = 0, totalOvertime = 0;

const ModalViewPayment = ({ setOpen, data, t }) => {
  const { currentItem } = data;
  const { projects } = currentItem;
  const [valueTabSelect, setValueTabSelect] = useState(0);

  const initFunction = () => {
    totalHours = 0, totalOvertime = 0;
    currentItem.dailies_payrolls.map((row) => {
      if (row.wpdId) {
        totalHours += validFloat(row.hours);
        totalOvertime += validFloat(row.hoursOvertime);
      }
    })

  }

  useEffect(() => {
    initFunction()
  }, [])


  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} sm={5}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.employee')}</Typography>
            <Typography variant={"h5"} mb={1.25}>{`${currentItem.employee.code} | ${currentItem.employeeName}`}</Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.select.selectWeek')}</Typography>
            <Typography variant={"h5"} mb={1.25}>{currentItem.customerWeek.label}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12}>
            <Div sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={valueTabSelect} onChange={(event, newValue) => setValueTabSelect(newValue)}>
                <Tab label={t('modal.payroll.detail.tab.employeeInfo')} />
                <Tab label={t('modal.payroll.detail.tab.payrollInfo')} />
                <Tab label={t('modal.payroll.detail.tab.deductions')} />
                <Tab label={t('modal.payroll.detail.tab.adjustments')} />
                <Tab label={t('modal.payroll.detail.tab.missingTimes')} />
                <Tab label={t('modal.payroll.detail.tab.perdiems')} />
                <Tab label={t('modal.payroll.detail.tab.weekHours')} />
              </Tabs>
            </Div>
            <TabPanel value={valueTabSelect} index={0}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12} sm={6} md={4} >
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.projects.column.customerName')}</Typography>
                  <Typography sx={{ borderWidth: 1, borderColor: 'grey' }} variant={"h5"}>{currentItem.customer.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.projects.column.name')}</Typography>
                  <Typography variant={"h5"}>{`${currentItem.project.code} | ${currentItem.project.name}`}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.employees.column.classificationName')}</Typography>
                  <Typography variant={"h5"}>{currentItem.classificationName}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.employees.column.bankName')}</Typography>
                  <Typography variant={"h5"}>{currentItem.employee?.bank?.name || ''}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.employees.column.accountBank')}</Typography>
                  <Typography variant={"h5"}>{currentItem.employee.accountBank}</Typography>
                </Grid>
                <Grid item xs={12} sm={3} md={2}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.employees.column.needCheck')}</Typography>
                  <Typography variant={"h5"}>{currentItem.employee.needCheck === false ? "No" : "Si"}</Typography>
                </Grid>
                <Grid item xs={12} sm={5} md={3}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.check.column.originalNameInCheck')}</Typography>
                  <Typography variant={"h5"}>{currentItem.employee.nameInCheck}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.noteBank')}</Typography>
                  <Typography variant={"h5"}>{currentItem.employee.noteBank}</Typography>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={valueTabSelect} index={1}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h5" component="h5"> {t('hours.register')} </Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table" size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">{t("table.loans.date")}</TableCell>
                          <TableCell align="center">{t("table.payrolls.column.totalHours")}</TableCell>
                          <TableCell align="center">{t("table.payrolls.column.overTimeHours2")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentItem.dailies_payrolls.map((row) => {
                          if (row.wpdId) {
                            // totalHours += validInt(row.hours);
                            // totalOvertime += validInt(row.hoursOvertime);
                            return (<TableRow hover key={row.id}>
                              <TableCell component="th" scope="row">
                                {moment(new Date(row.date + "T12:00:00Z")).format('MM/DD/YYYY')}
                              </TableCell>
                              <TableCell align="right">{row.hours}</TableCell>
                              <TableCell align="right">{row.hoursOvertime}</TableCell>
                            </TableRow>
                            )
                          }
                        })}
                        <TableRow>
                          <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                            {t("table.payrolls.column.totalHours")}
                          </TableCell>
                          <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            {totalHours}
                          </TableCell>
                          <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            {totalOvertime}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant='h5' component="h5">{t('hours.payroll.distribution')}</Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table" size="small">
                      <TableHead>
                        <TableRow hover>
                          <TableCell align="center">
                            {t("sidebar.menu.payrollLineTypes")}
                          </TableCell>
                          <TableCell align="center">
                            {t("table.adjustmentsForSalaryChange.column.totalHours")}
                          </TableCell>
                          <TableCell align="center">
                            {t("table.classifications.rateByHour")}
                          </TableCell>
                          <TableCell align="center">
                            {t("table.payrolls.column.overTimeHours2")}
                          </TableCell>
                          <TableCell align="center">
                            {t("table.payrollLineTypes.column.excedentPrice")}
                          </TableCell>
                          <TableCell align="center">
                            {t("table.adjustmentsForSalaryChange.column.total")}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentItem.weeklyPayrollsOvertimes.map(item => {
                          if (item.payroll_line_type.id !== 1) {
                            let regHours = validFloat(item.payroll_line_type.qtyMax) <= 0 ? validFloat(item.qty) : validFloat(item.payroll_line_type.qtyMax) < validFloat(item.qty) ? validFloat(item.payroll_line_type.qtyMax) : validFloat(item.qty);
                            let excedHours = validFloat(item.payroll_line_type.qtyMax) <= 0 ? 0 : validFloat(item.payroll_line_type.qtyMax) < validFloat(item.qty) ? validFloat(item.qty) - validFloat(item.payroll_line_type.qtyMax) : 0;
                            let excedPrice = item.qtyPrice * item.price;
                            let nTotal = (regHours * item.price * item.qtyPrice) + (excedHours * excedPrice);
                            return (<TableRow hover key={item.id}>
                              <TableCell style={nTotal > 0 ? { color: '#f39c12' } : {}} scope="row">{item.payroll_line_type.name}</TableCell>
                              <TableCell style={nTotal > 0 ? { color: '#f39c12' } : {}} align="right">{formatNumber(regHours)}</TableCell>
                              <TableCell style={nTotal > 0 ? { color: '#f39c12' } : {}} align="right">{formatNumber(item.qtyPrice * item.price)}</TableCell>
                              <TableCell style={nTotal > 0 ? { color: '#f39c12' } : {}} align="right">{formatNumber(excedHours)}</TableCell>
                              <TableCell style={nTotal > 0 ? { color: '#f39c12' } : {}} align="right">{formatNumber(excedPrice)}</TableCell>
                              <TableCell style={nTotal > 0 ? { color: '#f39c12' } : {}} align="right">{formatNumber(nTotal, '$.', 2)}</TableCell>
                            </TableRow>
                            )
                          } else {
                            let nTotal = (currentItem.regularHours * currentItem.rate * item.qtyPrice) + (currentItem.overTimeHours * currentItem.rateOvertime);
                            return (<TableRow hover key={item.id}>
                              <TableCell component="th" scope="row">{item.payroll_line_type.name}</TableCell>
                              <TableCell align="right">{formatNumber(currentItem.regularHours)}</TableCell>
                              <TableCell align="right">{formatNumber(currentItem.rate)}</TableCell>
                              <TableCell align="right">{formatNumber(currentItem.overTimeHours)}</TableCell>
                              <TableCell align="right">{formatNumber(currentItem.rateOvertime)}</TableCell>
                              <TableCell align="right">{formatNumber(nTotal, '$.', 2)}</TableCell>
                            </TableRow>
                            )
                          }
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Grid container spacing={3} direction="row" style={{ marginTop: '0px' }}>
                    <Grid item xs={12} sm={3}>
                      <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.payrolls.column.hours')}</Typography>
                      <Typography variant={"h5"}>{currentItem.totalHours}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.payForHours')}</Typography>
                      <Typography variant={"h5"}>{formatNumber((validFloat(currentItem.totalRegularHours) + validFloat(currentItem.totalOvertimeHours)), '$.', 2)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.qtyPerdiem')}</Typography>
                      <Typography variant={"h5"}>{currentItem.qtyPerdiem}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.totalPerdiem')}</Typography>
                      <Typography variant={"h5"}>{formatNumber(currentItem.totalPerDiem, '$. ', 2)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={valueTabSelect} index={2}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12} md={9}>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table" size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            {t("table.adjustments.column.deductionType")}
                          </TableCell>
                          <TableCell>
                            {t("table.loans.value")}
                          </TableCell>
                          <TableCell>
                            {t("table.loans.description")}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentItem.detaDeductions.length > 0 ?
                          currentItem.detaDeductions.map((row) => {
                            if (row.id) {
                              return (<TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                  {row.setDeductionType.name}
                                </TableCell>
                                <TableCell align="right">{formatNumber(row.value)}</TableCell>
                                <TableCell align="right">{row.description}</TableCell>
                              </TableRow>
                              )
                            }
                          }) :
                          <TableRow>
                            <TableCell component="th" scope="row">None</TableCell>
                            <TableCell align="right">0</TableCell>
                            <TableCell align="right">None</TableCell>
                          </TableRow>
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TableContainer component={Paper} style={{ marginTop: '5px' }}>
                    <Table aria-label="simple table" size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={2} align='center'> {t("dialog.loansDetail")} </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell> {t("table.loans.cuotes")} </TableCell>
                          <TableCell> {t("table.loans.valCuote")} </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentItem.detaLoans.length > 0 ?
                          currentItem.detaLoans.map((row) => {
                            if (row.id) {
                              return (<TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                  {row.noCuote + "/" + row.loan.noCuotes}
                                </TableCell>
                                <TableCell align="right">{formatNumber(row.valueCuote)}</TableCell>
                              </TableRow>
                              )
                            }
                          }) :
                          <TableRow>
                            <TableCell component="th" scope="row">None</TableCell>
                            <TableCell align="right">None</TableCell>
                          </TableRow>
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Grid container spacing={3} direction={'row'}>
                    <Grid item xs={12}>
                      <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.customerDeduction')}</Typography>
                      <Typography variant={"h5"}>{formatNumber(currentItem.customer.globalDeduction)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.adjustmentsForSalaryChange.column.total')}</Typography>
                      <Typography variant={"h5"}>{formatNumber(currentItem.totalDeductions + currentItem.totalLoans)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={valueTabSelect} index={3}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12} md={9}>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table" size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell> {t("table.adjustments.column.adjustmentType")} </TableCell>
                          <TableCell> {t("table.loans.value")} </TableCell>
                          <TableCell> {t("table.loans.description")} </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentItem.detaAdjustments.length > 0 ?
                          currentItem.detaAdjustments.map((row) => {
                            if (row.id) {
                              return (<TableRow hover key={row.id}>
                                <TableCell component="th" scope="row">
                                  {row.setDeductionType.name}
                                </TableCell>
                                <TableCell align="right">{formatNumber(row.value)}</TableCell>
                                <TableCell align="right">{row.description}</TableCell>
                              </TableRow>
                              )
                            }
                          }) :
                          <TableRow hover>
                            <TableCell component="th" scope="row">None</TableCell>
                            <TableCell align="right">0</TableCell>
                            <TableCell align="right">None</TableCell>
                          </TableRow>
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.adjustmentsForSalaryChange.column.total')}</Typography>
                  <Typography variant={"h5"}>{formatNumber(currentItem.totalAdjustments)}</Typography>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={valueTabSelect} index={4}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.qtyMissingTime')}</Typography>
                  <Typography variant={"h5"}>{currentItem.qtyMissingTime}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.valMissingTime')}</Typography>
                  <Typography variant={"h5"}>{formatNumber(currentItem.valMissingTime, '$.', 2)}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.qtyMissingOvertime')}</Typography>
                  <Typography variant={"h5"}>{currentItem.qtyMissingOvertime}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.valMissingOvertime')}</Typography>
                  <Typography variant={"h5"}>{formatNumber(currentItem.valMissingOvertime, '$.', 2)}</Typography>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={valueTabSelect} index={5}>
              <Grid container spacing={3} direction='row'>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table" size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell> {t("modal.payroll.detail.tablePerdiem.project")} </TableCell>
                          <TableCell> {t("modal.payroll.detail.tablePerdiem.qtyDays")} </TableCell>
                          <TableCell> {t("modal.payroll.detail.tablePerdiem.qtyPerdiem")} </TableCell>
                          <TableCell> {t("modal.payroll.detail.tablePerdiem.value")} </TableCell>
                          <TableCell> {t("modal.payroll.detail.tablePerdiem.fixed")} </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentItem.arrPerdiem.length > 0 ?
                          currentItem.arrPerdiem.map((row) => {
                            if (row.id) {
                              return (<TableRow hover key={row.id}>
                                <TableCell component="th" scope="row">
                                  {row.project}
                                </TableCell>
                                <TableCell align="center">{formatNumber(row.totalDays)}</TableCell>
                                <TableCell align="center">{formatNumber(row.payrollQtyPerdiem)}</TableCell>
                                <TableCell align="right">{formatNumber(row.payrollPerdiem, '$.', 2)}</TableCell>
                                <TableCell align="center">{row.payrollFixedPerdiem ? <CheckBox /> : <CheckBoxOutlineBlank />}</TableCell>
                              </TableRow>
                              )
                            }
                          }) :
                          <TableRow hover>
                            <TableCell component="th" scope="row"> - </TableCell>
                            <TableCell align="right"> - </TableCell>
                            <TableCell align="right"> - </TableCell>
                            <TableCell align="right"> - </TableCell>
                            <TableCell align="right"> - </TableCell>
                          </TableRow>
                        }
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell component="tf">Total</TableCell>
                          <TableCell component="tf"></TableCell>
                          <TableCell component="tf"></TableCell>
                          <TableCell component="tf" align='right'>{formatNumber(currentItem.totalPerdiem, '$.', 2)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={valueTabSelect} index={6}>
              <Grid container spacing={3} direction='row'>
                <Grid item xs={12}>
                  {projects.map(project => {
                    return <Card>
                      <CardContent>
                        <Typography variant='h5' component='h5'>{`Project: ${project.code} - ${project.name}`}</Typography>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Date</TableCell>
                              {project.dailyPayroll.map(dp => {
                                return <TableCell>{dp.date}</TableCell>
                              })}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Regular Hours</TableCell>
                              {project.dailyPayroll.map(dp => {
                                return <TableCell>{dp.hours}</TableCell>
                              })}
                            </TableRow>
                            <TableRow>
                              <TableCell>Overtime Hours</TableCell>
                              {project.dailyPayroll.map(dp => {
                                return <TableCell>{dp.hoursOvertime}</TableCell>
                              })}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  })}
                </Grid>
              </Grid>
            </TabPanel>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={3} direction={'row'} justifyContent="flex-end" style={{ marginTop: "0px" }}>
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.totalCost')}</Typography>
            <Typography variant={"h5"}>{formatNumber(validFloat(currentItem.totalOvertimeHours) + validFloat(currentItem.totalRegularHours) + validFloat(currentItem.totalPerDiem), '$. ', 2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.totalDeduction')}</Typography>
            <Typography variant={"h5"}>{formatNumber(currentItem.totalDeductions + currentItem.totalLoans, '$.', 2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.totalAdjustments')}</Typography>
            <Typography variant={"h5"}>{formatNumber(currentItem.totalAdjustments, '$.', 2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.totalMissingTime')}</Typography>
            <Typography variant={"h5"}>{formatNumber(validFloat(currentItem.valMissingTime) + validFloat(currentItem.valMissingOvertime), '$.', 2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('modal.payroll.detail.totalPay')}</Typography>
            <Typography style={{ fontWeight: 'bold' }} variant={"h5"}>{formatNumber(currentItem.totalPayment, '$.', 2)}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
      </DialogActions>
    </>
  )
}

export default ModalViewPayment