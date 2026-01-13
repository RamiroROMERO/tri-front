import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
// import { statisticsGraphData } from "./data";
import Div from "@jumbo/shared/Div";

const PropertiesGraph = ({ color, strokecolor, fillGrapColor, data }) => {
  return (
    <ResponsiveContainer width="100%" height={95}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Tooltip
          labelStyle={{ color: 'black' }}
          cursor={false}
          content={data => (
            data.payload[0]
              ?
              <Div sx={{ color: "common.white" }}>
                {`price: ${data.payload[0].value}`}
              </Div>
              : null
          )}
          wrapperStyle={{
            background: color || 'rgba(0,0,0,.8)',
            padding: '5px 8px',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
          }}
        />
        <Area dataKey="value"
          strokeWidth={1}
          stroke={strokecolor || "#c7a4ff"}
          fill={fillGrapColor || "#7e57c2"}
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PropertiesGraph;
