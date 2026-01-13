import React from 'react'
import { DialogActions, DialogContent, Button, Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Divider, Icon, Alert } from '@mui/material'
import { Autorenew, ExitToApp } from '@mui/icons-material'
import { formatNumber, validFloat } from 'app/utils/helpers';
import { Modal, SearchSelect } from 'app/components';
import { useModalGenerateInvoice } from './useModalGenerateInvoice';
import { ModalReviewInvoice } from './ModalReviewInvoice';

export const ModalGenerateInvoice = ({setOpen, data, t}) => {
  const {paramsFilter, rowsSelected, listQbAccounts, listCustomerOnQbk, setLoading, sweetAlerts, dataInvoiceReview, dataInvoiceTotal, openInvoiceReview, setDataInvoiceReview, setDataInvoiceTotal, setOpenInvoiceReview, controlAdmin} = data;

  const {accountSelected, serviceSelected, setServiceSelected, listServices, onAccountChange, fnGenerateInvoice, btnGenerateDisable,showGenerateCard, controlInvoiceStatus} = useModalGenerateInvoice({listCustomerOnQbk, setLoading, paramsFilter, sweetAlerts, t, rowsSelected, setDataInvoiceReview, setDataInvoiceTotal, setOpenInvoiceReview, controlAdmin});

  var total = 0,
    subTotal = 0,
    discount = 0;

  const propsToModalReviewInvoice = {
    title: 'dialog.invoiceReview.title',
    DialogContent: ModalReviewInvoice,
    open: openInvoiceReview,
    setOpen: setOpenInvoiceReview,
    maxWidth: 'md',
    data: {
      dataInvoiceReview,
      dataInvoiceTotal
    }
  };

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={12}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">{t("table.invoice.column.project")}</TableCell>
                  <TableCell align="center">{t("table.invoice.column.subTotal")}</TableCell>
                  <TableCell align="center">{t("table.invoice.column.amountDiscount")}</TableCell>
                  <TableCell align="center">{t("table.invoice.column.total")}</TableCell>
                  <TableCell align="center">{t("table.checks.status")}</TableCell>
                  <TableCell align="center">{t("table.invoiceHistory.invoiceNumber")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {controlInvoiceStatus.length > 0 ? (
                  controlInvoiceStatus.map((row, idx) => {
                    total += validFloat(row.total);
                    subTotal += validFloat(row.subTotal);
                    discount += validFloat(row.amountDiscount);
                    return (
                      <TableRow key={idx}>
                        <TableCell component="th" scope="row">
                          {row.projectName}
                        </TableCell>
                        <TableCell align="right">{formatNumber(row.subTotal)}</TableCell>
                        <TableCell align="right">{formatNumber(row.amountDiscount)}</TableCell>
                        <TableCell align="right">{formatNumber(row.total)}</TableCell>
                        <TableCell align="center">{<Icon sx={{ color: row.colorStatus }}>{row.iconStatus}</Icon>}</TableCell>
                        <TableCell align="center">{row.qbkNumber}</TableCell>
                      </TableRow>
                    );
                  })
                ):(
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {controlInvoiceStatus.projectName}
                    </TableCell>
                    <TableCell align="right">{formatNumber(controlInvoiceStatus.subTotal)}</TableCell>
                    <TableCell align="right">{formatNumber(controlInvoiceStatus.amountDiscount)}</TableCell>
                    <TableCell align="right">{formatNumber(controlInvoiceStatus.total)}</TableCell>
                    <TableCell align="center">{<Icon sx={{ color: controlInvoiceStatus.colorStatus }}>{controlInvoiceStatus.iconStatus}</Icon>}</TableCell>
                    <TableCell align="center">{controlInvoiceStatus.qbkNumber}</TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell sx={{ color: "text.primary", fontWeight: "bold", mx: 0.5, fontSize: 14 }}>{t("table.invoice.column.totals")}</TableCell>
                  <TableCell sx={{ color: "text.primary", fontWeight: "bold", mx: 0.5, fontSize: 14 }} align="right">
                    {formatNumber(controlInvoiceStatus.length > 0 ? subTotal : controlInvoiceStatus.subTotal)}
                  </TableCell>
                  <TableCell sx={{ color: "text.primary", fontWeight: "bold", mx: 0.5, fontSize: 14 }} align="right">
                    {formatNumber(controlInvoiceStatus.length > 0 ? discount : controlInvoiceStatus.amountDiscount)}
                  </TableCell>
                  <TableCell sx={{ color: "text.primary", fontWeight: "bold", mx: 0.5, fontSize: 14 }} align="right">
                    {formatNumber(controlInvoiceStatus.length > 0 ? total : controlInvoiceStatus.total)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Divider sx={{mt: 2, mb: 2}}/>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={6}>
          <SearchSelect
            label={t("table.invoice.qbAccount")}
            name="accountSelected"
            value={accountSelected}
            onChange={onAccountChange}
            optionList={listQbAccounts}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <SearchSelect
            label={t("table.invoice.qbService")}
            name="serviceSelected"
            value={serviceSelected}
            onChange={(e)=>setServiceSelected(e.target.value)}
            optionList={listServices}
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      {showGenerateCard && (
        <Alert severity="info">{t('modal.invoice.alert.generateInvoice.info')}</Alert>
      )}
      <Button disabled={btnGenerateDisable} startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
      <Button disabled={btnGenerateDisable} startIcon={<Autorenew />} onClick={fnGenerateInvoice} color='primary' variant='contained'>
        {t('button.generate')}
      </Button>
    </DialogActions>
    <Modal {...propsToModalReviewInvoice}/>
  </>
  )
}