import React from 'react';
import { DialogActions, DialogContent, Grid, Button, Typography, Card, CardContent } from '@mui/material';
import { PlayCircle, ImportExport } from '@mui/icons-material';
import { XDataGrid } from 'app/components/XDataGrid';
import { formatNumber } from 'app/utils/helpers';
import { Modal } from 'app/components';
import { useModalView } from './useModalView';

export const ModalViewDetail = ({ setOpen, data, t }) => {
  const { currentItem, setLoading, weekSelectedId, paramsFilter, sweetAlerts, setOpenGenerateInvoice, screenControl } = data;

  const { table, invoiceTotals, propsToModalEditRates, propsToModalAddItem, fnGenerateInvoice, fnExportDetail } = useModalView({ setLoading, currentItem, weekSelectedId, t, sweetAlerts, setOpenGenerateInvoice, screenControl, paramsFilter })

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <Card>
              <CardContent>
                <Grid container spacing={3} direction={'row'}>
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={3} direction={'row'}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.customer')}</Typography>
                        <Typography variant={"h5"} mb={1.25}>{`${currentItem?.customerName || ''}`}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.invoiceDetail.textField.projectName')}</Typography>
                        <Typography variant={"h5"} mb={1.25}>{`${currentItem?.projectName || ''}`}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.invoiceDetail.textField.numWeek')}</Typography>
                        <Typography variant={"h5"} mb={1.25}>{`${paramsFilter?.weekSelect || ''}`}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Grid container spacing={3} direction={'row'} >
                      <Grid item xs={12}>
                        <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.dailiesPayrolls.header.jobReference')}</Typography>
                        <Typography variant={"h5"} mb={1.25}>{`${currentItem?.jobReference || ''}`}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.dailiesPayrolls.header.jobPO')}</Typography>
                        <Typography variant={"h5"} mb={1.25}>{`${currentItem?.jobPo || ''}`}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <XDataGrid {...table} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={12}>
            <Card>
              <CardContent>
                <Grid container spacing={3} direction={'row'} textAlign={'right'}>
                  <Grid item xs={6} sm={8} md={10}>
                    <Typography variant={"h6"} color="text.secondary">{t('table.common.subTotal')}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <Typography variant={"h5"}>{formatNumber(invoiceTotals.subTotal, '$. ', 2)}</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={3} direction={'row'} textAlign={'right'}>
                  <Grid item xs={6} sm={8} md={10}>
                    <Typography variant={"h6"} color="text.secondary">{`${t('table.common.discountPercent')}(${invoiceTotals?.DiscountPercent || ''}%)`}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <Typography variant={"h5"}>{`-${formatNumber(invoiceTotals.amountDiscount, '$. ', 2)}`}</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={3} direction={'row'} textAlign={'right'}>
                  <Grid item xs={6} sm={8} md={10}>
                    <Typography variant={"h6"} color="text.secondary">{t('table.common.total')}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <Typography variant={"h5"}>{formatNumber(invoiceTotals.total, '$. ', 2)}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ImportExport />} onClick={fnExportDetail} color='info' variant='contained'>
          {t('button.export')}
        </Button>
        <Button startIcon={<PlayCircle />} onClick={fnGenerateInvoice} color='primary' variant='contained'>
          {t('button.generate')}
        </Button>

      </DialogActions>
      <Modal {...propsToModalEditRates} />
      <Modal {...propsToModalAddItem} />
    </>
  )
}