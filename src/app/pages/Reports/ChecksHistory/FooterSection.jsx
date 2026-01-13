import { Card, CardContent, Grid, Typography } from "@mui/material";

const FooterSection = ({ totalChecks }) => {

  return (<>

    <Card sx={{ mb: '20px', mt: '20px' }}>
      <CardContent>
        <Grid container direction="row" justifyContent="flex-end" alignItems="center">
          <Typography sx={{ textAlign: 'right' }} variant="h4" component='h4'>
            {`Total: ${totalChecks}`}
          </Typography>
        </Grid>
      </CardContent>
    </Card>

  </>)

}

export default FooterSection;