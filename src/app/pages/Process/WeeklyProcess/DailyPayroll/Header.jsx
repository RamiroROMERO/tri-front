import React, { useState } from 'react'
import { Button, Card, CardContent, Divider, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import { request } from 'app/utils/core';
import { InputBox } from 'app/components/InputBox';
import { useHeader } from './useHeader';

const Header = ({ customerName, projectCode, projectName, weekSelect, t, setLoading, complData}) => {

  const {jobReference, setJobReference, jobPO, setJobPO, fnSaveComplementaryData} = useHeader({setLoading, complData});


  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} sm={8}>
            <Grid container spacing={3} direction={'row'}>
              <Grid item xs={12} md={4}>
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.customer')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{`${customerName}`}</Typography>
              </Grid>
              <Grid item xs={12} md={4} >
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.projects.column.name')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{`${projectCode} | ${projectName}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.manageWeeks.column.noWeek')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{`${weekSelect}`}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container spacing={3} direction={'row'}>
              <Grid item xs={12}>
              <FormControl variant="standard" fullWidth={true}>
                  <InputLabel htmlFor="txtJobReference">{t('table.dailiesPayrolls.header.jobReference')}</InputLabel>
                  <Input
                    fullWidth={true}
                    id="txtJobReference"
                    type='text'
                    value={jobReference}
                    onChange={({target})=>setJobReference(target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={fnSaveComplementaryData}
                        >
                          <SaveIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  </FormControl>
              </Grid>	
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth={true}>
                  <InputLabel htmlFor="txtJobPO">{t('table.dailiesPayrolls.header.jobPO')}</InputLabel>
                  <Input
                    fullWidth={true}
                    id="txtJobPO"
                    type='text'
                    value={jobPO}
                    onChange={({target})=>setJobPO(target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={fnSaveComplementaryData}
                        >
                          <SaveIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  </FormControl>
                </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Header