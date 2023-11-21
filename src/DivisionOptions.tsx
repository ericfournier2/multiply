import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import type { DivisionOptions } from "./Modes"
import { MinAndMax, TableSelect } from "./OptionsControls";

type DivisionOptionsControlProps = {
  options: DivisionOptions,
  onChange: (options: DivisionOptions) => void
}

function DivisionOptionsControl({options, onChange} : DivisionOptionsControlProps) {
  const onChangeMinMax = (min: number, max: number) => {
    const newOptions = {...options}
    newOptions.maxNumber = max;
    onChange(newOptions)
  }

  const handleTableChange = (tables: Array<number>) => {
    const newOptions = {...options}
    newOptions.tables = tables;
    onChange(newOptions)
  }

  const handleIncludeOneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = {...options}
    newOptions.excludeOne = !event.target.checked;
    onChange(newOptions)
  }

  return(<>
      <MinAndMax min={1} max={options.maxNumber} onChange={onChangeMinMax} />
      <FormControlLabel control={<Switch checked={options.excludeOne} onChange={handleIncludeOneChange} />} label="Inclure les divisions par un" />
      <TableSelect tables={options.tables} onChange={handleTableChange} />
    </>
  );

}

export {DivisionOptionsControl};