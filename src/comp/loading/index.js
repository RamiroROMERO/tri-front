import React from 'react'
// import { Spinner } from 'react-bootstrap'
import { CircularProgress } from "@mui/material";
import './loading.css'

const Loading = ({ show }) => {
  return (
    <>{
      show ?
        <div id="loading-backdrop">
          <CircularProgress
            color='info'
          />
        </div>
        : null
    }</>
  )
}

export default Loading
