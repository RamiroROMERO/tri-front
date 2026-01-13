import React from 'react'
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { formatNumber, roundTwoDecimals, validFloat, validInt } from 'app/utils/helpers';
import { useTranslation } from 'react-i18next';

const FooterTotals = ({ totals }) => {
  const { t } = useTranslation();
  return (
    <Card sx={{ marginTop: '10px' }}>
      <CardContent>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={6} sm={4} md={2} lg={4}>
            <Typography variant={"h6"} color="text.primary">
              {`${t('table.payrolls.column.hoursWorked')}: ${formatNumber(roundTwoDecimals(totals.regularHours), '', 2)}`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} lg={4}>
            <Typography variant={"h6"} color="text.primary">
              {`${t('table.payrolls.column.overTimeHours')}: ${formatNumber(roundTwoDecimals(totals.overtimeHours), '', 2)}`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={9} md={2} lg={2}>
            <Typography variant={"h6"} color="text.primary" sx={{ fontWeight: '600' }}>{t('table.payrolls.column.totalPay')}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} lg={2}>
            <Typography variant={"h5"} sx={{ fontWeight: '600' }}>{formatNumber(totals.total, '$. ', 2)}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Grid container spacing={1} direction={'row'}>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.secondary">
              {t("table.payrolls.column.totalRegularHours")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.primary">
              {formatNumber(totals.regularHoursValue, '$. ', 2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.secondary">
              {t("table.payrolls.column.totalOvertimeHours")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.primary">
              {formatNumber(totals.overtimeHoursValue, '$. ', 2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.secondary">
              {t("table.payrolls.column.loans")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.primary">
              {formatNumber(totals.totalLoans, '$. ', 2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.secondary">
              {t("table.totals.column.totalDeductions")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.primary">
              {formatNumber(totals.totalDeductions, '$. ', 2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.secondary">
              {t("table.totals.column.totalAdjustments")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.primary">
              {formatNumber(totals.totalAdjustments, '$. ', 2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.secondary">
              {t("modal.payroll.detail.totalPerdiem")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.primary">
              {formatNumber(totals.totalPerdiems, '$. ', 2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.secondary">
              {t("modal.payroll.detail.totalMissingTime")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.primary">
              {formatNumber(validFloat(totals.valMissingtime) + validFloat(totals.valMissingOvertime), '$. ', 2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.secondary">
              {t("table.totals.column.employeeCount")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} textAlign={'right'}>
            <Typography variant={"h6"} color="text.primary">
              {validInt(totals.totalEmployees)}
            </Typography>
          </Grid>
        </Grid>
        {/* <Divider sx={{ mt: 2, mb: 2 }} />
      <Grid container spacing={1} direction={'row'}>
        <Grid item xs={12}>
          <Typography variant='h5' color="text.primary"> {t("sidebar.menu.payrollLineTypes")} </Typography>
        </Grid>
        {payrollLineTypes.length > 0
          ? payrollLineTypes.map((row, idx) => {
            if (row.id == 2 || row.id == 4 || row.id == 6) {
              return (
                <>
                  <Grid item xs={12} sm={6} md={3} key={`${row.id}1`} textAlign={'right'}>
                    <Typography variant={"h6"} color="text.secondary">{row.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} key={`${row.id}2`} textAlign={'right'}>
                    <Typography variant={"h6"}>
                      {`${formatNumber(row.totalHours, '', 2)} - ${formatNumber(row.totalValue, '$. ', 2)}`}
                    </Typography>
                  </Grid>
                </>
              );
            }
          })
          : ""}
        {payrollLineTypes.length > 0
          ? payrollLineTypes.map((row, idx) => {
            if (row.id == 3 || row.id == 5) {
              return (
                <>
                  <Grid item xs={12} sm={6} md={3} key={`${row.id}3`} textAlign={'right'}>
                    <Typography variant={"h6"} color="text.secondary">{row.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} key={`${row.id}4`} textAlign={'right'}>
                    <Typography variant={"h6"}>
                      {`${formatNumber(row.totalHours, '', 2)} - ${formatNumber(row.totalValue, '$. ', 2)}`}
                    </Typography>
                  </Grid>
                </>
              );
            }
          })
          : ""}
      </Grid> */}
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12}>
            <Typography variant='h5' color="text.primary"> {t("modal.payroll.detail.tab.missingTimes")} </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant={"h6"} color="text.secondary">{t("modal.payroll.detail.tab.missingTimes")}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant={"h6"} color="text.primary">{`${formatNumber(totals.qtyMissingtime, '', 2)} - ${formatNumber(totals.valMissingtime, '$. ', 2)}`}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant={"h6"} color="text.secondary">{t("modal.payroll.detail.qtyMissingOvertime")}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant={"h6"} color="text.primary">{`${formatNumber(totals.qtyMissingOvertime, '', 2)} - ${formatNumber(totals.valMissingOvertime, '$. ', 2)}`}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FooterTotals