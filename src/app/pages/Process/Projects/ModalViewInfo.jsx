import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography, Chip, List, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Accordion, AccordionSummary, AccordionDetails, Badge } from '@mui/material'
import { ExitToApp, Group, LocationOn, DateRange, Event, LocationCity, Draw, ArrowDropDown, Person } from '@mui/icons-material';
import ListItemInfo from './ViewInfo/ListItemInfo';
import moment from 'moment';
import useModalViewInfo from './useModalViewInfo';
// import GroupIcon from '@mui/icons-material/Group';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import DateRangeIcon from '@mui/icons-material/DateRange';

export const ModalViewInfo = ({ setOpen, data, t }) => {
  const { setLoading, currentItem } = data;

  const { projectData, employeeList } = useModalViewInfo({ setLoading, currentItem });

  return (
    <>
      <DialogContent dividers>
        <Card>
          <CardContent>
            <Grid container spacing={3} direction={'row'}>
              <Grid item xs={12} md={8}>
                <Typography variant='h4' component="h4">
                  {`${currentItem.code} - ${currentItem.name}`}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} alignItems="right">
                <Chip label={currentItem.status.name} variant="filled" color={currentItem.statusId == 3 ? "error" : currentItem.statusId == 2 ? "success" : "info"} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <List
              disablePadding
              sx={{
                display: "flex",
                flexWrap: "wrap",
                margin: (theme) => theme.spacing(0, -2),
              }}
            >
              <ListItemInfo iconList={<LocationCity />} title="Customer" description={currentItem.customer.name} />
              <ListItemInfo iconList={<Draw />} title="Contract Number" description={currentItem.contractNumber} />
              <ListItemInfo iconList={<LocationOn />} title="Location" description={currentItem.location.name} />
              <ListItemInfo iconList={<Event />} title="Start Date" description={moment(currentItem.startDate).format("MM/DD/YYYY")} />
              <ListItemInfo iconList={<Group />} title="Employees in Project" description={projectData?.employees?.length || 0} />
              <ListItemInfo iconList={<DateRange />} title="Weeks Works" description={currentItem.qtyWeeks} />
            </List>
          </CardContent>
        </Card>
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary
            expandIcon={<ArrowDropDown />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Grid container>
              <Grid item xs={12} md={10} direction={'row'} alignItems={'flex-end'}>
                <Typography variant='h5' component={'h5'}>
                  Employees in Project
                </Typography>
              </Grid>
              <Grid item xs={0} md={2} sx={{ alignContent: 'right', alignItems: 'right' }}>
                <Badge badgeContent={projectData?.employees?.length || 0} color="primary">
                  <Person color="success" />
                </Badge>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            {employeeList.length > 0 && (<Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeList.map(emp => <TableRow>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.code}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                </TableRow>)}
              </TableBody>
            </Table>)}
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
      </DialogActions>
    </>
  )
}