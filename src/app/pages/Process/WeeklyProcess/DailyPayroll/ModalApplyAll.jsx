import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent, CardActions } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { XDataGrid } from 'app/components/XDataGrid';
import useModalApplyAll from './useModalApplyAll';
import { SimpleSelect } from 'app/components/SimpleSelect';
import { InputBox } from 'app/components/InputBox';

export const ModalApplyAll = ({ setOpen, data, t }) => {
  const { customerData, setLoading, payrollLinesAll, employeesAll } = data;

  const { table, fnSaveAll, selectedPRL, setSelectedPRL, selectedValue, setSelectedValue } = useModalApplyAll({ customerData, setLoading, t, payrollLinesAll, employeesAll });

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={3} direction={'row'}>
                  <Grid item xs={12} sm={6} md={4}>
                    <InputBox
                      label={t("table.manageWeeks.select.customerName")}
                      name="customerName"
                      value={customerData.customerName}
                      onChange={() => { }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <InputBox
                      label={t("modal.payroll.detail.tablePerdiem.project")}
                      name="projectName"
                      value={`${customerData.code} - ${customerData.name}`}
                      onChange={() => { }}
                      disabled
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={3} direction={'row'}>
                  <Grid item xs={12} sm={3}>
                    <Card>
                      <CardContent>
                        <SimpleSelect
                          label={t('payrollLineTypes.modal.title')}
                          name="selectedPRL"
                          value={selectedPRL}
                          onChange={({ target }) => setSelectedPRL(target.value)}
                          optionList={payrollLinesAll}
                        />
                        <InputBox
                          label={t("modal.payroll.detail.tab.qtyDays")}
                          name="selectedValue"
                          value={selectedValue}
                          onChange={({ target }) => setSelectedValue(target.value)}
                        />
                      </CardContent>
                      <CardActions>

                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <XDataGrid {...table} />
                  </Grid>
                  <Grid item xs={12} sm={3} textAlign={'right'}>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<Save />} onClick={fnSaveAll} color='primary' variant='contained'>
          {t('button.save')}
        </Button>
      </DialogActions>
    </>
  )
}