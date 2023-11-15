import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Badge from '@mui/material/Badge';
import CheckIcon from '@mui/icons-material/Check';

import { GameType, defaultGameOptions } from './Options';
import type { GameOptions } from './Options';
import type {Stats} from "./Profiles";

const defaultBeltOptions = {...defaultGameOptions}
defaultBeltOptions.multiplicationOptions = undefined;
defaultBeltOptions.divisionOptions = undefined;

const defaultMultOptions = {  
  minNumber: 2,
  maxNumber: 10,
  useTables: true,
  tables: [2, 3, 5, 10],
  excludeZeroAndOne: true,  
}

const defaultDivOptions = {
  maxNumber: 10,
  tables: [2, 3, 5, 10],
  excludeOne: true,    
}

function makeBeltOptions(multTables?: Array<number>, divTables?: Array<number>) {
  const beltOptions = {...defaultBeltOptions}
  if(multTables) {
    const multOptions = {...defaultMultOptions}
    multOptions.tables = multTables;
    beltOptions.multiplicationOptions = multOptions;
  }

  if(divTables) {
    const divOptions = {...defaultDivOptions}
    divOptions.tables = divTables;
    beltOptions.divisionOptions = divOptions
  }

  return beltOptions;
}

const examsDefinitions = [
  {
    id: "BELT_1",
    label: "Ceinture blanche",
    desc: "Tables du 2 et du 3!",
    icon: "belt.svg",
    options: makeBeltOptions([2,3], undefined)
  },
  {
    id: "BELT_2",    
    label: "Ceinture jaune",
    desc: "Tables du 2, du 3, du 5 et du 10!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 5, 10], undefined)    
  },
  {
    id: "BELT_3",    
    label: "Ceinture orange",
    desc: "Tables de 2 à 5 et de 10!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 10], undefined)        
  },    
  {
    id: "BELT_4",    
    label: "Ceinture vert pâle",
    desc: "Tables de 2 à 6 et de 10!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 10], undefined)            
  },    
  {
    id: "BELT_5",    
    label: "Ceinture vert forêt",
    desc: "Tables de 2 à 7 et de 10!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 7, 10], undefined)     
  },  
  {
    id: "BELT_6",    
    label: "Ceinture bleu pâle",
    desc: "Tables de 2 à 8 et de 10!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 7, 8, 10], undefined)     
  },   
  {
    id: "BELT_7",    
    label: "Ceinture bleu foncé",
    desc: "Tables de 2 à 10!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 7, 8, 9, 10], undefined)     
  },   
  {
    id: "BELT_8",    
    label: "Ceinture rose",
    desc: "Divisions jusqu'à 6!",
    icon: "belt.svg",
    options: makeBeltOptions(undefined, [2, 3, 4, 5, 6])     
  },   
  {
    id: "BELT_9",    
    label: "Ceinture rouge",
    desc: "Divisions jusqu'à 10!",
    icon: "belt.svg",
    options: makeBeltOptions(undefined, [2, 3, 4, 5, 6, 7, 8, 9, 10])     
  },       
  {
    id: "BELT_10",    
    label: "Ceinture noire",
    desc: "Toutes les opérations!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 7, 8, 9, 10], [2, 3, 4, 5, 6, 7, 8, 9, 10])     
  },      
]

type ModeButtonProps = {
  passed?: boolean,
  title: string,
  description: string,
  icon: string,
  onClick: () => void,
  disabled?: boolean
}

function ModeButton({passed, title, description, icon, onClick, disabled=false}: ModeButtonProps) {
  return(
   <Grid item xs={4}>
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{backgroundColor:"lightgrey"}}>{title} {passed ? <CheckIcon color="success" /> : ""}</Typography> 
        <img src={icon} width="90%" />
        <Typography variant="body1">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={onClick} variant="contained" fullWidth disabled={disabled}>Jouer!</Button>
      </CardActions>
    </Card>
  </Grid>

  );
}

type ModeSelectProps = {
  onSelect: (id: string, options?: GameOptions) => void,
  stats?: Stats
}

const timeLimitOptions = {...defaultGameOptions};
timeLimitOptions.mode = GameType.TimeLimit;

const suddenDeathOptions = {...defaultGameOptions};
suddenDeathOptions.mode = GameType.SuddenDeath;

function ModeSelect({onSelect, stats}: ModeSelectProps) {
  const modeSelectCallback = (id: string, options?: GameOptions) => () => onSelect(id, options);

  const exams = examsDefinitions.map((x) => <ModeButton passed={stats ? stats.exams.some((y) => ((y.id === x.id) && y.passed)) : false} icon={x.icon} title={x.label} description={x.desc} onClick={modeSelectCallback(x.id, x.options)} key={"exam_" + x.label}/>)

  return(
    <Grid container spacing={4}>
      <ModeButton icon="suddendeathicon.svg" title="Mort soudaine" description="Une erreur, et c'est fini!" onClick={modeSelectCallback("suddenDeathPractice", suddenDeathOptions)}/>
      <ModeButton icon="stopwatch.svg" title="Temps limite" description="Fais le plus de point dans le temps imparti!" onClick={modeSelectCallback("timeLimitPractice", timeLimitOptions)} />
      <ModeButton icon="pairs.svg" title="Jeu de paires" description="Trouve les paires d'opérations!" onClick={modeSelectCallback("pairs", undefined)} disabled/>
      {exams}
    </Grid>
  );
}

export default ModeSelect;