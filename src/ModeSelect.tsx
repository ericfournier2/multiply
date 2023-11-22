import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Badge from '@mui/material/Badge';
import CheckIcon from '@mui/icons-material/Check';
import { Options } from './Options'
import { GameType, defaultGameOptions, examsDefinitions } from './Modes';
import type { GameOptions } from './Modes';
import type {Stats} from "./Profiles";


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
timeLimitOptions.quizOptions.mode = GameType.TimeLimit;

const suddenDeathOptions = {...defaultGameOptions};
suddenDeathOptions.quizOptions.mode = GameType.SuddenDeath;

function ModeSelect({onSelect, stats}: ModeSelectProps) {
  const [options, setOptions] = useState(defaultGameOptions);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [optionMode, setOptionsMode] = useState("suddenDeath");

  const modeSelectCallback = (id: string, options?: GameOptions) => () => onSelect(id, options);

  const exams = examsDefinitions.map((x) => 
    <ModeButton passed={stats ? stats.exams.some((y) => ((y.id === x.id) && y.passed)) : false}
                icon={x.icon} 
                title={x.label} 
                description={x.desc} 
                onClick={modeSelectCallback(x.id, x.options)} 
                key={"exam_" + x.label}/>
  )

  const onOptionsChange = (options: GameOptions) => {
    setOptions(options);
  }

  const customModeCallback = (id: string) => () => {
    setOptionsOpen(true);
    setOptionsMode(id)
  }

  return(
    <Grid container spacing={4}>
      <Options open={optionsOpen} options={options} onChange={onOptionsChange} onClose={modeSelectCallback(optionMode, options)} />
      <ModeButton icon="suddendeathicon.svg" title="Mort soudaine" description="Une erreur, et c'est fini!" onClick={customModeCallback("suddenDeathPractice")}/>
      <ModeButton icon="stopwatch.svg" title="Temps limite" description="Fais le plus de point dans le temps imparti!" onClick={customModeCallback("timeLimitPractice")} />
      <ModeButton icon="pairs.svg" title="Jeu de paires" description="Trouve les paires d'opérations!" onClick={modeSelectCallback("pairs", undefined)} disabled/>
      {exams}
    </Grid>
  );
}

export default ModeSelect;