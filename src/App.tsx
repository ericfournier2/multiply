import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import { Options, defaultGameOptions } from './Options';
import ModeSelect from './ModeSelect';
import type { GameOptions } from './Options';
import Quiz from './Quiz';

function App() {
  const [started, setStarted] = useState(false);
  const [quizKey, setQuizKey] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [options, setOptions] = useState(defaultGameOptions);

  const initializeGame = () => {
    setStarted(true)
    setQuizKey(quizKey + 1)
  }

  const onOptionsChange = (options: GameOptions) => {
    setOptions(options);
  }

  const onModeSelect = (mode:string) => {
    initializeGame()
  }

  const onQuit = (score: number) => {
    if(score > highScore) {
      setHighScore(score)
    }
    initializeGame();
  }

  return (
    <div className="App">
      <AppBar>
        <Toolbar>
          <Options options={options} onChange={onOptionsChange} />
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Multiplicathlon!
          </Typography>
          <Typography>Plus haut score:{highScore}</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        {!started ?
          <ModeSelect onSelect={onModeSelect}/> :
          <Quiz mode="suddenDeath" options={options} onQuit={onQuit} key={quizKey}/>
        }        
      </Container>
    </div>
  );
}

export default App;
