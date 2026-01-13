import React from 'react'
import { Card, CardContent } from '@mui/material'
import { XDataGrid } from 'app/components/XDataGrid'
import { usePaymentHistory } from './usePaymentHistory'
import HeaderSection from './HeaderSection'
import FooterSection from './FooterSection'

const Content = ({setLoading, sweetAlerts, screenControl}) => {
  const {table, propsToHeader, propsToFooter} = usePaymentHistory({setLoading, sweetAlerts, screenControl})

  return (
    <>
      <HeaderSection {...propsToHeader}/>
      <Card>
        <CardContent>
          <XDataGrid {...table}/>
        </CardContent>
      </Card>
      <FooterSection {...propsToFooter}/>
    </>
  )
}

export default Content