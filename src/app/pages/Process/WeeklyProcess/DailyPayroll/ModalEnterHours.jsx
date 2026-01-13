import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography, Tabs, Tab, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, TextField, Table, Divider } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { CheckBox, ContainerWithLabel, InputBox, TabPanel } from 'app/components';
import { formatNumber, roundTwoDecimals, validFloat } from 'app/utils/helpers';
import Div from '@jumbo/shared/Div/Div';
import { useModalEnterHours } from './useModalEnterHours';

export const ModalEnterHours = ({ setOpen, data, t }) => {
  const { currentItem, valueTabSelect, setValueTabSelect, payrollLineTypes, customerData, sweetAlerts, listDates, setLoading, fnUpdateDataToUpdate, fnSaveAll, fnGetPayroll } = data;
  const classification = currentItem.employee?.classification?.name || '';

  const { hoursOTLine, lineTypes, qtyPerdiem, totalPayrollPerdiem, payment, hoursWorked, hoursWorkedOvertime, totalHoursRegular, totalHoursOvertime, totalHours, totalHoursRegister, globalTotalRegularHours, globalTotalOvertimeHours, globalTotalHours, hoursDistribution, payrollRate, payrollRateOvertime, payNotes, fixedPerdiem, handPerdiem, valuePerdiem, noPayment, changePayrollInProfile, invoiceRate, invoiceRateOvertime, fixedPerdiemInvoice, handPerdiemInvoice, qtyPerdiemInvoice, invoicePerdiem, totalInvoicePerdiem, changeInvoiceInProfile, tableData, onChangeValueOtherHours, onChangeQtyPerdiem, onChangeValueHours, onChangeValueOvertimeHours, onChangeValuePerdiem, onInputChange, onChangeQtyPerdiemInvoice, onUpdateValuePerdiem, fnChangeDataPayment, fnSavePayrollValues, fnSaveInvoiceValues, fnSaveChanges, disabledBtnSave } = useModalEnterHours({ sweetAlerts, t, payrollLineTypes, currentItem, customerData, listDates, setLoading, fnUpdateDataToUpdate, fnSaveAll, setOpen, fnGetPayroll });

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} sm={5}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.employee')}</Typography>
            <Typography variant={"h5"} mb={1.25}>{`${currentItem.employeeName} | ${classification}`}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12}>
            <Div sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={valueTabSelect} onChange={(event, newValue) => setValueTabSelect(newValue)}>
                <Tab label={t('action.enterHours')} />
                <Tab label={t('modal.payroll.detail.tab.weekHours')} />
                <Tab label={t('modal.payroll.detail.tab.payrollSettings')} />
                <Tab label={t('modal.payroll.detail.tab.invoiceSettings')} />
              </Tabs>
            </Div>
            <TabPanel value={valueTabSelect} index={0}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12} md={5}>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table" size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: '65%' }}  >{t("table.deductions.column.description")}</TableCell>
                          <TableCell align="center"> {t("modal.payroll.detail.tab.qtyDays")} </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          (lineTypes || [{}]).map((item, idx) => {
                            if (item.id !== 1) {
                              return (
                                <TableRow key={idx}>
                                  <TableCell>
                                    {item.name}
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      variant='standard'
                                      value={item.qty}
                                      onChange={onChangeValueOtherHours}
                                      name={"otherHours-" + item.id}
                                      id={"otherHours-" + item.id}
                                      onClick={(e) => {
                                        e.target.selectionStart = 0
                                      }}
                                      InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                                    />
                                  </TableCell>
                                </TableRow>
                              )
                            }
                          })
                        }
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold', fontSize: 15 }}>
                            {t("table.adjustmentsForSalaryChange.column.total")}
                          </TableCell>
                          <TableCell style={{ fontWeight: 'bold', fontSize: 15 }}>
                            {validFloat(hoursOTLine)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Grid container spacing={3} direction={'row'} sx={{ mt: -.5 }}>
                    <Grid item xs={12} sm={6}>
                      <InputBox
                        label={t('modal.payroll.detail.qtyPerdiem')}
                        name='qtyPerdiem'
                        value={qtyPerdiem}
                        onChange={onChangeQtyPerdiem}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputBox
                        label={t('modal.payroll.detail.valuePerdiem')}
                        name='totalPayrollPerdiem'
                        value={totalPayrollPerdiem}
                        disabled
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} direction={'row'} sx={{ mt: -.5 }}>
                    <Grid item xs={12} sm={6}>
                      <InputBox
                        label={t('modal.payroll.detail.totalPay')}
                        name='payment'
                        value={formatNumber(payment)}
                        disabled
                        inputProps={{ style: { fontSize: 16, fontWeight: '600' } }}
                        InputLabelProps={{ style: { fontSize: 16, fontWeight: '600' } }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={5}>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table" size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: '30%' }}>{t("table.dailiesPayrolls.date")}</TableCell>
                          <TableCell style={{ width: '10%' }}>{t("table.dailiesPayrolls.column.day")}</TableCell>
                          <TableCell style={{ minWidth: '30%' }} align="center"> {t("modal.payroll.detail.tab.qtyDays")}</TableCell>
                          <TableCell style={{ minWidth: '30%' }} align="center"> {t("modal.payroll.detail.tab.qtyExtraDays")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          tableData.map((item, idx) => {
                            if (item.date !== "") {
                              return (
                                <TableRow key={idx}>
                                  <TableCell component="th" scope="row">{item.date}</TableCell>
                                  <TableCell component="th" scope="row">{item.dateStr}</TableCell>
                                  <TableCell>
                                    <TextField
                                      variant='standard'
                                      value={item.hours}
                                      onChange={onChangeValueHours}
                                      name={`hoursDay${idx}`}
                                      id={`day-${idx}`}
                                      onClick={(e) => {
                                        e.target.selectionStart = 0
                                      }}
                                      InputProps={{ inputProps: { min: 0, max: 24, step: 0.1 } }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      variant='standard'
                                      value={item.hoursOvertime}
                                      onChange={onChangeValueOvertimeHours}
                                      name={`hoursExtraDay${idx}`}
                                      id={`dayExtra-${idx}`}
                                      onClick={(e) => {
                                        e.target.selectionStart = 0
                                      }}
                                      InputProps={{ inputProps: { min: 0, max: 24, step: 0.1 } }}
                                    />
                                  </TableCell>
                                </TableRow>
                              )
                            }
                          })
                        }
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold', fontSize: 15 }} colSpan={2}>
                            {t("table.adjustmentsForSalaryChange.column.total")}
                          </TableCell>
                          <TableCell style={{ fontWeight: 'bold', fontSize: 15 }}>
                            {validFloat(hoursWorked)}
                          </TableCell>
                          <TableCell style={{ fontWeight: 'bold', fontSize: 15 }}>
                            {validFloat(hoursWorkedOvertime)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Grid container spacing={3} direction={'row'}>
                    <Grid item xs={12}>
                      <InputBox
                        label={t('table.common.regularHours')}
                        name='totalHoursRegular'
                        value={roundTwoDecimals(totalHoursRegular)}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputBox
                        label={t('table.common.overtimeHours')}
                        name='totalHoursOvertime'
                        value={roundTwoDecimals(totalHoursOvertime)}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputBox
                        label={t('modal.payroll.detail.tab.totalHours')}
                        name='totalHours'
                        value={roundTwoDecimals(totalHours)}
                        disabled
                        inputProps={{ style: { fontSize: 16, fontWeight: '600' } }}
                        InputLabelProps={{ style: { fontSize: 16, fontWeight: '600' } }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={valueTabSelect} index={1}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table" size="small">
                      <TableHead>
                        <TableRow key='TableHeader'>
                          <TableCell>{t("table.dailiesPayrolls.modalEnterHours.tab2.projectName")}</TableCell>
                          <TableCell>{t("table.dailiesPayrolls.modalEnterHours.tab2.hoursType")}</TableCell>
                          {
                            tableData.map((elem, idx) => {
                              if (elem.date !== "") {
                                return (
                                  <TableCell key={`Hed-${idx}`} align='center' style={{padding: '5px'}}> {`${elem.date} ${elem.dateStr}`} </TableCell>
                                )
                              }
                            })
                          }
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {totalHoursRegister.map((elem, idx) => {
                          return (
                            <>
                              <TableRow key={idx}>
                                <TableCell rowSpan={2}>{elem.project.code}</TableCell>
                                <TableCell>Regular</TableCell>
                                {
                                  elem.dailies_payrolls.map((item, idx2) => {
                                    return (
                                      <TableCell key={`RegH-${idx2}`} className={validFloat(item.hours) <= 0 ? 'col-table-with-zero' : ''} align='right'>{formatNumber(item.hours)}</TableCell>
                                    )
                                  })}
                              </TableRow>
                              <TableRow key={`${idx}1`}>
                                <TableCell>Overtime</TableCell>
                                {elem.dailies_payrolls.map((item, idx2) => {
                                  return (
                                    <TableCell key={`OverH-${idx2}`} className={validFloat(item.hoursOvertime) <= 0 ? 'col-table-with-zero' : ''} align='right'>{formatNumber(item.hoursOvertime)}</TableCell>
                                  )
                                })}
                              </TableRow>
                            </>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Grid container spacing={3} direction={'row'} sx={{ mt: -.5 }}>
                    <Grid item xs={6} sm={4}>
                      <Typography variant={"h5"}>{`${t('table.payrolls.column.regularHours')}: ${globalTotalRegularHours}`}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant={"h5"}>{`${t('table.payrolls.column.overTimeHours2')}: ${globalTotalOvertimeHours}`}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant={"h5"}>{`${t('table.payrolls.column.totalHours')}: ${globalTotalHours}`}</Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{mt: 2}}/>
                  <Grid container spacing={3} direction={'row'} sx={{ mt: -.5 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant='h5'> {t('table.enterHours.distribution')} </Typography>
                      <TableContainer component={Paper}>
                        <Table aria-label="simple table" size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                {t('table.enterHours.distribution.hours')}
                              </TableCell>
                              <TableCell>
                                {t('table.enterHours.distribution.payroll')}
                              </TableCell>
                              <TableCell>
                                {t('table.enterHours.distribution.invoice')}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>{t('table.enterHours.distribution.regularHours')}</TableCell>
                              <TableCell>{t(hoursDistribution.regularHoursPayroll)} </TableCell>
                              <TableCell>{t(hoursDistribution.regularHoursInvoice)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>{t('table.enterHours.distribution.overtimeHours')}</TableCell>
                              <TableCell>{formatNumber(hoursDistribution.overtimeHoursPayroll)} </TableCell>
                              <TableCell>{formatNumber(hoursDistribution.overtimeHoursInvoice)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>{t('table.enterHours.distribution.total')}</TableCell>
                              <TableCell>{formatNumber(hoursDistribution.payrollTotal)}</TableCell>
                              <TableCell>{formatNumber(hoursDistribution.invoiceTotal)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={valueTabSelect} index={2}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12} sm={6}>
                  <ContainerWithLabel label={t("table.activeEmployees.column.rate")}>
                    <Grid container spacing={3} direction={'row'}>
                      <Grid item xs={12} sm={6}>
                        <InputBox
                          label={t('table.activeEmployees.column.payRate')}
                          name='payrollRate'
                          id='payrollRate'
                          value={payrollRate}
                          onChange={fnChangeDataPayment}
                          onClick={(e) => {
                            e.target.selectionStart = 0
                          }}
                          InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputBox
                          label={t('table.activeEmployees.column.payRateOvertime')}
                          name='payrollRateOvertime'
                          id='payrollRateOvertime'
                          value={payrollRateOvertime}
                          onChange={fnChangeDataPayment}
                          onClick={(e) => {
                            e.target.selectionStart = 0
                          }}
                          InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputBox
                          label={t('modal.input.notes')}
                          name='payNotes'
                          id='payNotes'
                          value={payNotes}
                          onChange={fnChangeDataPayment}
                          multiline
                          maxRows={3}
                        />
                      </Grid>
                    </Grid>
                  </ContainerWithLabel>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ContainerWithLabel label={t("table.dailiesPayrolls.column.perDiemPayroll")}>
                    <Grid container spacing={3} direction={'row'}>
                      <Grid item xs={12} sm={6}>
                        <CheckBox
                          label={t('table.employees.column.hasFixedPerDiem')}
                          name='fixedPerdiem'
                          id='fixedPerdiem'
                          value={fixedPerdiem}
                          onChange={fnChangeDataPayment}
                          disabled={handPerdiem}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CheckBox
                          label={t('table.employees.column.hasHandPerDiem')}
                          name='handPerdiem'
                          id='handPerdiem'
                          value={handPerdiem}
                          onChange={fnChangeDataPayment}
                          disabled={fixedPerdiem}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputBox
                          label={t('modal.payroll.detail.qtyPerdiem')}
                          name='qtyPerdiem'
                          value={qtyPerdiem}
                          onChange={onChangeQtyPerdiem}
                          onClick={(e) => {
                            e.target.selectionStart = 0
                          }}
                          InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                          disabled={fixedPerdiem}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputBox
                          label={t('modal.payroll.detail.valuePerdiem')}
                          name='valuePerdiem'
                          value={valuePerdiem}
                          onChange={onChangeValuePerdiem}
                          onClick={(e) => {
                            e.target.selectionStart = 0
                          }}
                          InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputBox
                          label={t('modal.payroll.detail.totalPerdiem')}
                          name='totalPayrollPerdiem'
                          value={totalPayrollPerdiem}
                          onClick={(e) => {
                            e.target.selectionStart = 0
                          }}
                          InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                          disabled
                        />
                      </Grid>
                    </Grid>
                  </ContainerWithLabel>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CheckBox
                    label={t('modal.payroll.detail.checkNoPayment')}
                    name='noPayment'
                    id='noPayment'
                    value={noPayment}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CheckBox
                    label={t('modal.payroll.detail.changeInProfile')}
                    name='changePayrollInProfile'
                    id='changePayrollInProfile'
                    value={changePayrollInProfile}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3} textAlign={'right'}>
                  <Button startIcon={<Save />} onClick={fnSavePayrollValues} color='primary' variant='contained'>
                    {t('action.saveValues')}
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={valueTabSelect} index={3}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12} sm={6}>
                  <ContainerWithLabel label={t("table.activeEmployees.column.rate")}>
                    <Grid container spacing={3} direction={'row'}>
                      <Grid item xs={12} sm={6}>
                        <InputBox
                          label={t('table.activeEmployees.column.billRate')}
                          name='invoiceRate'
                          id='invoiceRate'
                          value={invoiceRate}
                          onChange={fnChangeDataPayment}
                          onClick={(e) => {
                            e.target.selectionStart = 0
                          }}
                          InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputBox
                          label={t('table.activeEmployees.column.billRateOvertime')}
                          name='invoiceRateOvertime'
                          id='invoiceRateOvertime'
                          value={invoiceRateOvertime}
                          onChange={fnChangeDataPayment}
                          onClick={(e) => {
                            e.target.selectionStart = 0
                          }}
                          InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputBox
                          label={t('modal.input.notes')}
                          name='payNotes'
                          id='payNotes'
                          value={payNotes}
                          onChange={fnChangeDataPayment}
                          multiline
                          maxRows={3}
                        />
                      </Grid>
                    </Grid>
                  </ContainerWithLabel>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ContainerWithLabel label={t("table.dailiesPayrolls.column.perDiemInvoice")}>
                    <Grid container spacing={3} direction={'row'}>
                      <Grid item xs={12} sm={6}>
                        <CheckBox
                          label={t('table.employees.column.hasFixedPerDiemInvoice')}
                          name='fixedPerdiemInvoice'
                          id='fixedPerdiemInvoice'
                          value={fixedPerdiemInvoice}
                          onChange={fnChangeDataPayment}
                          disabled={handPerdiemInvoice}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CheckBox
                          label={t('table.employees.column.hasHandPerDiem')}
                          name='handPerdiemInvoice'
                          id='handPerdiemInvoice'
                          value={handPerdiemInvoice}
                          onChange={fnChangeDataPayment}
                          disabled={fixedPerdiemInvoice}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputBox
                          label={t('modal.payroll.detail.qtyPerdiem')}
                          name='qtyPerdiemInvoice'
                          value={qtyPerdiemInvoice}
                          onChange={onChangeQtyPerdiemInvoice}
                          onClick={(e) => {
                            e.target.selectionStart = 0
                          }}
                          InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                          disabled={fixedPerdiemInvoice}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputBox
                          label={t('modal.payroll.detail.valuePerdiem')}
                          name='invoicePerdiem'
                          value={invoicePerdiem}
                          onChange={onUpdateValuePerdiem}
                          onClick={(e) => {
                            e.target.selectionStart = 0
                          }}
                          InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputBox
                          label={t('modal.payroll.detail.totalPerdiem')}
                          name='totalInvoicePerdiem'
                          value={totalInvoicePerdiem}
                          onClick={(e) => {
                            e.target.selectionStart = 0
                          }}
                          InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                          disabled
                        />
                      </Grid>
                    </Grid>
                  </ContainerWithLabel>
                </Grid>
                <Grid item xs={12} sm={9} textAlign={'right'}>
                  <CheckBox
                    label={t('modal.payroll.detail.changeInProfile')}
                    name='changeInvoiceInProfile'
                    id='changeInvoiceInProfile'
                    value={changeInvoiceInProfile}
                    onChange={onInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3} textAlign={'right'}>
                  <Button startIcon={<Save />} onClick={fnSaveInvoiceValues} color='primary' variant='contained'>
                    {t('action.saveValues')}
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button disabled ={disabledBtnSave} startIcon={<Save />} onClick={fnSaveChanges} color='primary' variant='contained'>
          {t('button.save')}
        </Button>
      </DialogActions>
    </>
  )
}