import React from 'react'
import { useTranslation } from 'react-i18next';
import { SkelentonLoading } from './SkelentonLoading';
import { useDashPayroll } from './useDashPayroll';
import StatisticsCard from 'app/components/StatisticsCard/StatisticsCard';
import { Card, CardContent, Grid } from '@mui/material';

const DashPayroll = ({setLoading, isLoading}) => {
  const { t } = useTranslation();
  const {onLoading} = useDashPayroll();

  const dataChar1 = [
    { label: 'Octubre', value: 202 },
    { label: 'Noviembre', value: 236 },
    { label: 'Diciembre', value: 104 },
    { label: 'Enero', value: 134 },
    { label: 'Febrero', value: 105 },
    { label: 'Marzo', value: 54 },
  ]


  return (
    <>
    {onLoading?<SkelentonLoading />:
    <>
    </>}
    <Grid container spacing={3} direction='row'>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <StatisticsCard title="dashboard.card.newEmployees" dark cardColor={"#90caf9"} fillGrapColor={"#42a5f5"} strokecolor={"#1976d2"} data={dataChar1} />
      </Grid>
      {/* <Grid item xs={12} sm={6} md={4} lg={4}>
        <StatisticsCard title="dashboard.card.newProjects" dark cardColor={"#80cbc4"} fillGrapColor={"#4db6ac"} strokecolor={"#26a69a"} data={[]} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <StatisticsCard title="dashboard.card.newCustomers" cardColor={"#ffcc80"} fillGrapColor={"#ffa726"} strokecolor={"#ff9800"} data={[]} />
      </Grid> */}
    </Grid>
    <Card>
      <CardContent>
    </CardContent>
    </Card>
    </>
  )
}


export default DashPayroll;