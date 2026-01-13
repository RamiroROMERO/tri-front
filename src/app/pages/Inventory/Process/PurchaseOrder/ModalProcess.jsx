import React, { useState, useEffect } from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography } from '@mui/material'
import { Edit, ExitToApp, Save } from '@mui/icons-material'
import { XDataGrid } from 'app/components/XDataGrid';
import { request } from 'app/utils/core';
import { validFloat, validInt } from 'app/utils/helpers';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Modal } from 'app/components/Modal';
import { useForm } from 'app/hooks';
import { InputBox } from 'app/components/InputBox';
import { RadioButtonsGroup } from 'app/components/RadioButtonsGroup';
import { ContainerWithLabel } from 'app/components/ContainerWithLabel';
import { ModalEditProduct } from './ModalEditProduct';

export const ModalProcess = ({setOpen, data, t}) => {
  const {currentItem, setLoading, sweetAlerts, fnGetData} = data;
  const [currentItemDeta, setCurrentItemDeta] = useState({});
  const [openModalEditProduct, setOpenModalEditProduct] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    dateIn: [(val)=>val!=="", t("alertMessages.warning.dateIn")],
    dateOut: [(val)=>val!=="", t("alertMessages.warning.dateOut")],
    noPurchase: [(val)=>val!=="", t("alertMessages.warning.noPurchase")],
    total: [(val)=> validFloat(val)>0, t("alertMessages.warning.total")],
    paymentType: [(val)=> validFloat(val)>0, t("alertMessages.warning.paymentType")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    orderId: currentItem.id,
    dateIn: '',
    dateOut: '',
    noPurchase: '',
    paymentType: 0,
    customerId: currentItem.customerId,
    projectId: currentItem.projectId,
    providerId: currentItem.providerId,
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    status: true
  }, formValidations);

  const {orderId, dateIn, dateOut, noPurchase, customerId, projectId, providerId, paymentType, subtotal, discount, tax, total} = formState;

  const {dateInValid, dateOutValid, noPurchaseValid, paymentTypeValid, totalValid} = formValidation;

  const fnGetDataDetail = ()=>{
    setLoading(true);
    request.GET(`/inventory/purchaseOrderDetails?fatherId=${currentItem.id}`, (resp)=>{
      const data= resp.data.map(item=>{
        item.productCode = item.invProduct.code
        item.productName = item.invProduct.name
        item.qtyMissing = item.qty
        item.qtyReceibed = 0
        item.total = 0
        return item;
      });
      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnTableUpdateMyData = (rowEdited)=>{
    rowEdited.qtyReceibed = validFloat(rowEdited.qtyReceibed);
    rowEdited.subtotal = rowEdited.qtyReceibed * validFloat(rowEdited.price);
    rowEdited.discountValue = (rowEdited.subtotal * validFloat(rowEdited.discountPercent))/100;
    rowEdited.taxValue = ((rowEdited.subtotal - rowEdited.discountValue) * validFloat(rowEdited.taxPercent))/100;
    rowEdited.total = rowEdited.subtotal - rowEdited.discountValue + rowEdited.taxValue;

    const editTable = tableData.map(elem=>{
      if(validInt(elem.id) === validInt(rowEdited.id )){
        elem = rowEdited;
      }
      return elem;
    });

    // calculo de totales
    const sumSubtotal = editTable.map(item => item.qtyReceibed>0?validFloat(item.subtotal):0).reduce((prev, curr) => prev + curr, 0);
    const sumDiscount = editTable.map(item => item.qtyReceibed>0?validFloat(item.discountValue):0).reduce((prev, curr) => prev + curr, 0);
    const sumTaxes = editTable.map(item => item.qtyReceibed>0?validFloat(item.taxValue):0).reduce((prev, curr) => prev + curr, 0);
    const sumTotal = editTable.map(item => item.qtyReceibed>0?validFloat(item.total):0).reduce((prev, curr) => prev + curr, 0);

    const updateTotals = {
      subtotal: sumSubtotal,
      tax: sumTaxes,
      discount: sumDiscount,
      total: sumTotal
    }
    onBulkForm(updateTotals);

    setTableData(editTable);
    return rowEdited;
  }

  const handleProcessRowUpdateError = e =>{}

  const fnEditProduct = (item)=>{
    item.qty = validFloat(item.qtyReceibed);
    setCurrentItemDeta(item);
    setOpenModalEditProduct(true);
  }

  const fnSave = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      dateIn,
      dateOut,
      orderId,
      noPurchase,
      paymentType,
      customerId,
      projectId,
      providerId,
      subtotal,
      discount,
      tax,
      total
    }

    setLoading(true);
    request.POST('/inventory/purchases', newData, (resp)=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }

      // guardar detalle de la compra
      tableData.forEach(item=>{
        if(item.qtyReceibed>0){
          const detailPurchase = {
            fatherId: resp.data.id,
            productId: item.productId,
            qty: validFloat(item.qtyReceibed),
            price: validFloat(item.price),
            discountPercent: validFloat(item.discountPercent),
            discountValue: validFloat(item.discountValue),
            taxPercent: validFloat(item.taxPercent),
            taxValue: validFloat(item.taxValue),
            total: validFloat(item.total)
          }
          setLoading(true);
          request.POST('/inventory/purchaseDetails', detailPurchase, ()=>{
            setLoading(false);
          },(err)=>{
            const {messages} = err;
            if(messages?.length>0){
              messages.map(elem=>{
                sweetAlerts(elem.type, t(elem.message));
              });
            }
            setLoading(false);
          });
        }
      });

      const changeStatus = {
        status: 2
      }

      // cerrar orden de compra
      request.PUT(`/inventory/purchaseOrders/${currentItem.id}`, changeStatus, resp=>{
        fnGetData();
        setLoading(false);
      }, err=>{
        const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      });

      setLoading(false);
      onResetForm();
      setSendForm(false);
      setOpen(false);
    },(err)=>{
      console.error(err);
      setLoading(false);
    });
  };

  const table = {
    title: '',
    columns: [
      { field: 'productCode', headerName: t("table.common.productCode"), flex: 0.7 },
      {
        field: 'productName',
        headerName: t("table.common.name"),
        editable: false,
        flex: 1.4
      },
      {
        field: 'qtyMissing',
        headerName: t("table.purchaseOrders.column.qtyMissing"),
        editable: false,
        flex: 0.8,
      },
      {
        field: 'qtyReceibed',
        headerName: t("table.purchaseOrders.column.qtyReceibed"),
        editable: true,
        flex: 0.8,
      },
      {
        field: 'price',
        headerName: t("table.purchaseOrders.column.price"),
        editable: true,
        flex: 0.8,
      },
      {
        field: 'total',
        headerName: t("table.common.total"),
        editable: false,
        flex: 0.8,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 80,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnEditProduct(row)}
            color='info'
          />
        ]
      },
    ],
    data: tableData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50],
      processRowUpdate: fnTableUpdateMyData,
      onProcessRowUpdateError: handleProcessRowUpdateError
    }
  }

  useEffect(()=>{
    fnGetDataDetail();
  },[]);

  const propsToModalEdit = {
    title: 'dialog.purchaseOrders.editProduct.title',
    DialogContent: ModalEditProduct,
    open: openModalEditProduct,
    setOpen: setOpenModalEditProduct,
    maxWidth: 'xs',
    data: {
      currentItemDeta,
      sweetAlerts,
      setLoading,
      orderDetail: tableData,
      typeEdit: 2,
      onBulkFormIndex: onBulkForm
    }
  };

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} sm={2} md={1}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.num')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.id?currentItem.id:''}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.customer')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.customerName?currentItem.customerName:''}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.project')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.projectName?currentItem.projectName:''}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.provider')}</Typography>
          <Typography variant={"h5"} mb={1.25}>{`${currentItem.providerName?currentItem.providerName:''}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={7} md={8} lg={9}>
          <Grid container spacing={3} direction={'row'}>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <InputBox
                label={t('table.purchaseOrders.column.noPurchase')}
                name='noPurchase'
                value={noPurchase}
                onChange={onInputChange}
                error={(sendForm&&noPurchaseValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&noPurchaseValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InputBox
                label={t('table.common.dateIn')}
                name='dateIn'
                value={dateIn}
                onChange={onInputChange}
                error={(sendForm&&dateInValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&dateInValid}
                type="date"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InputBox
                label={t('table.common.dateOut')}
                name='dateOut'
                value={dateOut}
                onChange={onInputChange}
                error={(sendForm&&dateOutValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&dateOutValid}
                type="date"
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <RadioButtonsGroup
                label={t('table.common.paymentType')}
                name='paymentType'
                value={paymentType}
                onChange={onInputChange}
                row
                options={[
                  {id: 1, name: t('table.common.paymentType.cash')},
                  {id: 2, name: t('table.common.paymentType.credit')}
                ]}
                error={(sendForm&&paymentTypeValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&paymentTypeValid}
                required
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={5} md={4} lg={3}>
          <ContainerWithLabel label={t('table.common.totals')}>
          <Grid container spacing={3} direction={'row'}>
            <Grid item xs={12} sm={6} md={6}>
              <InputBox
                label={t('table.purchaseOrders.column.subtotal')}
                name='subtotal'
                value={subtotal}
                onChange={onInputChange}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <InputBox
                label={t('table.purchaseOrders.column.discount')}
                name='discount'
                value={discount}
                onChange={onInputChange}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <InputBox
                label={t('table.purchaseOrders.column.tax')}
                name='tax'
                value={tax}
                onChange={onInputChange}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <InputBox
                label={t('table.common.total')}
                name='total'
                value={total}
                onChange={onInputChange}
                error={(sendForm&&totalValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&totalValid}
                required
                disabled
              />
            </Grid>
          </Grid>
          </ContainerWithLabel>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <XDataGrid {...table}/>
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
    <Modal {...propsToModalEdit}/>
  </>
  )
}