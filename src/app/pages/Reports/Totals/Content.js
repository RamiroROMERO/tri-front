import React from 'react'
import { Alert, Card, CardContent } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal } from 'app/components';
import { ModalViewByProject } from './ModalViewByProject';
import { ModalViewByClassification } from './ModalViewByClassification';
import { useTotals } from './useTotals'
import HeaderSection from './HeaderSection';
import FooterSection from './FooterSection';

const Content = ({ setLoading, sweetAlerts, screenControl }) => {

  const { table, propsToHeader, propsToFooter, paramsFilter, openModalViewByProject, setOpenModalViewByProject, openModalViewByClassification, setOpenModalViewByClassification, currentItem, rowsSelectedCount } = useTotals({ setLoading, sweetAlerts, screenControl });

  const propsToModalViewByProject = {
    title: 'dialog.totals.viewForProject',
    DialogContent: ModalViewByProject,
    open: openModalViewByProject,
    setOpen: setOpenModalViewByProject,
    maxWidth: 'xl',
    data: {
      currentItem,
      paramsFilter,
      setLoading
    }
  };

  const propsToModalViewByClassification = {
    title: 'dialog.totals.viewForClassification',
    DialogContent: ModalViewByClassification,
    open: openModalViewByClassification,
    setOpen: setOpenModalViewByClassification,
    maxWidth: 'lg',
    data: {
      currentItem,
      paramsFilter,
      setLoading
    }
  }

  return (
    <>
      <HeaderSection {...propsToHeader} />
      <Card>
        <CardContent>
          {rowsSelectedCount > 0 ? <Alert severity="success">{`${rowsSelectedCount} row selected`}</Alert> : ''}
          <XDataGrid {...table} />
        </CardContent>
      </Card>
      <FooterSection {...propsToFooter} />
      <Modal {...propsToModalViewByProject} />
      <Modal {...propsToModalViewByClassification} />
    </>
  )
}

export default Content