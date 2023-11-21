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
import { defaultGameOptions } from "./Modes";
import type { GameOptions, MultiplicationOptions, DivisionOptions } from "./Modes"
import { MultiplicationOptionsControl } from './MultiplicationOptions';
import { DivisionOptionsControl } from './DivisionOptions';

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

  const handleMultiplicationOptionsChange = (multOptions: MultiplicationOptions) => {
    const newOptions = {...options}
    newOptions.multiplicationOptions = multOptions;
    onChange(newOptions)    
  }

  const enableDisableMultiplications = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.checked && !options.multiplicationOptions) {
      const newOptions = {...options};
      newOptions.multiplicationOptions = defaultGameOptions.multiplicationOptions;
      onChange(newOptions)
    } else if(!event.target.checked && !!options.multiplicationOptions) {
      const newOptions = {...options};
      newOptions.multiplicationOptions = undefined;
      onChange(newOptions)      
    }
  }

  const handleDivisionOptionsChange = (divOptions: DivisionOptions) => {
    const newOptions = {...options}
    newOptions.divisionOptions = divOptions;
    onChange(newOptions)    
  }

  const enableDisableDivisions = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.checked && !options.divisionOptions) {
      const newOptions = {...options};
      newOptions.divisionOptions = defaultGameOptions.divisionOptions;
      onChange(newOptions)
    } else if(!event.target.checked && !!options.divisionOptions) {
      const newOptions = {...options};
      newOptions.divisionOptions = undefined;
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
          <FormControlLabel control={<Switch checked={options.quizOptions.multipleChoices} onChange={handleMultipleChoicesChange} />} label="Questions à choix multiples" />
          <TextField label="Nombre de minutes" value={options.quizOptions.timeLimit} onChange={handleTimeLimitChange} inputProps={{ pattern: "[0-9]+" }}/>          
          <FormControlLabel control={<Switch checked={!!options.multiplicationOptions} onChange={enableDisableMultiplications} />} label="Inclure les multiplications" />
          {options.multiplicationOptions ? <MultiplicationOptionsControl options={options.multiplicationOptions} onChange={handleMultiplicationOptionsChange} /> : "" }
          <FormControlLabel control={<Switch checked={!!options.divisionOptions} onChange={enableDisableDivisions} />} label="Inclure les divisions" />
          {options.divisionOptions ? <DivisionOptionsControl options={options.divisionOptions} onChange={handleDivisionOptionsChange} /> : "" }

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Appliquer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export {Options};