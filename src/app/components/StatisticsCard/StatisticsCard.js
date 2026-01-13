import React, { useEffect, useState } from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { Typography } from "@mui/material";
import Div from "@jumbo/shared/Div";
import { useTranslation } from "react-i18next";
import PropertiesGraph from "./PropertiesGraph";
import { formatNumber, validFloat, validInt } from 'app/utils/helpers';

const StatisticsCard = ({ title = ' ', cardColor, fillGrapColor, strokecolor, data = [], dark = false }) => {
  const { t } = useTranslation();

  const [percentValue, setPercentValue] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const fnRefreshData = () => {
    const lastItem = data.slice(-1);
    const lastValue = validFloat(lastItem[0].value);
    setPercentValue(lastValue);
    const refreshTotal = data.reduce((prev, curr) => {
      prev += validFloat(curr.value);
      return prev;
    }, 0);
    setTotalData(refreshTotal);
  }

  useEffect(() => {
    fnRefreshData()
  }, [data])

  return (
    <JumboCardQuick
      title={
        <Typography
          variant={"h4"}
          mb={0}
          sx={{ color: dark ? "common.white" : "#37373C", letterSpacing: 1.5 }}
        >
          {t(title)}
        </Typography>
      }
      sx={{ color: "common.white", }}
      bgColor={cardColor ? cardColor : "#9575cd"}
      wrapperSx={{ p: 0, '&:last-child': { p: 0 } }}
    >
      <Div
        sx={{
          p: 3,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          position: 'absolute',
        }}
      >
        <Typography variant={"h2"} color={dark ? "common.white" : "#37373C"}>{formatNumber(totalData, '', 0)}</Typography>
        <Typography variant={"h6"} color={dark ? "common.white" : "#37373C"} mb={0}>{`${percentValue} This Month`}</Typography>
      </Div>
      <PropertiesGraph fillGrapColor={fillGrapColor} strokecolor={strokecolor} data={data} />
    </JumboCardQuick>
  );
};

export default StatisticsCard;
