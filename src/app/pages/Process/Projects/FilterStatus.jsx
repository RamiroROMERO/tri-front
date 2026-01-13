import React from 'react';
import CardIconText from "@jumbo/shared/CardIconText";
import { Grid } from "@mui/material";
import { Check, DoneAll, FactCheck, HistoryToggleOff, PausePresentation, PendingActions, Schedule, Task } from '@mui/icons-material';
import { validInt } from 'app/utils/helpers';

const FilterStatus = ({ t, noRecords1, noRecords2, noRecords3, customerId, yearId, fnGetProjects }) => {

  const total = validInt(noRecords1) + validInt(noRecords2) + validInt(noRecords3);

  const fnChangeStatus = (e, id) => {
    fnGetProjects(customerId, yearId, id);
  }

  return (
    <>
      <Grid container spacing={3} direction='row'>
        <Grid item xs={12} sm={6} lg={3} xl={3}>
          <CardIconText
            icon={<PendingActions fontSize={"large"} />}
            onHoverIcon={<Schedule fontSize={"large"} />}
            title={`${noRecords1}`}
            subTitle={t('table.projects2.filter.inProgress')}
            onClick={(e) => { fnChangeStatus(e, 1) }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} xl={3}>
          <CardIconText
            icon={<PausePresentation fontSize={"large"} />}
            onHoverIcon={<HistoryToggleOff fontSize={"large"} />}
            title={`${noRecords3}`}
            subTitle={t('table.projects2.filter.paused')}
            color={"error.main"}
            onClick={(e) => { fnChangeStatus(e, 3) }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} xl={3}>
          <CardIconText
            icon={<Task fontSize={"large"} />}
            onHoverIcon={<Check fontSize={"large"} />}
            title={`${noRecords2}`}
            subTitle={t('table.projects2.filter.finalized')}
            color={"success.main"}
            onClick={(e) => { fnChangeStatus(e, 2) }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} xl={3}>
          <CardIconText
            icon={<FactCheck fontSize={"large"} />}
            onHoverIcon={<DoneAll fontSize={"large"} />}
            title={`${total}`}
            subTitle={t('table.common.total')}
            color={"secondary.main"}
            onClick={(e) => { fnChangeStatus(e, 0) }}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default FilterStatus