import { Button, Card, CardActions, CardContent, Grid, IconButton, Typography } from '@mui/material';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { InputFileIcon } from './InputFileIcon';
import UploadIcon from '@mui/icons-material/Upload';
import ClearIcon from '@mui/icons-material/Clear';
import { useImportXLSX } from './useImportXLSX';

export const ImportXLSX = ({setHeaders, setData}) => {

  const {t} = useTranslation();
  const { validExtensions, nameFile, onChangeFile } = useImportXLSX({t, setData, setHeaders});
  
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={6} sm={3} md={2} lg={1}>
            <InputFileIcon name="xlsx" size={40} />
          </Grid>
          {/* <Divider orientation='vertical'/> */}
          <Grid item xs={6} sm={9} md={10} lg={11}>
            <Typography variant='h4' component="h4"> {nameFile} </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button variant="outlined" component="label" startIcon={<UploadIcon />} >
          {t("button.uploadFile")}
          <input 
            hidden 
            type="file"
            accept={validExtensions}
            onChangeCapture={onChangeFile} />
        </Button>
        <IconButton variant='outlined' color='secondary'>
          <ClearIcon />
        </IconButton>
      </CardActions>
        </Card>
  )
}
