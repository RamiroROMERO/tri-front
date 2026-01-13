import React from 'react';
import { Card, CardActions, CardContent, Divider, Grid, List, ListItem, ListItemText, Typography, useMediaQuery } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Div from "@jumbo/shared/Div";

const CardInfo = ({ gradientColorInit, gradientColorEnd, icon, titleNumber = "160", titleDescription = "Employees", listItems = [] }) => {

  const showCarDetails = useMediaQuery('(min-width:720px)');


  const propsIconContainer = {
    display: 'flex',
    width: 126,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'common.white',
    borderRadius: '50%',
    outline: 'solid 10px rgba(255, 255, 255, 0.2)',
    margin: '0 10px 0 -60px',
    paddingRight: '15px'
  };

  const propsIcon = {
    display: 'flex',
    minWidth: 56,
    height: 56,
    mr: '6px',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Card sx={{ height: 115, backgroundImage: `linear-gradient(135deg, ${gradientColorInit}, ${gradientColorEnd})` }}>
      <CardActions disableSpacing sx={{ p: 0, alignItems: 'stretch', height: '100%' }}>
        <Div sx={
          { ...propsIconContainer }
        }>
          <Div sx={{ propsIcon }}>
            {/* <FolderOpenIcon sx={{ fontSize: 36 }} /> */}
            {icon}
          </Div>

        </Div>
        <CardContent sx={{ p: 2.5, flex: 1, alignSelf: 'center' }}>
          <Grid container direction="row" justifyContent="center" alignItems="center" >
            <Grid item xs={showCarDetails ? 4 : 12}>
              <Typography variant={"h3"} color={"common.white"}>{titleNumber}</Typography>
              <Typography variant={"h5"} color={"common.white"} mb={0}>{titleDescription}</Typography>
            </Grid>
            {showCarDetails && (<Grid item xs={8}>
              <Divider variant="middle" flexItem orientation="vertical" />
              <List dense >
                {listItems.map((elem, index) => {
                  <ListItem id={(Math.random() * 10000) + "" + index}>
                    {/* <ListItemText classes="primary"> {elem.name} </ListItemText> */}
                    <Typography variant={"h6"} color={"common.white"}>{elem.name}</Typography>
                  </ListItem>
                })}
              </List>
            </Grid>)}
          </Grid>
        </CardContent>
      </CardActions>
    </Card>
  );
};

export default CardInfo;
