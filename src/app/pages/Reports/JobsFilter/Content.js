import React from 'react'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal } from 'app/components';
import { useJobsFilter } from './useJobsFilter'
import HeaderSection from './HeaderSection';

const Content = ({setLoading, sweetAlerts, screenControl, controlAdmin}) => {

  const {propsToHeader, table, propsToModalInvoiceDetail, propsToModalGenerateInvoice} = useJobsFilter({setLoading, sweetAlerts, screenControl, controlAdmin});

  return (
    <>
      <HeaderSection {...propsToHeader}/>
      <Card>
        <CardContent>
          <XDataGrid {...table}/>
        </CardContent>
      </Card>
      <Modal {...propsToModalInvoiceDetail}/>
      <Modal {...propsToModalGenerateInvoice}/>
    </>
  )
}

export default Content