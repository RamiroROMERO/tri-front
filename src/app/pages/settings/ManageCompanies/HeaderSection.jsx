import React from 'react'
import { Edit } from '@mui/icons-material'
import { Button, Card, CardContent, Grid, Typography } from '@mui/material'

const HeaderSection = ({dataCompany, t, fnEditDocto}) => {

  return (
    <Card sx={{marginBottom: '20px'}}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={9} md={10}>
            <Grid container spacing={3} direction='row'>
              <Grid item xs={12} sm={5}>
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.manageCompanies.textField.dni')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{dataCompany?.dni || ''}</Typography>
              </Grid>
              <Grid item xs={12} sm={7}>
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.manageCompanies.textField.name')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{dataCompany?.name || ''}</Typography>
              </Grid>
              <Grid item xs={12} marginTop={"-24px"}>
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.manageCompanies.textField.address')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{dataCompany?.address1 || ''}</Typography>
              </Grid>
              <Grid item xs={12} marginTop={"-15px"}>
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.manageCompanies.textField.address2')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{dataCompany?.address2 || ''}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4} marginTop={"-15px"}>
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.manageCompanies.textField.phone')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{dataCompany?.phone || ''}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4} marginTop={"-15px"}>
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.manageCompanies.textField.website')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{dataCompany?.website || ''}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4} marginTop={"-15px"}>
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.manageCompanies.textField.emailInfo')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{dataCompany?.emailInfo || ''}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4} marginTop={"-15px"}>
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.manageCompanies.textField.contactName')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{dataCompany?.contactName || ''}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4} marginTop={"-15px"}>
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.manageCompanies.textField.contactPhone')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{dataCompany?.contactPhone || ''}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4} marginTop={"-15px"}>
                <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.manageCompanies.textField.contactEmail')}</Typography>
                <Typography variant={"h5"} mb={1.25}>{dataCompany?.contactEmail || ''}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={3} md={2} textAlign={'right'}>
            <Button startIcon={<Edit />} onClick={fnEditDocto} color='primary' variant='contained'>
              {t("button.edit")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default HeaderSection