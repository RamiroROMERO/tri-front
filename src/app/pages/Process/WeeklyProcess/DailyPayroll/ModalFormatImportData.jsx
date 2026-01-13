import { useState } from "react";
import { Button, DialogActions, DialogContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import ExitToApp from "@mui/icons-material/ExitToApp"
import MemoryIcon from '@mui/icons-material/Memory';
import { SimpleSelect } from "app/components/SimpleSelect";
import { useModalFormatImportData } from "./useModalFormatImportData";
import { RadioButtonsGroup } from "app/components/RadioButtonsGroup";

export const ModalFormatImportData = ({setOpen, data, t}) => {

  const {
    employeeSearchType,
    setEmployeeSearchType,
    colNameEmployee,
    setColNameEmployee,
    colClassEmployee,
    setColClassEmployee,
    columnsToData,
    fnProcessImportData
  } = data;

  const {columnsTable, fnChangeFormatColumnFields} = useModalFormatImportData({data});

  const fnValidAndProcessData = ()=>{

    if(colNameEmployee === ''){
      return
    };
    if(colClassEmployee === ''){
      return;
    }

    const filterEmpty = columnsToData.filter(elem=>elem.field === '');
    if(filterEmpty.length>0){
      return;
    }
    fnProcessImportData();
  }

  return (
    <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
        <RadioButtonsGroup
          label='Employee for:'
          name="employeeSearchType"
          value={employeeSearchType}
          onChange={({target})=>setEmployeeSearchType(target.value)}
          options={[
            {id: 1, name: 'For Code'},
            {id: 2, name: 'For PERNR'},
            {id: 3, name: 'For Name'},
          ]}
          row
        />
        </Grid>
      </Grid>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12} >
          <SimpleSelect
            label={t("table.dailiesPayrolls.column.fieldToSearch")}
            id={"colNameEmployee"}
            name={"colNameEmployee"}
            value={colNameEmployee}
            onChange={({target})=>setColNameEmployee(target.value)}
            optionList={columnsTable}
          />
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <SimpleSelect
            label={t("table.activeEmployees.column.classification")}
            id={"colClassEmployee"}
            name={"colClassEmployee"}
            value={colClassEmployee}
            onChange={({target})=>setColClassEmployee(target.value)}
            optionList={columnsTable}
          />
        </Grid> */}
      </Grid>
      <hr/>
      <Typography variant="h4" component={'h4'}> Format Columns </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell> Description </TableCell>
            <TableCell> Field </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {columnsToData.filter(elem=>elem.showNormalize).map(elem=>{
            return <TableRow>
              <TableCell>
                {elem.title}
              </TableCell>
              <TableCell>
              <SimpleSelect
                label={elem.title}
                id={elem.name}
                name={elem.name}
                value={elem.field}
                onChange={fnChangeFormatColumnFields}
                optionList={columnsTable}
              />
              </TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>
    </DialogContent>
    <DialogActions>
    <Button startIcon={<MemoryIcon />} onClick={fnValidAndProcessData} color='primary' variant='contained'>
        {t('button.process')}
      </Button>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
    </DialogActions>
    {/* <ModalConfirm {...propsToModalConfirm}/> */}
  </>    
  )
}
