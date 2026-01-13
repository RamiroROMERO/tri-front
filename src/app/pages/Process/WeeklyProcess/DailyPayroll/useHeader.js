import { request } from 'app/utils/core';
import React, { useEffect, useState } from 'react'

export const useHeader = ({ complData, setLoading }) => {

  useEffect(() => {
    setComplementaryData(complData);
    setJobReference(complData.jobReference || '');
    setJobPO(complData.jobPo || '')
  }, [complData])

  const [complementaryData, setComplementaryData] = useState({});
  const [jobReference, setJobReference] = useState('');
  const [jobPO, setJobPO] = useState('')

  const fnSaveComplementaryData = () => {
    const newData = { jobReference, jobPo: jobPO }
    request.PUT(`/weeklyPayrollSupplies/${complementaryData.id}`, newData, (res) => { },
      err => {
        console.error(err)
      })
  }
  return {
    jobReference,
    jobPO,
    setJobReference,
    setJobPO,
    fnSaveComplementaryData
  }
}
