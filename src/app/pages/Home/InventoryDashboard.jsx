import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { validInt } from 'app/utils/helpers';
import CategoryIcon from '@mui/icons-material/Category';
import GroupsIcon from '@mui/icons-material/Groups';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import GradingIcon from '@mui/icons-material/Grading';
import CardInfo from 'app/components/CardInfo';
import { request } from 'app/utils/core';

export const InventoryDashboard = ({setLoading, sweetAlert}) => {
  
  const { t } = useTranslation();

  const [ totalProducts, setTotalProducts ] = useState(0);
  const [ totalProviders, setTotalProViders ] = useState(0);
  const [ totalOpenOrders, setTotalOpenOrders ] = useState(0);
  const [ totalCloseOrders, setTotalCloseOrders ] = useState(0);

  const fnGetData = ()=>{

    request.GET('/dashboard/inventory', res=>{
      const {data} = res;
      setTotalProducts(validInt( data.products));
      setTotalProViders(validInt( data.providers));
      setTotalOpenOrders(validInt( data.openOrders));
      setTotalCloseOrders(validInt( data.closeOrders));
    }, err=>{
      console.error(err);
    });
  }

  useEffect(fnGetData, []);
    
  return (
  <>
    <Card>
      <CardContent>
        <Typography variant='h3'>{t("appDashboard.inventoryTitle")}</Typography>
      </CardContent>
    </Card>
    <Grid style={{ marginTop: "5px" }}  container spacing={3} direction="row">
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <CardInfo
            gradientColorInit="#D5A240"
            gradientColorEnd="#D5A240"
            titleNumber={totalProducts}
            titleDescription='Products'
            icon={<CategoryIcon sx={{ fontSize: 36 }} />}
            listItems={[]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <CardInfo
            gradientColorInit="#023c63"
            gradientColorEnd="#023c63"
            titleNumber={totalProviders}
            titleDescription='Providers'
            icon={<GroupsIcon sx={{ fontSize: 36 }} />}
            listItems={[]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <CardInfo
            gradientColorInit="#B99755"
            gradientColorEnd="#B99755"
            titleNumber={totalOpenOrders}
            titleDescription='Open Orders'
            icon={<FileOpenIcon sx={{ fontSize: 36 }} />}
            listItems={[]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <CardInfo
            gradientColorInit="#8E8575"
            gradientColorEnd="#8E8575"
            titleNumber={totalCloseOrders}
            titleDescription='Close Orders'
            icon={<GradingIcon sx={{ fontSize: 36 }} />}
            listItems={[]}
          />
        </Grid>
      </Grid>

        </>
  )
    
  
}
