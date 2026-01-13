import { TableCell } from "@mui/material";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import moment from "moment";
import { formatNumber } from "app/utils/helpers";

const TYPE_DATA = ['number', 'currency', 'boolean', 'date']

export const FormatedCell = ({ value, style, dataColumn }) => {

  const { type, format, prefix, decimals } = dataColumn;

  if (!TYPE_DATA.includes(type.toLowerCase())) return (
    <TableCell style={{ ...style }} component="th" scope='row'>
      {value}
    </TableCell>
  );

  if (type.toLowerCase() === 'number') {
    let formatData = formatNumber(value, '', decimals || 4);
    return (
      <TableCell style={{ ...style }} component="th" scope='row' align="right">
        {formatData}
      </TableCell>
    )
  }
  if (type.toLowerCase() === 'currency') {
    let formatData = formatNumber(value, prefix || '', decimals || 4);
    return (
      <TableCell style={{ ...style }} component="th" scope='row' align="right">
        {formatData}
      </TableCell>
    )
  }

  if (type.toLowerCase() === 'date') {
    let valueDate = ''
    if (value && typeof value.getDate === 'function') {
      valueDate = moment(value.toJSON().substring(0, 10), "YYYY-MM-DD").format(format || "MM/DD/YYYY");
    } else {
      valueDate = moment(value).format(format || "MM/DD/YYYY");
    }
    return (<TableCell style={{ ...style }} component="th" scope='row' >
      {valueDate}
    </TableCell>)
  }

  if (type.toLowerCase() === 'boolean') {
    if (value === 1 || value === true) return (
      <TableCell style={{ ...style }} component="th" scope='row' align="center">
        <CheckBoxIcon color="disabled" />
      </TableCell>
    )

    return (
      <TableCell style={{ ...style }} component="th" scope='row' align="center">
        <CheckBoxOutlineBlankIcon color="disabled" />
      </TableCell>
    )
  }

}
