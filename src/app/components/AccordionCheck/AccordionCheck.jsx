import React, { useState, useEffect } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Icon, Divider, FormControlLabel, Grid, Checkbox } from '@mui/material'

const AccordionCheck = props => {
  const { list=[], listSelected = [], setList = [], setListSelected = [], fnOptionsChange = 'null', title = "", t } = props;

  const [changeCheckAll, setChangeCheckAll] = useState(true);

  const handleSelectedAll = e => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setChangeCheckAll(value);
    let listChange = Object.keys(list).map((key) => {
      return {
        id: list[key].id,
        name: list[key].name,
        selected: value
      }
    });
    const list2 = listChange.reduce((acc, cur) => {
      acc[cur.name] = cur;
      return acc;
    }, {});
    setList(list2);
    setListSelected([]);
    if (fnOptionsChange !== null) {
      fnOptionsChange(list2);
    }
  }

  const handleCheckChange = e => {
    list[e.target.name].selected = !list[e.target.name].selected
    setList(list);
    if (fnOptionsChange !== null) {
      fnOptionsChange(list);
    }
  }

  useEffect(() => {
    let isSelected = false;
    Object.keys(list).map((key) => {
      if (list[key].selected) {
        isSelected = true;
      }
      return key;
    });
    setChangeCheckAll(isSelected);
  }, [list])

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<Icon >expand_more</Icon>}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{title} </Typography>
        <Typography sx={{ ml: 2 }} color="text.secondary">
          ({listSelected.length}/{Object.keys(list).length} {t("table.payroll.accordionCountSelect")})
        </Typography>
      </AccordionSummary>
      <Divider />
      <AccordionDetails>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={12} sm={12} style={{ textAlign: 'end' }}>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked='true'
                  checked={changeCheckAll}
                  onChange={handleSelectedAll}
                />
              }
              label='Selected All'
            />
          </Grid>
        </Grid>
        <Divider sx={{mt: 1, mb: 2}}/>
        <Grid container direction="row" spacing={1}>
          {
            Object.keys(list).map((key, idx) => {
              return (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={idx}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={list[key].selected}
                        onChange={handleCheckChange}
                        name={key}
                        id={list[key].id.toString()}
                      />
                    }
                    label={key}
                  />
                </Grid>
              )
            })
          }
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default AccordionCheck