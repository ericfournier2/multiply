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
import type { GameOptions } from "./Modes"

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
    if(newOptions.multiplicationOptions) {
      newOptions.multiplicationOptions.minNumber = min;
      newOptions.multiplicationOptions.maxNumber = max;
      onChange(newOptions)
    }
  }

  const handleTableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tableNumberStr = event.target.name.split("_").pop()
    if(tableNumberStr) {
      const tableNumber = parseInt(tableNumberStr)

      const newOptions = {...options}
      if(newOptions.multiplicationOptions) {
        if(event.target.checked && !newOptions.multiplicationOptions.tables.includes(tableNumber)) {
          newOptions.multiplicationOptions.tables.push(tableNumber)
          onChange(newOptions)
        } else if(!event.target.checked && newOptions.multiplicationOptions.tables.includes(tableNumber)) {
          newOptions.multiplicationOptions.tables = newOptions.multiplicationOptions.tables.filter((x) => x != tableNumber)
          onChange(newOptions)
        }
      }
    }
  };

  const tableCheckboxes = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x) => <FormControlLabel
    control={
      <Checkbox disabled={!options.multiplicationOptions || ! options.multiplicationOptions.useTables} 
                checked={options.multiplicationOptions ? options.multiplicationOptions.tables.includes(x) : false} 
                onChange={handleTableChange} 
                name={"tablecheckbox_" + x} />
    }
    label={x}
    labelPlacement="bottom"
  />);

  const handleUseTableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = {...options}
    if(newOptions.multiplicationOptions) {
      newOptions.multiplicationOptions.useTables = event.target.checked;
      onChange(newOptions)
    }
  }

  const handleIncludeZeroAndOneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = {...options}
    if(newOptions.multiplicationOptions) {
      newOptions.multiplicationOptions.excludeZeroAndOne = !event.target.checked;
      onChange(newOptions)
    }
  }

  const handleTimeLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const intValue = parseInt(event.target.value)
    if(intValue) {
      const newOptions = {...options}
      newOptions.quizOptions.timeLimit = intValue;
      onChange(newOptions)
    }
  }

  const handleMultipleChoicesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = {...options}
    newOptions.quizOptions.multipleChoices = event.target.checked;
    onChange(newOptions)
  }  

  return(
    <>
      <Button onClick={handleClickOpen} color="inherit" size="large">
        <MenuIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Options</DialogTitle>
        <DialogContent>
          <MinAndMax min={options.multiplicationOptions ? options.multiplicationOptions.minNumber : 1} max={options.multiplicationOptions ? options.multiplicationOptions.maxNumber : 1} onChange={onChangeMinMax} />
          <FormControlLabel control={<Switch checked={options.quizOptions.multipleChoices} onChange={handleMultipleChoicesChange} />} label="Questions à choix multiples" />
          <FormControlLabel control={<Switch checked={options.multiplicationOptions ? !options.multiplicationOptions.excludeZeroAndOne : false} onChange={handleIncludeZeroAndOneChange} />} label="Inclure les multiplications par zéro et par un" />
          <FormControlLabel control={<Switch checked={options.multiplicationOptions ? options.multiplicationOptions.useTables : false} onChange={handleUseTableChange} />} label="Utiliser les tables" />
          <FormGroup row>
            {tableCheckboxes}
          </FormGroup>
          <TextField label="Nombre de minutes" value={options.quizOptions.timeLimit} onChange={handleTimeLimitChange} inputProps={{ pattern: "[0-9]+" }}/>          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Appliquer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export {Options};