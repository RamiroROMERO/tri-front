import React, { useState } from 'react'
import { Alert, Card, CardContent, Grid } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal } from 'app/components';
import { useInvoices } from './useInvoices';
import { ModalViewDetail } from './ModalViewDetail';
import { Filters } from './Filters';
import FooterTotal from './FooterTotal';

const Content = ({ setLoading, sweetAlerts, t, screenControl, setActions, controlAdmin }) => {
  const [invoiceTotals, setInvoiceTotal] = useState({});

  const { table, tableData, propsToModalInvoiceDetail, propsToModalGenerateInvoice, propsToFilters, rowsSelectedCount } = useInvoices(setLoading, t, sweetAlerts, screenControl, setActions, controlAdmin);

  return (
    <>
      <Filters {...propsToFilters} setInvoiceTotal={setInvoiceTotal} screenControl={screenControl} />
      <Grid container direction="row" sx={{ mt: 2, mb: 2 }}>
        <Grid item sm={12}>
          <Card>
            <CardContent>
              {rowsSelectedCount > 0 ? <Alert severity="success">{`${rowsSelectedCount} row selected`}</Alert> : ''}
              <XDataGrid {...table} data={tableData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <FooterTotal {...invoiceTotals} t={t} />
      <Modal {...propsToModalInvoiceDetail} DialogContent={ModalViewDetail} />
      <Modal {...propsToModalGenerateInvoice} />
    </>
  )
}

export default Content