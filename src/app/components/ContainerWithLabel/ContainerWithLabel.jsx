import React from 'react'
import { config } from "../../config/main";

export const ContainerWithLabel = ({label, children, style}) => {
  return (
    <div className='container-with-label' style={{...style, borderColor:config.theme.main.palette.divider}}>
      <span 
        style={{
          backgroundColor:config.theme.main.palette.background.paper,
          '.&after':{background:config.theme.main.palette.background.paper}
        }}
        >{label}</span>
      <div style={{marginTop: '-35px'}}>{children}</div>
    </div>
  )
}
