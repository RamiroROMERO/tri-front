import React from 'react'
import Items from './Items'
import {Grid, List} from "@mui/material";

const ListItems = ({dataList, selectedIndex, setSelectedIndex}) => {

  const onChangeItem = (id) => {
    setSelectedIndex(id);
  };

  return (
    <List disablePadding>
      <Grid container spacing={1} direction="row">
      {
        dataList.map((item, index) => (
          <Grid item xs={12} sm={6} md={12} key={index}>
            <Items item={item} key={index} selectedIndex={selectedIndex} onChangeItem={()=>onChangeItem(item.id)}/>
          </Grid>
        ))
      }
      </Grid>
    </List>
  )
}

export default ListItems