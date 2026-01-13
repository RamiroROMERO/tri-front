// import { useState } from "react"
import { useFilter } from "./useFilter"
import { Button, Card, CardActions, CardContent, Grid } from "@mui/material";
import { SimpleSelect } from "app/components/SimpleSelect";
import { SearchSelect } from "app/components/SearchSelect";
import FilterListIcon from '@mui/icons-material/FilterList';
import { ImportExport } from "@mui/icons-material";

export const Filter = ({ setLoading, fnGetData, t, setTableData, tableData }) => {

  const { noYear, noWeek, yearList, weekList, customerId, customerList, onInputChange, fnRefreshData, onChangeCustomerId, onChangeYearId, fnExportToXLSX } = useFilter({ setLoading, fnGetData, setTableData, tableData });

  return (
    <>
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container sx={{ mt: 2 }}>
                <Grid item xs={12} md={6} sx={{ p: 1 }}>
                  <SearchSelect
                    label={t("table.common.customer")}
                    name="customerId"
                    value={customerId}
                    onChange={onChangeCustomerId}
                    optionList={customerList}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={2} sx={{ p: 1 }}>
                  <SimpleSelect
                    label={t("table.common.year")}
                    name="noYear"
                    value={noYear}
                    onChange={onChangeYearId}
                    optionList={yearList}
                  />
                </Grid>
                <Grid item xs={12} sm={8} md={4} sx={{ p: 1 }}>
                  <SearchSelect
                    label={t("table.common.week")}
                    name="noWeek"
                    value={noWeek}
                    onChange={onInputChange}
                    optionList={weekList}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                <Button startIcon={<ImportExport />} color="secondary" variant="contained" onClick={fnExportToXLSX}>{t("button.export")}</Button>
                <Button sx={{ ml: 2 }} startIcon={<FilterListIcon />} color="primary" variant="contained" onClick={fnRefreshData}>{t("button.filter")}</Button>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </Grid >
    </>
  );

}