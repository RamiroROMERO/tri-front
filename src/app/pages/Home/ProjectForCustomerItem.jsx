import { Chip, Divider, ListItem, ListItemText, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

export const ProjectForCustomerItem = ({ itemData }) => {

  const { id } = itemData;
  const navigate = useNavigate();

  const fnClickItem = () => {
    localStorage.setItem('st-prj-customerId', itemData.id);
    navigate('/process/projects');
  }

  return (
    <>
      <ListItem>
        <ListItemText>
          <Typography variant='h5' >{itemData.name}</Typography>
        </ListItemText>
        <Chip label={itemData.value} onClick={fnClickItem} color={"secondary"} />
      </ListItem>
      <Divider />
    </>
  )
}
