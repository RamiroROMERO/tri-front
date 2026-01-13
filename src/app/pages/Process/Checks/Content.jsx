import React from 'react'
import { Alert, Button, Card, CardContent, Grid } from '@mui/material';
import { XDataGrid } from 'app/components/XDataGrid';
import { Modal, SimpleSelect } from 'app/components';
import { ModalViewDetail } from './ModalViewDetail';
import { ModalGenerateChecks } from './ModalGenerateChecks';
import { useChecks } from './useChecks'
import FilterChecks from './FilterChecks';
import FooterTotals from './FooterTotals';
import { useTranslation } from 'react-i18next';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { ModalExportChecks } from './ModalExportChecks';

const Content = ({ setLoading, sweetAlerts, screenControl, controlAdmin }) => {

  const { t } = useTranslation();

  const { propsToFilterChecks, table, currentItem, openModalViewDetail, setOpenModalViewDetail, openModalGenerateChecks, setOpenModalGenerateChecks, rowsSelected, detailData, listBanks, quickBookCompany, endDate, setTableRowsSelected, rowsSelectedCount, checkTotals, expenseSelected, formFilterState, onFilterChange, ciaAccountList, projectList, onFilterReset, openModalExportChecks, setOpenModalExportChecks, columnsExportList } = useChecks({ setLoading, sweetAlerts, screenControl });

  const propsToModalViewDetail = {
    title: 'dialog.detailChecks.title',
    DialogContent: ModalViewDetail,
    open: openModalViewDetail,
    setOpen: setOpenModalViewDetail,
    maxWidth: 'sm',
    data: {
      currentItem
    }
  };

  const propsToModalGenerateChecks = {
    title: 'dialog.generateChecks.title',
    DialogContent: ModalGenerateChecks,
    open: openModalGenerateChecks,
    setOpen: setOpenModalGenerateChecks,
    maxWidth: 'lg',
    data: {
      rowsSelected,
      detailData,
      listBanks,
      quickBookCompany,
      endDate,
      setTableRowsSelected,
      sweetAlerts,
      controlAdmin,
      expenseSelected
    }
  };

  const propsToModalExport = {
    title: 'action.exportToExcel',
    DialogContent: ModalExportChecks,
    open: openModalExportChecks,
    setOpen: setOpenModalExportChecks,
    maxWidth: 'md',
    data: {
      rowsSelected,
      detailData,
      columnsExportList
    }
  }

  const { ciaAccount, deliveryType, projectName } = formFilterState;

  return (
    <>
      <FilterChecks {...propsToFilterChecks} />
      <Card>
        <CardContent>
          <Grid container spacing={3} direction='row'>
            <Grid item xs={12} sm={6} md={3}>
              <SimpleSelect
                label={t('table.employees.column.ciaAccount')}
                name='ciaAccount'
                value={ciaAccount}
                optionList={ciaAccountList}
                onChange={onFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SimpleSelect
                label={t('table.common.deliveryType')}
                name='deliveryType'
                value={deliveryType}
                optionList={[
                  { value: '', label: 'Seleccione...' },
                  { value: 'Deposit', label: 'Deposit' },
                  { value: 'Send', label: 'Send' }
                ]}
                onChange={onFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SimpleSelect
                label={t('table.common.project')}
                name='projectName'
                value={projectName}
                optionList={projectList}
                onChange={onFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button onClick={onFilterReset} variant='contained' startIcon={<FilterListOffIcon />}> {t("button.clear")} </Button>
            </Grid>
          </Grid>
          <hr />
          {rowsSelectedCount > 0 ? <Alert severity="success">{`${rowsSelectedCount} row selected`}</Alert> : ''}
          <XDataGrid {...table} />
        </CardContent>
      </Card>
      <FooterTotals totals={checkTotals} />
      <Modal {...propsToModalViewDetail} />
      <Modal {...propsToModalGenerateChecks} />
      <Modal {...propsToModalExport} />
    </>
  )
}

export default Content