import React from 'react';
import { Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { useModalNew } from './useModalNew';
import { ExitToApp, Save } from '@mui/icons-material';
import { CheckBox, InputBox } from 'app/components';
import { SimpleSelect } from 'app/components';
import { SearchSelect } from 'app/components';

export const ModalNew = ({ setOpen, data, t }) => {
  const { sweetAlerts, currentItem, fnGetData, setLoading, listStores, productList, listLocation } = data;

  const { formState, onInputChange, formValidation, isFormValid, sendForm, fnSave } = useModalNew({ t, sweetAlerts, currentItem, fnGetData, setLoading, setOpen })

  const { id, storeId, productId, qtyMin, qtyMax, locationId, status } = formState;

  const { storeIdValid, productIdValid, qtyMinValid, qtyMaxValid, locationIdValid } = formValidation;
  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={6}>
            <SimpleSelect
              label={t('table.products.column.store')}
              name='storeId'
              value={storeId}
              onChange={onInputChange}
              optionList={listStores}
              error={(sendForm && storeIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && storeIdValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SearchSelect
              label={t('table.products.column.product')}
              name='productId'
              value={productId}
              onChange={onInputChange}
              optionList={productList}
              error={(sendForm && productIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && productIdValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputBox
              label={t('table.common.qtyMin')}
              name='qtyMin'
              value={qtyMin}
              onChange={onInputChange}
              type='number'
              error={(sendForm && qtyMinValid) ? true : false}
              helperText={(sendForm && !isFormValid) && qtyMinValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputBox
              label={t('table.common.qtyMax')}
              name='qtyMax'
              value={qtyMax}
              onChange={onInputChange}
              type='number'
              error={(sendForm && qtyMaxValid) ? true : false}
              helperText={(sendForm && !isFormValid) && qtyMaxValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SimpleSelect
              label={t('table.common.location')}
              name='locationId'
              value={locationId}
              onChange={onInputChange}
              optionList={listLocation}
              error={(sendForm && locationIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && locationIdValid}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <CheckBox
              label={t("modal.input.checkbox.status")}
              name="status"
              checked={status}
              onChange={onInputChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
          {t("button.save")}
        </Button>
      </DialogActions>
    </>
  )
}
