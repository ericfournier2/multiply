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
}

function ModeButton({title, description, onClick}: ModeButtonProps) {
  return(
    <Grid item xs={4}>
    <Card>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body1">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={onClick} variant="contained" fullWidth>Jouer!</Button>
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
      <ModeButton title="Temps limite" description="Fais le plus de point dans le temps imparti!" onClick={modeSelectCallback("timeLimit")}/>
      <ModeButton title="Jeu de paires" description="Trouve les paires d'opérations!" onClick={modeSelectCallback("pairs")}/>
    </Grid>
  );
}

export default ModeSelect;