import { useEffect } from 'react';
import { Button, Card, CardContent, DialogContent, Grid } from '@mui/material'
import { YoutubeSearchedFor } from '@mui/icons-material';
import { Modal, SearchSelect, SimpleSelect } from 'app/components'
import AccordionCheck from 'app/components/AccordionCheck/AccordionCheck';
import { useFilters } from './useFilters';
import { ModalReviewPerdiem } from '../Payroll/ModalReviewPerdiem';
// import { ModalViewUpdatedRates } from '../Payroll/ModalViewUpdatedRates';
import ModalReviewUpdateRates from './ModalReviewUpdateRates';

export const Filters = ({ setLoading, setTableData, t, setWeekSelectedId, setParamsFilter, setListQbAccounts, setListCustomerOnQbk, setInvoiceTotal, screenControl, sweetAlerts, fnMenuOptions, setDataPerdiems, openReviewPerdiems, setOpenReviewPerdiems, openUpdateRates, setOpenUpdateRates, openViewUpdateRates, setOpenViewUpdateRates, dataPerdiems, dataRatesUpdated, setDataRatesUpdated }) => {

  const { customerId, setCustomerId, customerList, yearId, setYearId, yearList, weekId, projectSelected, setWeekId, weekList, propsToAccordionLocation, propsToAccordionProjects, propsToAccordionMTProjects, fnGetInvoiceList, fnOkUpdatePayrollRates } = useFilters(setLoading, setTableData, t, setParamsFilter, setListQbAccounts, setListCustomerOnQbk, setInvoiceTotal, screenControl, sweetAlerts, fnMenuOptions, setDataPerdiems, setDataRatesUpdated, setOpenViewUpdateRates);

  useEffect(() => setWeekSelectedId(weekId), [weekId]);

  const propsToReviewPerdiems = {
    title: 'modal.payroll.reviewPerdiems.title',
    DialogContent: ModalReviewPerdiem,
    open: openReviewPerdiems,
    setOpen: setOpenReviewPerdiems,
    maxWidth: "lg",
    data: {
      dataPerdiems,
      customerId,
      weekId,
      projectSelected,
      fnGetData: fnGetInvoiceList,
      sweetAlerts,
      setLoading,
      screenControl
    }
  }

  // const propsToViewUpdatedRates = {
  //   title: 'modal.payroll.viewUpdatedRates.title',
  //   DialogContent: ModalViewUpdatedRates,
  //   open: openViewUpdateRates,
  //   setOpen: setOpenViewUpdateRates,
  //   maxWidth: "lg",
  //   data: {
  //     dataRatesUpdated
  //   }
  // }

  // const propsToModalConfirmUpdateRate = {
  //   open: openUpdateRates,
  //   setOpen: setOpenUpdateRates,
  //   message: "alert.confirm.updateInvoiceRates",
  //   onSuccess: fnOkUpdatePayrollRates
  // }

  const propsToModalReviewUpdateRates = {
    title: 'modal.payroll.reviewUpdateInvoiceRates.title',
    DialogContent: ModalReviewUpdateRates,
    open: openUpdateRates,
    setOpen: setOpenUpdateRates,
    maxWidth: 'lg',
    data: {
      screenControl,
      setLoading,
      sweetAlerts,
      customerId,
      weekId,
      projectSelected,
      fnGetData: fnGetInvoiceList
    }
  };


  return (
    <>
      <Card>
        <CardContent>
          <Grid container direction="row" spacing={3}>
            <Grid item xs={12} sm={8} md={4}>
              <SearchSelect
                label={t("breadcrumb.customers")}
                name="customerId"
                value={customerId}
                onChange={({ target }) => setCustomerId(target.value)}
                optionList={customerList}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <SimpleSelect
                label={t("table.common.year")}
                name="yearId"
                value={yearId}
                onChange={({ target }) => setYearId(target.value)}
                optionList={yearList}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <SearchSelect
                label={t("modal.select.selectWeek")}
                name="weekId"
                value={weekId}
                onChange={({ target }) => setWeekId(target.value)}
                optionList={weekList}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <AccordionCheck {...propsToAccordionLocation} />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <AccordionCheck {...propsToAccordionProjects} />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <AccordionCheck {...propsToAccordionMTProjects} />
            </Grid>
          </Grid>
          <br />
          <Grid container direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 1 }}>
            <Button startIcon={<YoutubeSearchedFor />} variant='contained' color='primary' onClick={fnGetInvoiceList} > {t("button.getInvoiceList")} </Button>
          </Grid>
        </CardContent>
      </Card>
      <Modal {...propsToReviewPerdiems} />
      <Modal {...propsToModalReviewUpdateRates} />
      {/* <ModalConfirm {...propsToModalConfirmUpdateRate} /> */}
    </>
  )
}
