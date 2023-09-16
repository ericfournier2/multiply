import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import type { GameOptions } from './Options';

const examsDefinitions = [
  {
    label: "Ceinture blanche",
    desc: "Pratique pour ta ceinture blanche!",
    icon: "belt.svg",
    mode: "timeLimit",
    threshold: 20,
    options: {
      minNumber: 2,
      maxNumber: 10,
      useTables: true,
      tables: [2, 3],
      timeLimit: 1,
      excludeZeroAndOne: true,
      multipleChoices: false
    }
  },
  {
    label: "Ceinture jaune",
    desc: "Pratique pour ta ceinture jaune!",
    icon: "belt.svg",
    mode: "timeLimit",
    threshold: 20,    
    options: {
      minNumber: 2,
      maxNumber: 10,
      useTables: true,
      tables: [2, 3, 5, 10],
      timeLimit: 1,
      excludeZeroAndOne: true,
      multipleChoices: false
    }
  },
  {
    label: "Ceinture orange",
    desc: "Pratique pour ta ceinture orange!",
    icon: "belt.svg",
    mode: "timeLimit",
    threshold: 20,    
    options: {
      minNumber: 2,
      maxNumber: 10,
      useTables: true,
      tables: [2, 3, 4, 5, 10],
      timeLimit: 1,
      excludeZeroAndOne: true,
      multipleChoices: false
    }
  },    
]

type ModeButtonProps = {
  title: string,
  description: string,
  icon: string,
  onClick: () => void,
  disabled?: boolean
}

function ModeButton({title, description, icon, onClick, disabled=false}: ModeButtonProps) {
  return(
    <Grid item xs={4}>
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{backgroundColor:"lightgrey"}}>{title}</Typography>
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
  onSelect: (mode: string, options?: GameOptions) => void,
}

function ModeSelect({onSelect}: ModeSelectProps) {
  const modeSelectCallback = (mode: string, options?: GameOptions) => () => onSelect(mode, options);

  const exams = examsDefinitions.map((x) => <ModeButton icon={x.icon} title={x.label} description={x.desc} onClick={modeSelectCallback(x.mode, x.options)} key={"exam_" + x.label}/>)

  return(
    <Grid container spacing={4}>
      <ModeButton icon="suddendeathicon.svg" title="Mort soudaine" description="Une erreur, et c'est fini!" onClick={modeSelectCallback("suddenDeath", undefined)}/>
      <ModeButton icon="stopwatch.svg" title="Temps limite" description="Fais le plus de point dans le temps imparti!" onClick={modeSelectCallback("timeLimit", undefined)} />
      <ModeButton icon="pairs.svg" title="Jeu de paires" description="Trouve les paires d'opérations!" onClick={modeSelectCallback("pairs", undefined)} disabled/>
      {exams}
    </Grid>
  );
}

export default ModeSelect;