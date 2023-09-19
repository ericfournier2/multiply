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

import useLocalStorage from './Storage'
import { Options, defaultGameOptions } from './Options';
import ModeSelect from './ModeSelect';
import type { GameOptions } from './Options';
import Quiz from './Quiz';
import type { Profile } from './Profiles';
import Profiles from './Profiles';


function App() {
  const [started, setStarted] = useState(false);
  const [quizKey, setQuizKey] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [options, setOptions] = useState(defaultGameOptions);
  const [mode, setMode] = useState("suddenDeath");
  const [profiles, setProfiles] = useLocalStorage("profiles", []);
  // const [activeProfile, setActiveProfile] = useState(profiles.length > 0 ? profiles[0] : undefined)

  const initializeGame = () => {
    setStarted(true)
    setQuizKey(quizKey + 1)
  }

  const onOptionsChange = (options: GameOptions) => {
    setOptions(options);
  }

  const onModeSelect = (mode:string, options?: GameOptions) => {
    if(options) {
      setOptions(options)
    }
    setMode(mode)
    initializeGame()
  }

  const onQuit = (score: number) => {
    if(score > highScore) {
      setHighScore(score)
    }
    initializeGame();
  }

  const onProfilesChange = (profiles: Array<Profile>) => {
    setProfiles(profiles)
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
        <Profiles profiles={profiles} onChange={onProfilesChange} />
      </AppBar>
      <Toolbar />
      <Container>
        {!started ?
          <ModeSelect onSelect={onModeSelect}/> :
          <Quiz mode={mode} options={options} onQuit={onQuit} key={quizKey}/>
        }        
      </Container>
    </div>
  );
}

export default App;
