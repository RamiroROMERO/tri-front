import React from 'react'
import { usePurchases } from './usePurchases'
import { Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import FilterSection from './FilterSection';

const Content = ({setLoading, sweetAlerts}) => {
  const {table, propsToFilterSection} = usePurchases({setLoading, sweetAlerts});

  return (
    <>
    <FilterSection {...propsToFilterSection}/>
    <Card>
      <CardContent>
        <XDataGrid {...table}/>
      </CardContent>
    </Card>
    </>
  )
}

export default Content