
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


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

type TableSelectProps = {
  tables: Array<number>,
  disabled?: boolean,
  onChange: (tables: Array<number>) => void,
}

const TableSelect = ({tables, disabled, onChange}: TableSelectProps) => {
  const handleTableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tableNumberStr = event.target.name.split("_").pop()
    if(tableNumberStr) {
      const tableNumber = parseInt(tableNumberStr)

      var newTables = {...tables}
        if(event.target.checked && !tables.includes(tableNumber)) {
          newTables.push(tableNumber)
          onChange(newTables)
        } else if(!event.target.checked && tables.includes(tableNumber)) {
          newTables = newTables.filter((x) => x != tableNumber)
          onChange(newTables)
        }
    }
  };

  const tableCheckboxes = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x) => <FormControlLabel
    control={
      <Checkbox disabled={disabled} 
                checked={tables.includes(x)} 
                onChange={handleTableChange} 
                name={"tablecheckbox_" + x} />
    }
    label={x}
    labelPlacement="bottom"
  />);


  return (
    <FormGroup row>
      {tableCheckboxes}
    </FormGroup>    
  )
}

export { MinAndMax, TableSelect };