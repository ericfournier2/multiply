import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import type { TimeProps }  from 'react-countdown-circle-timer'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import { randomIntegerInRange } from './Utils';
import type { GameOptions } from './Options';
import { Question } from "./Question";


type QuizProps = {
  mode: string,
  options: GameOptions,
  onQuit: (score: number) => void
}

function pickNumbers(options: GameOptions) {
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

  return {n1:n1, n2:n2}
}

function Quiz({mode, options, onQuit}: QuizProps) {
  const [lost, setLost] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [questionKey, setQuestionKey] = useState(1);

  // Pick default numbers to be used on the first render.
  const {n1, n2} = pickNumbers(options)
  const [firstNumber, setFirstNumber] = useState(n1);
  const [secondNumber, setSecondNumber] = useState(n2);

  // Set up the timer.
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + (options.timeLimit * 60))
  const [timerExpiry, setTimerExpiry] = useState(expiryTimestamp);

  const onTimerExpire = () => {
    if(mode == "timeLimit") {
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
    const {n1, n2} = pickNumbers(options)
    setFirstNumber(n1)
    setSecondNumber(n2)
    setQuestionKey(questionKey + 1)    
  }

  const onRightAnswer = () => {
    setScore(score + 1)

    initializeMultiplication()
  }

  const onWrongAnswer = () => {
    setWrongAnswers(wrongAnswers + 1)
    if(mode == "suddenDeath") {
      setLost(true)
    } else {
      initializeMultiplication()      
    }
  }

  const restartClick = () => {
    onQuit(score)
  }

  const renderTime = ({ remainingTime }: TimeProps) => {
    if (remainingTime === 0) {
      return <div className="timer">Terminé!</div>;
    }
  
    return (
      <div className="timer">
        <div className="value">{remainingTime}</div>
        <div className="text">secondes</div>
      </div>
    );
  };

  const renderTimer = () => {
    if(mode == "timeLimit") {
      return <CountdownCircleTimer
        size={90}
        isPlaying
        duration={options.timeLimit * 60}
        colors={['#32a852', '#fff824', '#f70000']}
        colorsTime={[options.timeLimit * 60, options.timeLimit * 30, 0]}          
      >
        {renderTime}
      </CountdownCircleTimer>
    } else {
      return null;
    }
  }

  const gameSummary = () => {
    if(mode == "timeLimit") {    
      return <Typography>Résultats: {score} / {score + wrongAnswers} ({(score * 100 / (score + wrongAnswers)).toFixed(0)}%)</Typography>
    } else {
      return <Typography>Score: {score}</Typography>
    }
  }

  return (
    <Paper>
      <Grid container>
        <Grid item xs={8}>
          <Typography variant="h4">Score:{score}</Typography>
        </Grid>
        <Grid item xs={4}>
          {renderTimer()}
        </Grid>
        <Grid item xs={12}>
          {!lost ?
              <Question firstNumber={firstNumber} 
                        secondNumber={secondNumber} 
                        onRightAnswer={onRightAnswer}
                        onWrongAnswer={onWrongAnswer} 
                        multipleChoices={options.multipleChoices}
                        key={questionKey}/> :
              <>
                <Typography>Partie terminée!</Typography>
                {gameSummary()}
                <Button variant="contained" onClick={restartClick}>Nouvelle partie?</Button>
              </>
          }    
        </Grid>        
      </Grid>
    </Paper>    
  );
}

export default Quiz;