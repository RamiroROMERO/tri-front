import { useState } from 'react';
import * as XLSX from 'xlsx';


export const useImportXLSX = ({ setData, setHeaders }) => {
  const validExtensions = ".xls, .xlsx";
  const arrValidExtensions = ['xlsx', 'xls'];
  const [nameFile, setNameFile] = useState("");
  const [pathFile, setPathFile] = useState("");
  const [extensionFile, setExtensionFile] = useState("");
  const [file, setFile] = useState("");
  const [dataImport, setDataImport] = useState([]);
  const [headersForTable, setHeadersForTable] = useState([]);
  const [dataForTable, setDataForTable] = useState([]);

  const onChangeFile = ({ target }) => {
    const { value, files } = target;
    const myFile = files[0];
    setFile(value);
    if (myFile) {
      if (arrValidExtensions.includes(myFile.name.split(".").pop())) {
        setPathFile(myFile.path);
        setNameFile(myFile.name);
        setExtensionFile(myFile.name.split(".").pop());
        fnImportXLSX(myFile);
      } else {
        setNameFile("");
        setExtensionFile("");
      }
    } else {
      setNameFile("");
      setExtensionFile("");
    }
  }

  const fnImportXLSX = (file) => {
    const name = file.name;
    const reader = new FileReader();
    reader.onload = (evt) => { // evt = on_file_select event
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const formatData = []
      if (data.length > 0) {
        const headers = data[0];
        setHeadersForTable(headers);
        for (let a = 1; a < data.length; a++) {
          const item = data[a];
          let newItemArr = {};
          headers.map((elem, idx) => {
            newItemArr[elem.toString().replaceAll(" ", "_").toLowerCase()] = item[idx];
          });
          formatData.push(newItemArr);
        }
        setHeaders && setHeaders(headers);
        setData && setData(formatData);
      } else {
        setDataImport([]);
        setHeaders && setHeaders([]);
        setData && setData([]);
      }
    };
    reader.readAsBinaryString(file);
  }

  return (
    {
      validExtensions,
      nameFile,
      pathFile,
      file,
      onChangeFile,
      headersForTable,
      dataForTable,
      fnImportXLSX
    }
  )
}
