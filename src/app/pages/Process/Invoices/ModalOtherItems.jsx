import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent, CardActions, Typography } from '@mui/material'
import { Clear, ExitToApp, Save } from '@mui/icons-material'
import { InputBox, ModalConfirm } from 'app/components';
import { useModalOtherItems } from './useModalOtherItems';
import { XDataGrid } from 'app/components/XDataGrid';

export const ModalOtherItems = ({setOpen, data, t}) => {
  const { currentItem, weekSelectedId, fnGetInvoiceDetail, sweetAlerts, setLoading } = data;
  
  const {formState, formValidation, isFormValid, onInputChange, onResetForm, fnSave, sendForm, table, totalItems, propsToModalConfirm } = useModalOtherItems({setLoading, sweetAlerts, fnGetInvoiceDetail, currentItem, t, weekSelectedId});
  const {description, qty, price, total, status} = formState;
  const {descriptionValid, qtyValid, priceValid, totalValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h4" >{t("dialog.invoiceDetail.otherValues.itemDetail")}</Typography>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12}>
              <InputBox
                label={t('table.common.description')}
                name='description'
                value={description}
                onChange={onInputChange}
                error={(sendForm&&descriptionValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&descriptionValid}
                required
                multiline
                maxRows={3}
              />
            </Grid>
          </Grid>
          <Grid sx={{mt:'5px'}} container spacing={3} direction={'row'}>
            <Grid item sm={12} md={4}>
              <InputBox
                type="number"
                label={t('table.common.qty')}
                name='qty'
                value={qty}
                onChange={onInputChange}
                error={(sendForm&&qtyValid)?true:false}
                helperText={(sendForm &&!isFormValid) && qtyValid}
                required
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <InputBox
                type="number"
                label={t('table.common.price')}
                name='price'
                value={price}
                onChange={onInputChange}
                error={(sendForm&&priceValid)?true:false}
                helperText={(sendForm &&!isFormValid) && priceValid}
                required
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <InputBox
                disabled
                label={t('table.common.total')}
                name='total'
                value={total}
                onChange={onInputChange}
                error={(sendForm&&totalValid)?true:false}
                helperText={(sendForm &&!isFormValid) && totalValid}
                required
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
            {t('button.save')}
          </Button>
          <Button startIcon={<Clear />} onClick={onResetForm} color='secondary' variant='contained'>
            {t('button.clear')}
          </Button>
        </CardActions>
      </Card>
      <hr/>
      <XDataGrid {...table}/>
    </DialogContent>
    <DialogActions>
      <Grid container>
        <Grid item>
          <Typography variant='h5' component='h5' >{`Total: ${totalItems}`}</Typography>
        </Grid>
      </Grid>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
    </DialogActions>
    <ModalConfirm {...propsToModalConfirm}/>
  </>
  )
}