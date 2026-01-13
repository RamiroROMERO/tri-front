import React from 'react';
import Div from "@jumbo/shared/Div";
import { Link as RouterLink } from 'react-router-dom';
import Link from "@mui/material/Link";
import { ASSET_IMAGES } from "../../utils/constants/paths";


const Logo = ({ mini, mode, sx }) => {
  return (
    <Div sx={{ display: "inline-flex", ...sx }}>
      <Link component={RouterLink} to='/' >
        {
          !mini ?
            <img height="40px" src={mode === "light" ? `${ASSET_IMAGES}/logos/GC Staffing.png` : `${ASSET_IMAGES}/GC Staffing.png`} alt="GC Staffing" />
            :
            <img height="40px" src={mode === "light" ? `${ASSET_IMAGES}/logos/GC Staffing.png` : `${ASSET_IMAGES}/GC Staffing.png`} alt="GC Staffing" />
        }
      </Link>
    </Div>
  );
};

Logo.defaultProps = {
  mode: "light"
};

export default Logo;
