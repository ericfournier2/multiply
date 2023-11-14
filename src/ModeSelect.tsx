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
    desc: "Pratique pour ta ceinture blanche!",
    icon: "belt.svg",
    options: makeBeltOptions([2,3], undefined)
  },
  {
    id: "BELT_2",    
    label: "Ceinture jaune",
    desc: "Pratique pour ta ceinture jaune!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 5, 10], undefined)    
  },
  {
    id: "BELT_3",    
    label: "Ceinture orange",
    desc: "Pratique pour ta ceinture orange!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 10], undefined)        
  },    
  {
    id: "BELT_4",    
    label: "Ceinture vert pâle",
    desc: "Pratique pour ta ceinture vert pâle!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 10], undefined)            
  },    
  {
    id: "BELT_5",    
    label: "Ceinture vert forêt",
    desc: "Pratique pour ta ceinture vert forêt!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 7, 10], undefined)     
  },  
  {
    id: "BELT_6",    
    label: "Ceinture bleu pâle",
    desc: "Pratique pour ta ceinture bleue pâle!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 7, 8, 10], undefined)     
  },   
  {
    id: "BELT_7",    
    label: "Ceinture bleu foncé",
    desc: "Pratique pour ta ceinture bleue foncé!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 7, 8, 9, 10], undefined)     
  },   
  {
    id: "BELT_8",    
    label: "Ceinture rose",
    desc: "Pratique pour ta ceinture rose!",
    icon: "belt.svg",
    options: makeBeltOptions(undefined, [2, 3, 4, 5, 6])     
  },   
  {
    id: "BELT_9",    
    label: "Ceinture rouge",
    desc: "Pratique pour ta ceinture rouge!",
    icon: "belt.svg",
    options: makeBeltOptions(undefined, [2, 3, 4, 5, 6, 7, 8, 9, 10])     
  },       
  {
    id: "BELT_10",    
    label: "Ceinture noise",
    desc: "Pratique pour ta ceinture noire!",
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