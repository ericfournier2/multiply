import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

type ModeButtonProps = {
  title: string,
  description: string,
  onClick: () => void,
  disabled?: boolean
}

function ModeButton({title, description, onClick, disabled=false}: ModeButtonProps) {
  return(
    <Grid item xs={4}>
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{backgroundColor:"lightgrey"}}>{title}</Typography>
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
  onSelect: (mode: string) => void,
}

function ModeSelect({onSelect}: ModeSelectProps) {
  const modeSelectCallback = (mode: string) => () => onSelect(mode);

  return(
    <Grid container spacing={4}>
      <ModeButton title="Mort soudaine" description="Une erreur, et c'est fini!" onClick={modeSelectCallback("suddenDeath")}/>
      <ModeButton title="Temps limite" description="Fais le plus de point dans le temps imparti!" onClick={modeSelectCallback("timeLimit")} disabled/>
      <ModeButton title="Jeu de paires" description="Trouve les paires d'opérations!" onClick={modeSelectCallback("pairs")} disabled/>
    </Grid>
  );
}

export default ModeSelect;