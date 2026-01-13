import React from 'react'
import { DialogActions, DialogContent, Grid, Button } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { validInt } from 'app/utils/helpers';
import { CheckBox, ContainerWithLabel, InputBox, SimpleSelect } from 'app/components';
import { SearchSelect } from 'app/components';
import { useProductDetailModal } from './useProductDetailModal';

export const ProductDetailModal = ({setOpen, data, t}) => {
  
  const {classificationList, measureUnitList, trademarkList} = data;

  const {sendForm, formState, isFormValid, formValidation, onInputChange, onTaxApplyChange, fnSave} = useProductDetailModal({t, data, setOpen})

  const {id, code, name, description, classificationId, measureUnitId, trademarkId, costValue, maxCostValue, lastCostValue, taxApply, taxPercent, lastProviderName, status} = formState;

  const {codeValid, nameValid, classificationIdValid, measureUnitIdValid, trademarkIdValid} = formValidation;

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={9}>
          <ContainerWithLabel label={t("dialog.products.productInfo")} >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <InputBox
                  label={t('table.products.column.code')}
                  name='code'
                  value={code}
                  onChange={onInputChange}
                  error={(sendForm&&codeValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&codeValid}
                  required
                  disabled = {validInt(id)!==0}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <InputBox
                  label={t('table.products.column.name')}
                  name='name'
                  value={name}
                  onChange={onInputChange}
                  error={(sendForm&&nameValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&nameValid}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <InputBox
                  label={t('table.products.column.description')}
                  name='description'
                  value={description}
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SearchSelect
                  label={t('table.products.column.trademark')}
                  name='trademarkId'
                  value={trademarkId}
                  onChange={onInputChange}
                  optionList={trademarkList}
                  error={(sendForm&&trademarkIdValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&trademarkIdValid}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SimpleSelect
                  label={t('table.products.column.classification')}
                  name='classificationId'
                  value={classificationId}
                  onChange={onInputChange}
                  optionList={classificationList}
                  error={(sendForm&&classificationIdValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&classificationIdValid}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SimpleSelect
                  label={t('table.products.column.measureUnits')}
                  name='measureUnitId'
                  value={measureUnitId}
                  onChange={onInputChange}
                  optionList={measureUnitList}
                  error={(sendForm&&measureUnitIdValid)?true:false}
                  helperText={(sendForm &&!isFormValid)&&measureUnitIdValid}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBox
                  label={t('table.products.column.lastProviderName')}
                  name='lastProviderName'
                  value={lastProviderName}
                  onChange={onInputChange}
                  disabled
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
          </ContainerWithLabel>
        </Grid>
        <Grid item xs={12} sm={3}>
          <ContainerWithLabel label={t("dialog.products.productCost")} >
            <Grid container spacing={3} direction={"row"}>
              <Grid item xs={12}>
              <InputBox
                label={t('table.products.column.costValue')}
                name='costValue'
                value={costValue}
                onChange={onInputChange}
                type='number'
              />
              </Grid>
              <Grid item xs={12}>
              <InputBox
                label={t('table.products.column.maxCostValue')}
                name='maxCostValue'
                value={maxCostValue}
                onChange={onInputChange}
                type='number'
                disabled
              />
              </Grid>
              <Grid item xs={12}>
              <InputBox
                label={t('table.products.column.lastCostValue')}
                name='lastCostValue'
                value={lastCostValue}
                onChange={onInputChange}
                type='number'
                disabled
              />
              </Grid>
              <Grid item xs={12}>
                 <CheckBox
                  label={t("table.products.column.taxApply")}
                  name="taxApply"
                  checked={taxApply}
                  onChange={onTaxApplyChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputBox
                  label={t('table.products.column.taxPercent')}
                  name='taxPercent'
                  value={taxPercent}
                  onChange={onInputChange}
                  disabled={!taxApply}
                  />
              </Grid>
            </Grid>
          </ContainerWithLabel>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
      <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
        {t('button.save')}
      </Button>
    </DialogActions>
  </>
  )
};