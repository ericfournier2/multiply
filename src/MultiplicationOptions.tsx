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
import type { MultiplicationOptions } from "./Modes"
import { MinAndMax, TableSelect } from "./OptionsControls";

type MultiplicationOptionsControlProps = {
  options: MultiplicationOptions,
  onChange: (options: MultiplicationOptions) => void
}

function MultiplicationOptionsControl({options, onChange} : MultiplicationOptionsControlProps) {
  const onChangeMinMax = (min: number, max: number) => {
    const newOptions = {...options}
    newOptions.minNumber = min;
    newOptions.maxNumber = max;
    onChange(newOptions)
  }

  const handleTableChange = (tables: Array<number>) => {
    const newOptions = {...options}
    newOptions.tables = tables;
    onChange(newOptions)
  }

  const handleUseTableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = {...options}
    newOptions.useTables = event.target.checked;
    onChange(newOptions)
  }

  const handleIncludeZeroAndOneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = {...options}
    newOptions.excludeZeroAndOne = !event.target.checked;
    onChange(newOptions)
  }

  return(<>
      <MinAndMax min={options.minNumber} max={options.maxNumber} onChange={onChangeMinMax} />
      <FormControlLabel control={<Switch checked={options.excludeZeroAndOne} onChange={handleIncludeZeroAndOneChange} />} label="Inclure les multiplications par zéro et par un" />
      <FormControlLabel control={<Switch checked={options.useTables} onChange={handleUseTableChange} />} label="Utiliser les tables" />
      <TableSelect tables={options.tables} disabled={!options.useTables} onChange={handleTableChange} />
    </>
  );
}

export { MultiplicationOptionsControl };