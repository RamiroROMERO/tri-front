import React, { useEffect, useState } from 'react'
import { DialogActions, DialogContent, Button, Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Divider } from '@mui/material'
import { ExitToApp } from '@mui/icons-material'
import { formatNumber, validFloat } from 'app/utils/helpers';

export const ModalReviewInvoice = ({setOpen, data, t}) => {
  const {dataInvoiceReview, dataInvoiceTotal} = data;
  const [totals, setTotals] = useState({subTotal: 0, discount: 0, total: 0});
  var qty = dataInvoiceReview.length? dataInvoiceReview.length: 0;

  useEffect(() => {
    const dataTotals = dataInvoiceTotal.reduce((prev, row) => {
      prev.subTotal += validFloat(row.subTotal)
      prev.discount += validFloat(row.amountDiscount)
      prev.total += validFloat(row.total)

      return prev;
    },{subTotal: 0, discount: 0, total: 0});

    setTotals(dataTotals);
  }, [dataInvoiceTotal]);

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell> { t("table.common.projects") } </TableCell>
                  <TableCell> { t("pages.invoice") } </TableCell>
                  <TableCell> { t("table.dailiesPayrolls.date") } </TableCell>
                  <TableCell style={{textAlign:'right'}}> { t("table.invoice.column.subTotal") } </TableCell>
                  <TableCell style={{textAlign:'right'}}> { t("table.invoice.column.discount") } </TableCell>
                  <TableCell style={{textAlign:'right'}}> { t("table.invoice.column.total") } </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  dataInvoiceReview.map((row) => {
                    const { Line, CurrencyRef } = row;
                    let lineDiscount =[];
                    let lineSubtot = [];
                    if(Line){
                      lineDiscount = Line.filter(item => item.DetailType === "DiscountLineDetail")
                      lineSubtot = Line.filter(item => item.DetailType === "SubTotalLineDetail")
                    }
                    return (
                    <TableRow>
                      <TableCell>
                          {(row?.projectInfo?.code || '') + " - " + (row?.projectInfo?.name||'')}
                      </TableCell>
                      <TableCell>
                          {row.DocNumber}
                      </TableCell>
                      <TableCell>
                          {row.TxnDate}
                      </TableCell>
                      <TableCell style={{textAlign:'right'}}>{(lineSubtot[0] ? formatNumber(lineSubtot[0].Amount) : 0.00) + " " + CurrencyRef.value}</TableCell>
                      <TableCell style={{textAlign:'right'}}>{(lineDiscount[0] ? formatNumber(lineDiscount[0].Amount) : 0.00) + " " + CurrencyRef.value}</TableCell>
                      <TableCell style={{textAlign:'right'}}>{formatNumber(row.TotalAmt) + " " + CurrencyRef.value}</TableCell>
                    </TableRow>
                    )
                  })
                }
                <Divider />
                <TableRow>
                  <TableCell component="th" scope="row" style={{fontWeight:'bold'}} colSpan={3}>Qty. {qty}</TableCell>
                  <TableCell style={{textAlign:'right', fontWeight:'bold' }}>
                      {formatNumber(totals.subTotal)}
                  </TableCell>
                  <TableCell style={{textAlign:'right', fontWeight:'bold' }}>
                      {formatNumber(totals.discount)}
                  </TableCell>
                  <TableCell style={{textAlign:'right', fontWeight:'bold' }}>
                      {formatNumber(totals.total)}
                  </TableCell>
                </TableRow>
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