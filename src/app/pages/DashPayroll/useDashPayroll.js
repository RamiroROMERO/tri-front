import React, { useEffect, useState } from 'react'

export const useDashPayroll = () => {

  const [onLoading, setOnLoading] = useState(false);

  useEffect(() => {
    // setOnLoading(true);
  }, [])

  return {
    onLoading
  }
}
