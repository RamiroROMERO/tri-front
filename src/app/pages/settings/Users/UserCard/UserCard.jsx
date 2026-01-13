import React from 'react';
import {ButtonGroup, Card, CardActions, CardContent, Typography, Button, Avatar, Badge, CardHeader} from "@mui/material";
import {Edit, ManageAccounts, VpnKey } from '@mui/icons-material';
import styled from "@mui/material/styles/styled";
import Div from "@jumbo/shared/Div";

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

const UserProfileCard = ({user, fnEdit, fnChangePass, fnDetail}) => {
  return (
    <Card>
      <CardHeader>
      </CardHeader>
      <CardContent sx={{
        pt: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Div sx={{mb: 3}}>
          <Badge overlap="circular" variant="dot"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            sx={{
              '.MuiBadge-badge': {
                border: '2px solid #FFF',
                height: '14px',
                width: '14px',
                borderRadius: '50%',
                bgcolor: user.status ? "success.main" : "#757575"
              }
            }}
          >
            <Avatar sx={{width: 72, height: 72}} alt={`${user.name}`} src={user.profilePic}/>
          </Badge>
        </Div>
        <Typography variant={"h5"} mb={.75}>{`${user.name}`}</Typography>
        <Typography variant={"h6"} color="text.secondary" mb={.5}>{user.userType}</Typography>
        <Typography fontSize={"12px"} variant={"body1"} color="text.secondary" mb={2}>{user.userName}</Typography>
      </CardContent>
      <CardActions sx={{p: 0, mx: '-1px'}}>
        <ButtonGroup size="large" fullWidth variant="outlined">
          <ActionButton onClick={()=>fnEdit(user)}>
            <Edit fontSize={"small"}/>
          </ActionButton>
          <ActionButton onClick={()=>fnChangePass(user)}>
            <VpnKey fontSize={"small"}/>
          </ActionButton>
          <ActionButton onClick={()=>fnDetail(user)}>
            <ManageAccounts fontSize={"small"}/>
          </ActionButton>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default UserProfileCard;