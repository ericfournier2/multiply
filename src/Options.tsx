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

type GameOptions = {
  minNumber: number,
  maxNumber: number,
  useTables: boolean,
  tables: Array<number>,
  timeLimit: number,
  excludeZeroAndOne: boolean
}

const defaultGameOptions: GameOptions = {
  minNumber: 2,
  maxNumber: 10,
  useTables: true,
  tables: [2, 3, 5, 10],
  timeLimit: 1,
  excludeZeroAndOne: true
}

type MinMaxProps = {
  min: number, 
  max: number,
  onChange: (min: number, max: number) => void,
}

const MinAndMax = ({min, max, onChange}: MinMaxProps) => {
  return (
    <>
      <Stack spacing={2} direction="row">
        De: <Button variant="outlined"  onClick={ () => {onChange(min-1, max)} }>-</Button>
        {min}<Button variant="outlined"  disabled={min==max} onClick={ () => {onChange(min+1, max)} }>+</Button>
      </Stack>
      <Stack spacing={2} direction="row">
        À: <Button variant="outlined" disabled={min==max} onClick={ () => {onChange(min, max - 1)} }>-</Button>
        {max}<Button variant="outlined"  onClick={ () => {onChange(min, max + 1)} }>+</Button>
      </Stack>
    </>
  );
}

type OptionsProps = {
  options: GameOptions,
  onChange: (options: GameOptions) => void
}

function Options({options, onChange} : OptionsProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeMinMax = (min: number, max: number) => {
    const newOptions = {...options}
    newOptions.minNumber = min;
    newOptions.maxNumber = max;
    onChange(newOptions)
  }

  const handleTableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tableNumberStr = event.target.name.split("_").pop()
    if(tableNumberStr) {
      const tableNumber = parseInt(tableNumberStr)

      const newOptions = {...options}
      if(event.target.checked && !newOptions.tables.includes(tableNumber)) {
        newOptions.tables.push(tableNumber)
        onChange(newOptions)
      } else if(!event.target.checked && newOptions.tables.includes(tableNumber)) {
        newOptions.tables = newOptions.tables.filter((x) => x != tableNumber)
        onChange(newOptions)
      }
    }
  };

  const tableCheckboxes = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x) => <FormControlLabel
    control={
      <Checkbox disabled={!options.useTables} 
                checked={options.tables.includes(x)} 
                onChange={handleTableChange} 
                name={"tablecheckbox_" + x} />
    }
    label={x}
    labelPlacement="bottom"
  />);

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

  const handleTimeLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const intValue = parseInt(event.target.value)
    if(intValue) {
      const newOptions = {...options}
      newOptions.timeLimit = intValue;
      onChange(newOptions)
    }
  }

  return(
    <>
      <Button onClick={handleClickOpen} color="inherit" size="large">
        <MenuIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Options</DialogTitle>
        <DialogContent>
          <MinAndMax min={options.minNumber} max={options.maxNumber} onChange={onChangeMinMax} />
          <FormControlLabel control={<Switch checked={!options.excludeZeroAndOne} onChange={handleIncludeZeroAndOneChange} />} label="Inclure les multiplications par zéro et par un" />
          <FormControlLabel control={<Switch checked={options.useTables} onChange={handleUseTableChange} />} label="Utiliser les tables" />
          <FormGroup row>
            {tableCheckboxes}
          </FormGroup>
          <TextField label="Nombre de minutes" value={options.timeLimit} onChange={handleTimeLimitChange} inputProps={{ pattern: "[0-9]+" }}/>          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Appliquer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export {Options, defaultGameOptions};
export type {GameOptions};