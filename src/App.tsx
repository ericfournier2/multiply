import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import { randomIntegerInRange } from './Utils';
import { Options, defaultGameOptions } from './Options';
import ModeSelect from './ModeSelect';
import type { GameOptions } from './Options';
import { Question } from "./Question";

function App() {
  const [started, setStarted] = useState(false);
  const [lost, setLost] = useState(false);
  const [firstNumber, setFirstNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
  const [questionKey, setQuestionKey] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timerExpiry, setTimerExpiry] = useState(new Date());
  const [options, setOptions] = useState(defaultGameOptions);

  const onTimerExpire = () => {
    if(started && !lost) {
      setLost(true);
    }
  }

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp: timerExpiry, onExpire: onTimerExpire });

  const initializeMultiplication = () => {
    let n1 = 0;
    let n2 = 0;
    
    if(!options.useTables) {
      n1 = randomIntegerInRange(options.minNumber, options.maxNumber);
      n2 = randomIntegerInRange(options.minNumber, options.maxNumber);
    } else {
      n1 = options.tables[randomIntegerInRange(0, options.tables.length)];
      if(options.excludeZeroAndOne) {
        n2 = randomIntegerInRange(2, options.maxNumber);
      } else {
        n2 = randomIntegerInRange(0, options.maxNumber);
      }
    }

    setFirstNumber(n1)
    setSecondNumber(n2)
    setQuestionKey(questionKey + 1)
  }

  const initializeGame = () => {
    setStarted(true)
    setLost(false)
    setScore(0)

    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + (options.timeLimit * 60))
    setTimerExpiry(expiryTimestamp)
    restart(expiryTimestamp)

    initializeMultiplication()
  }

  const onRightAnswer = () => {
    setScore(score + 1)
    if(score + 1 > highScore) {
      setHighScore(score + 1)
    }
    initializeMultiplication()
  }

  const onWrongAnswer = () => {
    setLost(true)
    pause()
  }

  const onOptionsChange = (options: GameOptions) => {
    setOptions(options);
  }

  const onModeSelect = (mode:string) => {
    alert(mode);
  }

  return (
    <div className="App">
      <AppBar>
        <Toolbar>
          <Options options={options} onChange={onOptionsChange} />
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Multiplicathlon!
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        <p>Plus haut score:{highScore}</p>
        <p>{seconds} secondes</p>
        <p>Score:{score}</p>        
        <ModeSelect onSelect={onModeSelect}/>
        {!started ?
          <Button variant="contained" onClick={initializeGame}>Commençons!</Button> :
          !lost ?
            <Question firstNumber={firstNumber} secondNumber={secondNumber} onRightAnswer={onRightAnswer} onWrongAnswer={onWrongAnswer} key={questionKey}/>:
            <><p>Vous avez perdu! :(</p><Button variant="contained" onClick={initializeGame}>Recommencez?</Button></>
        }        
      </Container>
    </div>
  );
}

export default App;
