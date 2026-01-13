import React, { useEffect, useState } from 'react'
import JumboScrollbar from '@jumbo/components/JumboScrollbar/JumboScrollbar';
import SearchIcon from '@mui/icons-material/Search';
import StyledMenu from 'app/shared/StyledMenu/StyledMenu';
import { FormControl, Grid, Input, InputAdornment, ListSubheader } from '@mui/material';
import { t } from 'i18next';
import Items from './Items';

export const MenuList = ({ itemsList, optSelect, fnExecute = undefined }) => {
  const [selectedIndex, setSelectedIndex] = useState(optSelect);
  const [filteredItemsList, setFilteredItemsList] = useState(itemsList);

  const [searchItem, setSearchItem] = useState('');

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    if (fnExecute !== undefined) {
      fnExecute(index);
    }
  };

  const onInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm)

    const filteredItems = itemsList.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredItemsList(filteredItems);
  }

  useEffect(() => {
    if(itemsList.length>0){
      setFilteredItemsList(itemsList);
    }
  }, [itemsList]);

  useEffect(() => {
    if (optSelect === 0) {
      return;
    }
    setSelectedIndex(optSelect);
  }, [optSelect]);

  return (
    <StyledMenu>
      <Grid container spacing={3} direction='row'>
        <Grid item xs={12} style={{ paddingTop: '28px', paddingBottom: '12px' }}>
          <FormControl variant="standard" sx={{width: '100%'}}>
            <Input
              placeholder={t('menuList.common.search')}
              id="searchItem"
              name='searchItem'
              value={searchItem}
              onChange={onInputChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
      </Grid>
      <JumboScrollbar
        autoHeight
        autoHeightMin={458}
        autoHide
        autoHideDuration={200}
        autoHideTimeout={500}
      >
        {
          filteredItemsList.map((item, index) => {
            if (item.type === 'title') {
              return (
                <ListSubheader key={index} sx={{ lineHeight: '24px' }}>{item.name}</ListSubheader>
              )
            } else {
              return (
                <Items
                  key={`${item.id}-${index}`}
                  name={item.name}
                  qty={item.qty}
                  type={item.type}
                  selected={selectedIndex === item.id}
                  handleListItemClick={(event) => handleListItemClick(event, item.id)}
                />
              )
            }
          })
        }
      </JumboScrollbar>
    </StyledMenu>
  )
}