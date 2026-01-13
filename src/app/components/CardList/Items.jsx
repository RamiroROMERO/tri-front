import React from 'react'
import { Avatar, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { ChevronRight } from '@mui/icons-material';
import ListItemButton from "@mui/material/ListItemButton";

const Items = ({ item, selectedIndex, onChangeItem }) => {

  return (
    <ListItemButton component={"li"}
      sx={{
        p: theme => theme.spacing(1, 1),
        borderLeft:selectedIndex === item.id?"4px solid":"none",
        borderColor: (theme)=> theme.palette.primary.light
      }}
      selected={selectedIndex === item.id}
      onClick={onChangeItem}
    >
      <ListItemAvatar sx={{marginRight: '-18px'}}>
        <Avatar alt={item.name} sx={{ color: 'common.white', bgcolor: (theme)=> theme.palette.primary.main, width: 24, height: 24}}>
          <ChevronRight/>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant='h5' mb={.5}>{item.name}</Typography>}
      />
    </ListItemButton>
  )
}

export default Items