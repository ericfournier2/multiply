import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

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
    setLost(true);
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
    setLost(true)
    pause()
  }

  const restartClick = () => {
    onQuit(score)
  }

  return (
    <Container>
        <Typography>{seconds} secondes</Typography>
        <Typography>Score:{score}</Typography>        
        {!lost ?
            <Question firstNumber={firstNumber} 
                      secondNumber={secondNumber} 
                      onRightAnswer={onRightAnswer}
                      onWrongAnswer={onWrongAnswer} 
                      key={questionKey}/> :
            <Button variant="contained" onClick={restartClick}>Recommencez?</Button>
        }    
    </Container>
  );
}

export default Quiz;