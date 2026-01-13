import React, { useEffect, useState } from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent, Tabs, Tab, Icon } from '@mui/material'
import { Done, Edit, ExitToApp, Update } from '@mui/icons-material'
import { GridActionsCellItem } from '@mui/x-data-grid';
import { XDataGrid } from 'app/components/XDataGrid';
import { request } from 'app/utils/core';
import { currencyFormatter } from 'app/utils/helpers';
import { ModalEditPerdiem } from './ModalEditPerdiem';
import { Modal, ModalConfirm, TabPanel } from 'app/components';
import Div from '@jumbo/shared/Div';

export const ModalReviewPerdiem = ({setOpen, data, t}) => {
  const {dataPerdiems, customerId, weekId, projectSelected, sweetAlerts, setLoading, fnGetData, screenControl} = data;
  const { optCreate, optUpdate, optDelete } = screenControl;
  const [currentItem, setCurrentItem] = useState({});
  const [perdiemProfile, setPerdiemProfile] = useState({});
  const [openEditPerdiem, setOpenEditPerdiem] = useState(false);
  const [openUpdatePerdiem, setOpenUpdatePerdiem] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [dataPerdiemsProfile, setDataPerdiemsProfile] = useState([]);

  const fnEdit = (item)=>{
    if (optUpdate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setOpenEditPerdiem(true);
  }

  const fnEditNewPerdiems = (item)=>{
    if (optUpdate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setPerdiemProfile(item);
    setOpenUpdatePerdiem(true);
  }

  const fnOkUpdatePerdiemProfile = ()=>{
    const newData = {
      wpdId: perdiemProfile.wpdId,
      payrollPerdiem: perdiemProfile.payrollPerdiem,
      payrollFixedPerdiem: perdiemProfile.payrollFixedPerdiem,
      invoicePerdiem: perdiemProfile.invoicePerdiem,
      invoiceFixedPerdiem: perdiemProfile.invoiceFixedPerdiem
    }

    request.PUT('/weeklyPayrollsDetails/updatePerdiems', newData, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
      fnGetData();
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  }

  const table = {
    title: '',
    columns: [
      {field: 'employeeName', headerName: t('table.common.employee'), flex: 1 },
      {field: 'project', headerName: t('table.common.projects'), flex: 0.7 },
      {field: 'payrollQtyPerdiem', headerName: t('table.common.qtyPayrollRate'), flex: 0.5 },
      {
        field: 'payrollPricePerdiem', headerName: t('table.common.pricePayrollRate'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'payrollPerdiem', headerName: t('table.common.valuePayrollRate'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {field: 'invoiceQtyPerdiem', headerName: t('table.common.qtyInvoiceRate'), flex: 0.5 },
      {
        field: 'invoicePricePerdiem', headerName: t('table.common.priceInvoiceRate'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'invoicePerdiem', headerName: t('table.common.valueInvoiceRate'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 70,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnEdit(row)}
            color='info'
          />
        ]
      }
    ],
    data: dataPerdiems,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  };

  const tableNewPerdiems = {
    title: '',
    columns: [
      {field: 'employeeName', headerName: t('table.common.employee'), flex: 1 },
      {field: 'classificationName', headerName: t('table.common.classifications'), flex: 0.7 },
      {field: 'project', headerName: t('table.common.project'), flex: 0.8 },
      {
        field: 'payrollFixedPerdiemIcon', headerName: t('table.employees.column.hasFixedPerDiem'), flex: 0.4,
        renderCell: ({row, field})=>{
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {
        field: 'payrollPerdiem', headerName: t('table.common.valuePayrollRate'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'invoiceFixedPerdiemIcon', headerName: t('table.employees.column.hasFixedPerDiemInvoice'), flex: 0.4,
        renderCell: ({row, field})=>{
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {
        field: 'invoicePerdiem', headerName: t('table.common.valueInvoiceRate'), flex: 0.5, type: 'number',
        valueFormatter: ({ value }) => currencyFormatter.format(value)
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 70,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Done />}
            label={t("button.edit")}
            onClick={() => fnEditNewPerdiems(row)}
            color='info'
          />
        ]
      }
    ],
    data: dataPerdiemsProfile,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  };

  const fnSave = async()=>{
    if (optUpdate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    if(dataPerdiems.length===0){
      return;
    }

    await dataPerdiems.map((item)=>{
      const newData = {
        id: item.id,
        qtyPerdiem: item.payrollQtyPerdiem,
        payPerdiem: item.payrollPricePerdiem,
        fixedPerdiem: item.payrollFixedPerdiem,
        qtyPerdiem2: item.invoiceQtyPerdiem,
        fixedPerdiem2: item.invoiceFixedPerdiem,
        invoicePerdiem: item.invoicePricePerdiem
      };

      request.PUT('/weeklyPayrollsDetails', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
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
    });

    fnGetData();
  };

  useEffect(()=>{

    const params = {
      customerId,
      weekId,
      projectList: projectSelected
    }

    setLoading(true);
    request.POST(`/weeklyPayrollsDetails/findPayrollEmployeeRates`, params, (resp)=>{
      const employeePerdiem = resp.data.map((item)=>{
        item.id = item.wpdId
        item.project = `${item.projectCode} | ${item.projectName}`
        item.payrollFixedPerdiemIcon = item.payrollFixedPerdiem === 1 ? "check_box" : "check_box_outline_blank"
        item.invoiceFixedPerdiemIcon = item.invoiceFixedPerdiem === 1 ? "check_box" : "check_box_outline_blank"
        return item
      });
      setDataPerdiemsProfile(employeePerdiem);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  },[]);

  const propsToModalEditPerdiem = {
    title: 'modal.payroll.reviewPerdiems.title',
    DialogContent: ModalEditPerdiem,
    open: openEditPerdiem,
    setOpen: setOpenEditPerdiem,
    maxWidth: 'md',
    data: {
      currentItem,
      fnGetData,
      sweetAlerts,
      setLoading
    }
  };

  const propsToModalConfirmUpdatePerdiem = {
    open: openUpdatePerdiem,
    setOpen: setOpenUpdatePerdiem,
    message: "alert.confirm.updatePayrollPerdiem",
    onSuccess: fnOkUpdatePerdiemProfile
  }

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <Div sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)}>
              <Tab label={t('table.payroll.tabPanel.panel1')} />
              <Tab label={t('table.payroll.tabPanel.panel2')} />
            </Tabs>
          </Div>
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3} direction={'row'}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <XDataGrid {...table}/>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3} direction={'row'}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <XDataGrid {...tableNewPerdiems}/>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
      <Button startIcon={<Update />} onClick={fnSave} color='primary' variant='contained'>
        {t('button.updateAll')}
      </Button>
    </DialogActions>
    <Modal {...propsToModalEditPerdiem}/>
    <ModalConfirm {...propsToModalConfirmUpdatePerdiem} />
  </>
  )
}