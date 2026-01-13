import React from 'react'
import Grid from "@mui/material/Grid";
import InfoUser from './Components/InfoUser';
import InfoPassword from './Components/InfoPassword';

const UserProfileSidebar = ({t, currentItem, typeUser, userId, sweetAlerts, setLoading}) => {

  const propsToInfoUser = {
    t,
    currentItem,
    typeUser
  }

  const propsToInfoPass = {
    t,
    idUser: userId,
    sweetAlerts,
    setLoading
  }

  return (
    <Grid container spacing={3.75} direction="row">
      <Grid item xs={12} sm={5} lg={12}>
        <InfoUser {...propsToInfoUser}/>
      </Grid>
      <Grid item xs={12} sm={7} lg={12}>
        <InfoPassword {...propsToInfoPass}/>
      </Grid>
    </Grid>
  )
}

export default UserProfileSidebar