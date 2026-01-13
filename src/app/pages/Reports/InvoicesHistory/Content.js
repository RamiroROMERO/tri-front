// import { Filter } from '@mui/icons-material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Filter } from './Filter';
import { useInvoiceHistory } from './useInvoiceHistory';
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Footer } from './Footer';

const Content = ({ setLoading, sweetAlerts, screenControl }) => {

  const { t } = useTranslation();

  const { setDataTable, table, invoiceTotals, setInvoiceTotals } = useInvoiceHistory({ setLoading, sweetAlerts, screenControl, t });


  return (
    <>
      <Filter setLoading={setLoading} t={t} setDataTable={setDataTable} setInvoiceTotals={setInvoiceTotals} />
      <Card style={{ marginTop: '20px' }}>
        <CardContent>
          <XDataGrid {...table} />
        </CardContent>
      </Card>
      <Footer t={t} invoiceTotals={invoiceTotals} />
    </>
  )
}

export default Content