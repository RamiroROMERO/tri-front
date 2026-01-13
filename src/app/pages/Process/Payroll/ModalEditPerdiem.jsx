import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, Save } from '@mui/icons-material'
import { useForm } from 'app/hooks';
import { validFloat } from 'app/utils/helpers';
import { request } from 'app/utils/core';
import { CheckBox, ContainerWithLabel, InputBox } from 'app/components';

export const ModalEditPerdiem = ({ setOpen, data, t }) => {
  const { currentItem, fnGetData, sweetAlerts, setLoading } = data;

  const { formState, onBulkForm, onInputChange } = useForm({
    id: currentItem?.id || 0,
    fixedPerdiem: currentItem?.payrollFixedPerdiem || false,
    qtyPerdiem: currentItem?.payrollQtyPerdiem || 0,
    payPerdiem: currentItem?.payrollPricePerdiem || 0,
    totalPayrollPerdiem: currentItem?.payrollPerdiem || 0,
    editRatePayrollInProfile: false,
    qtyPerdiem2: currentItem?.invoiceQtyPerdiem || 0,
    fixedPerdiem2: currentItem?.invoiceFixedPerdiem || false,
    invoicePerdiem: currentItem?.invoicePricePerdiem || 0,
    totalInvoicePerdiem: currentItem?.invoicePerdiem || 0,
    editRateInvoiceInProfile: false
  });

  const { fixedPerdiem, qtyPerdiem, payPerdiem, totalPayrollPerdiem, editRatePayrollInProfile, qtyPerdiem2, fixedPerdiem2, invoicePerdiem, editRateInvoiceInProfile, totalInvoicePerdiem } = formState;

  const onChangeQtyPerdiem = (e) => {
    let { value } = e.target;

    onBulkForm({
      qtyPerdiem: value,
      totalPayrollPerdiem: validFloat(value) * payPerdiem
    });
  }

  const onChangeValuePerdiem = (e) => {
    let { value } = e.target;

    onBulkForm({
      payPerdiem: value,
      totalPayrollPerdiem: validFloat(value) * qtyPerdiem
    });
  }

  const onChangeQtyPerdiemInvoice = (e) => {
    let { value } = e.target;

    onBulkForm({
      qtyPerdiem2: value,
      totalInvoicePerdiem: validFloat(value) * invoicePerdiem
    });
  }

  const onChangeValuePerdiemInvoice = (e) => {
    let { value } = e.target;

    onBulkForm({
      invoicePerdiem: value,
      totalInvoicePerdiem: validFloat(value) * qtyPerdiem2
    });
  }

  const fnChangeDataPayment = (e) => {
    let value = e.target.type === "checkbox" ? e.target.checked : e.target.value

    let { id } = e.target;

    if (id === 'fixedPerdiem' && value === true) {
      onBulkForm({
        qtyPerdiem: 1,
        totalPayrollPerdiem: qtyPerdiem * payPerdiem,
        fixedPerdiem: value
      });
    }
    if (id === 'fixedPerdiem' && value === false) {
      onBulkForm({
        qtyPerdiem: currentItem.payrollQtyPerdiem,
        totalPayrollPerdiem: currentItem.payrollQtyPerdiem * payPerdiem,
        fixedPerdiem: value
      });
    }
    //perdiems de factura
    if (id === 'fixedPerdiem2' && value === true) {
      onBulkForm({
        qtyPerdiem2: 1,
        totalInvoicePerdiem: qtyPerdiem2 * invoicePerdiem,
        fixedPerdiem2: value
      });
    }
    if (id === 'fixedPerdiem2' && value === false) {
      onBulkForm({
        qtyPerdiem2: currentItem.invoiceQtyPerdiem,
        totalPayrollPerdiem2: currentItem.invoiceQtyPerdiem * invoicePerdiem,
        fixedPerdiem2: value
      });
    }
  }

  const fnSave = () => {
    if (currentItem.id < 0) {
      sweetAlerts('warning', t("alertMessages.warning.employees.missingData"));
      return;
    }

    const newData = {
      id: currentItem.id,
      qtyPerdiem,
      payPerdiem,
      fixedPerdiem,
      editRatePayrollInProfile,
      qtyPerdiem2,
      fixedPerdiem2,
      invoicePerdiem,
      editRateInvoiceInProfile
    };

    request.PUT('/weeklyPayrollsDetails', newData, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
      fnGetData();
      setOpen(false);
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  };

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} sm={6}>
            <ContainerWithLabel label={t("table.dailiesPayrolls.column.perDiemPayroll")}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12}>
                  <CheckBox
                    label={t('table.employees.column.hasFixedPerDiem')}
                    name='fixedPerdiem'
                    id='fixedPerdiem'
                    value={fixedPerdiem}
                    onChange={fnChangeDataPayment}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputBox
                    label={t('modal.payroll.detail.qtyPerdiem')}
                    name='qtyPerdiem'
                    value={qtyPerdiem}
                    onChange={onChangeQtyPerdiem}
                    onClick={(e) => {
                      e.target.selectionStart = 0
                    }}
                    InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                    disabled={fixedPerdiem}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputBox
                    label={t('modal.payroll.detail.valuePerdiem')}
                    name='payPerdiem'
                    value={payPerdiem}
                    onChange={onChangeValuePerdiem}
                    onClick={(e) => {
                      e.target.selectionStart = 0
                    }}
                    InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputBox
                    label={t('modal.payroll.detail.totalPerdiem')}
                    name='totalPayrollPerdiem'
                    value={totalPayrollPerdiem}
                    onClick={(e) => {
                      e.target.selectionStart = 0
                    }}
                    InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} textAlign={'right'}>
                  <CheckBox
                    label={t('modal.payroll.detail.changeInProfile')}
                    name='editRatePayrollInProfile'
                    id='editRatePayrollInProfile'
                    value={editRatePayrollInProfile}
                    onChange={onInputChange}
                  />
                </Grid>
              </Grid>
            </ContainerWithLabel>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ContainerWithLabel label={t("table.dailiesPayrolls.column.perDiemInvoice")}>
              <Grid container spacing={3} direction={'row'}>
                <Grid item xs={12}>
                  <CheckBox
                    label={t('table.employees.column.hasFixedPerDiemInvoice')}
                    name='fixedPerdiem2'
                    id='fixedPerdiem2'
                    value={fixedPerdiem2}
                    onChange={fnChangeDataPayment}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputBox
                    label={t('modal.payroll.detail.qtyPerdiem')}
                    name='qtyPerdiem2'
                    value={qtyPerdiem2}
                    onChange={onChangeQtyPerdiemInvoice}
                    onClick={(e) => {
                      e.target.selectionStart = 0
                    }}
                    InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                    disabled={fixedPerdiem2}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputBox
                    label={t('modal.payroll.detail.valuePerdiem')}
                    name='invoicePerdiem'
                    value={invoicePerdiem}
                    onChange={onChangeValuePerdiemInvoice}
                    onClick={(e) => {
                      e.target.selectionStart = 0
                    }}
                    InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputBox
                    label={t('modal.payroll.detail.totalPerdiem')}
                    name='totalInvoicePerdiem'
                    value={totalInvoicePerdiem}
                    onClick={(e) => {
                      e.target.selectionStart = 0
                    }}
                    InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} textAlign={'right'}>
                  <CheckBox
                    label={t('modal.payroll.detail.changeInProfile')}
                    name='editRateInvoiceInProfile'
                    id='editRateInvoiceInProfile'
                    value={editRateInvoiceInProfile}
                    onChange={onInputChange}
                  />
                </Grid>
              </Grid>
            </ContainerWithLabel>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
          {t('button.save')}
        </Button>
      </DialogActions>
    </>
  )
}