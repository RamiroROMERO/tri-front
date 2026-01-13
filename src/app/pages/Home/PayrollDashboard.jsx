import React, { useEffect, useState, } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import GroupIcon from '@mui/icons-material/Group';
import CardInfo from 'app/components/CardInfo';
import CardNotifications from 'app/components/CardNotifications';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { ProjectForCustomerItem } from './ProjectForCustomerItem';
import { useTranslation } from 'react-i18next';
// import InputEnterHours from 'app/components/InputEnterHours';

const PayrollDashboard = ({ setLoading, sweetAlerts }) => {

  const { t } = useTranslation();
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalActiveProjects, setTotalActiveProjects] = useState(0);
  const [projectsForStatus, setProjectsForStatus] = useState([]);
  const [employeeForStatus, setEmployeeForStatus] = useState([]);
  const [projectsForCustomers, setProjectsForCustomers] = useState([]);

  const fnGetData = () => {

    setLoading(true);
    request.GET('/dashboard', resp => {
      const { employeesByStatus: employes, projectsByStatus: projects } = resp;
      let lTotalProjects = 0, lTotalEmployees = 0;
      const mapEmployees = employes.map(elem => {
        const newItem = {
          id: elem.qty,
          name: `${elem.qty} - ${elem.status.name}`
        };
        lTotalEmployees += validInt(elem.qty);
        return newItem;
      });
      const mapProjects = projects.map(elem => {
        const newItem = {
          id: elem.qty,
          name: `${elem.qty} - ${elem.status.name}`
        };
        lTotalProjects += validInt(elem.qty);
        return newItem;
      });
      setTotalEmployees(lTotalEmployees);
      setEmployeeForStatus(mapEmployees);
      setProjectsForStatus(mapProjects);
      setLoading(false);
    }, err => {
      setLoading(false);
      console.error(err);
    });

    request.GET(`/projects/getByCustomer?statusId=1`, resp => {
      let totalProjects = 0;
      const { projectsByCustomers } = resp;
      let data3 = projectsByCustomers.map((item) => {
        totalProjects += item.projectsQty;
        return {
          id: item.customer.id,
          value: item.projectsQty,
          name: item.customer.name
        }
      });
      setProjectsForCustomers(data3);
      setTotalActiveProjects(totalProjects);
      setTotalProjects(totalProjects)
      setLoading(false);
    }, err => {
      console.error(err)
      setLoading(false);
    });
  }

  useEffect(() => {

    fnGetData();

  }, [])


  return (
    <>
      <Card>
        <CardContent>
          <Typography variant='h3'>{t("appDashboard.payrollTitle")}</Typography>
        </CardContent>
      </Card>
      <Grid style={{ marginTop: "5px" }} container spacing={3} direction="row">
        <Grid item xs={12} sm={6}>
          <CardInfo
            gradientColorInit="#734242"
            gradientColorEnd="#660404"
            titleNumber={totalProjects}
            titleDescription='Projects'
            icon={<DeveloperBoardIcon sx={{ fontSize: 36 }} />}
            listItems={projectsForStatus}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CardInfo
            gradientColorInit="#7D7D7D"
            gradientColorEnd="#6F6F6F"
            titleNumber={totalEmployees}
            titleDescription='Employees'
            icon={<GroupIcon sx={{ fontSize: 36 }} />}
            listItems={employeeForStatus}
          />
        </Grid>
      </Grid>
      <Grid style={{ marginTop: "5px" }} container spacing={3} direction="row">
        <Grid item xs={12}>
          <CardNotifications title={"card.activeProjects.title"} titleColor="#ffffff" labelChip={totalActiveProjects} colorChip={"primary"}>
            <Grid container spacing={2} direction="row">
              {projectsForCustomers.map((elem, idx) => {
                let idxItemRef = `dash-payroll-prj-item-${Math.random()}-${idx}`;
                return <Grid item xs={6} sm={4} >
                  <ProjectForCustomerItem id={idxItemRef} itemData={elem} />
                </Grid>
              }
              )}
            </Grid>
          </CardNotifications>
        </Grid>
      </Grid>
      {/* <InputEnterHours /> */}
    </>
  );
};

export default PayrollDashboard;