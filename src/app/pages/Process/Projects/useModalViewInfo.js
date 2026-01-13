import { useEffect, useState } from "react";
import { request } from "app/utils/core";

const useModalViewInfo = ({ setLoading, currentItem }) => {

  const [projectData, setProjectData] = useState({});
  const [employeeList, setEmployeeList] = useState([]);

  const getProjectData = () => {

    setLoading(true);
    const projectId = currentItem.id || 0

    request.GET(`/projects/findInfo/${projectId}`, data => {
      setProjectData(data.dataProject);
      setEmployeeList(data.dataProject.employees);
      setLoading(false);
    }, err => {
      setLoading(false);
      console.error(err);
    });

  }

  useEffect(() => {
    getProjectData();
  }, [])

  return {
    projectData,
    employeeList
  }

}

export default useModalViewInfo;