import React, { useEffect, useState } from 'react'
import { Grid, IconButton, Typography } from '@mui/material'
import JumboSearch from '@jumbo/components/JumboSearch'
import { MenuColumns } from './MenuColumns';

export const HeaderDataTable = ({ title, data, fieldsToSearch = [], setDataSearch, freeActions = [], setCountDataSearch = undefined, buttonShowHideColumns = false, changeColumns = undefined, columns = [] }) => {

  const [textSearch, setTextSearch] = useState('');
  const onSearch = (newValue) => {
    setTextSearch(newValue);
  };

  useEffect(() => {

    if (textSearch === "") {
      setDataSearch(data);
      setCountDataSearch(data.length);
    } else {
      let dataFilter = data.filter(elem => {
        let exist = false
        fieldsToSearch.map(item => {
          if (elem[item] !== undefined && elem[item] !== null) {
            if (elem[item].toString().toLowerCase().includes(textSearch.toLowerCase())) {
              exist = true;
            }
          }
          return exist;
        });
        return exist;
      });
      setDataSearch(dataFilter);
      if (setCountDataSearch) {
        setCountDataSearch(dataFilter.length);
      }
    }
  }, [textSearch]);

  return (
    <>
      <Grid container spacing={2} sx={{ p: '20px 10px 10px 10px' }} >
        {(title && title.length > 0) && (<Grid item xs={12} sm={6}>
          <Typography variant={"h4"}>{title}</Typography>
        </Grid>)}
        <Grid item xs={12} sm={(title && title.length > 0) ? 6 : 12}>
          <Grid
            container direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <JumboSearch onChange={onSearch} value={textSearch} sx={{ maxWidth: '280px' }} />
            {buttonShowHideColumns && (
              <MenuColumns columns={columns} changeShowColum={changeColumns} />
            )}
            {freeActions.map((elem, key) => {
              const { label, Icon, onClick, color = 'primary', disabled = false } = elem;
              return (
                <IconButton key={`freeActionsTable-${key}`} color={color} variant='outlined' aria-label={label} onClick={onClick} disabled={disabled}>
                  <Icon />
                </IconButton>)
            })}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
