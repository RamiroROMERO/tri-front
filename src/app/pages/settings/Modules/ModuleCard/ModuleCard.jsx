import React from 'react'
import styled from "@mui/material/styles/styled";
import { Edit, List, VpnKey } from '@mui/icons-material'
import { ButtonGroup, Card, CardActions, CardContent, Typography, Button } from '@mui/material'

const ActionButton = styled(Button)(({theme}) => ({
  padding: theme.spacing(1.5, 2),
  borderBottom: 'none',
  borderRadius: 0,
  textTransform: 'none',
  letterSpacing: 0,
  borderColor: theme.palette.divider,
  color: theme.palette.text.secondary,

  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderBottom: 'none'
  },
}));

const ModuleCard = ({module, fnEdit, fnChangePrivileges, fnDetail}) => {
  return (
    <Card>
      <CardContent
        sx={{
          pt: 0.50,
          pb: 1.50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography variant={"h4"} mt={1.75} color={"primary.main"}>{module.name}</Typography>
      </CardContent>
      <CardActions sx={{p: 0, mx: '-1px'}}>
        <ButtonGroup size="large" fullWidth variant="outlined">
          <ActionButton onClick={()=>fnEdit(module)}>
            <Edit fontSize={"small"}/>
          </ActionButton>
          <ActionButton onClick={()=>fnDetail(module)}>
            <List fontSize={"small"}/>
          </ActionButton>
          <ActionButton onClick={()=>fnChangePrivileges(module)}>
            <VpnKey fontSize={"small"}/>
          </ActionButton>
        </ButtonGroup>
      </CardActions>
    </Card>
  )
}

export default ModuleCard