import React from 'react'
import { Card, CardContent, DialogContent } from '@mui/material';
import { DataTable, Modal, ModalConfirm } from 'app/components';
import { usePayroll } from './usePayroll'
import { ModalExportAllCust } from './ModalExportAllCust';
import { ModalReviewPerdiem } from './ModalReviewPerdiem';
import { ModalViewUpdatedRates } from './ModalViewUpdatedRates';
import FilterPayroll from './FilterPayroll';
import FooterTotal from './FooterTotal';
import ModalExportPayroll from './ModalExportPayroll';
import ModalViewPayment from './ModalViewPayment';
import ModalReviewUpdateRates from './ModalReviewUpdateRates';

const Content = ({ setLoading, sweetAlerts, setActions, screenControl }) => {

  const { t, propsToFilterPayroll, table, payrollLineTypes, payrollTotals, openExportAllCust, currentYear, allColumnsTable, allYearList, weeksList, columnsTable, startDate, endDate, customerId, weekId, customerName, projectSelected, openExportPayroll, numWeek, noYear, locationsName, ciaAccount, showPrintPayroll, currentItem, dataPerdiems, dataRatesUpdated, openViewPayroll, openReviewPerdiems, openUpdateRates, openViewUpdateRates, setOpenReviewPerdiems, setOpenExportAllCust, setOpenExportPayroll, setOpenViewDetail, setOpenUpdateRates, fnGetPayroll, fnOkUpdatePayrollRates, setOpenViewUpdateRates, originalProjectList, optUpdate } = usePayroll({ setLoading, sweetAlerts, setActions, screenControl });

  const propsToFooterTotals = {
    t,
    payrollLineTypes,
    payrollTotals
  }

  const propsToExportAllCustomers = {
    title: 'modal.payroll.export.title',
    DialogContent: ModalExportAllCust,
    open: openExportAllCust,
    setOpen: setOpenExportAllCust,
    maxWidth: "sm",
    data: {
      allColumnsTable,
      allYearList,
      weeksList,
      sweetAlerts,
      currentYear,
      weekId,
      setLoading,
      screenControl
    }
  }

  const propsToExportPayroll = {
    title: 'modal.payroll.export.title',
    DialogContent: ModalExportPayroll,
    open: openExportPayroll,
    setOpen: setOpenExportPayroll,
    maxWidth: "sm",
    data: {
      columnsTable,
      startDate,
      endDate,
      customerId,
      weekId,
      projectSelected,
      customerName,
      numWeek,
      noYear,
      locationsName,
      ciaAccount,
      showPrintPayroll,
      setLoading,
      listProjects: originalProjectList
    }
  }

  const propsToViewPayroll = {
    title: 'modal.payroll.detail.title',
    DialogContent: ModalViewPayment,
    open: openViewPayroll,
    setOpen: setOpenViewDetail,
    maxWidth: "lg",
    data: {
      currentItem
    }
  }

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
      fnGetData: fnGetPayroll,
      sweetAlerts,
      setLoading,
      screenControl
    }
  }

  const propsToViewUpdatedRates = {
    title: 'modal.payroll.viewUpdatedRates.title',
    DialogContent: ModalViewUpdatedRates,
    open: openViewUpdateRates,
    setOpen: setOpenViewUpdateRates,
    maxWidth: "md",
    data: {
      dataRatesUpdated
    }
  }

  const propsModalReviewUpdateRates = {
    title: 'modal.payroll.reviewUpdatePayrollRates.title',
    DialogContent: ModalReviewUpdateRates,
    open: openUpdateRates,
    setOpen: setOpenUpdateRates,
    maxWidth: "lg",
    data: {
      customerId,
      weekId,
      projectSelected,
      enableUpdate: optUpdate,
      sweetAlerts,
      setLoading,
      fnGetPayroll
    }
  };

  // const propsToModalConfirmUpdateRate = {
  //   open: openUpdateRates,
  //   setOpen: setOpenUpdateRates,
  //   message: "alert.confirm.updatePayrollRates",
  //   onSuccess: fnOkUpdatePayrollRates
  // }

  return (
    <>
      <FilterPayroll {...propsToFilterPayroll} />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <DataTable {...table} />
        </CardContent>
      </Card>
      <FooterTotal {...propsToFooterTotals} />
      <Modal {...propsToExportAllCustomers} />
      <Modal {...propsToExportPayroll} />
      <Modal {...propsToViewPayroll} />
      <Modal {...propsToReviewPerdiems} />
      <Modal {...propsToViewUpdatedRates} />
      <Modal {...propsModalReviewUpdateRates} />
      {/* <ModalConfirm {...propsToModalConfirmUpdateRate} /> */}
    </>
  )
}

export default Content