import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTimer } from 'react-timer-hook';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import {Options, defaultGameOptions} from './Options';
import type { GameOptions } from './Options';

function randomInteger(int: number) {
  return Math.floor(Math.random() * int)
}

function randomIntegerInRange(start: number, end: number) {
  return Math.floor(Math.random() * (end - start)) + start;
}

function shuffleArray(array: Array<any>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function generateAnswersArray(firstNumber: number, secondNumber: number, nAnswers: number) {
  var answers = [firstNumber * secondNumber]
  var tries = 0;

  while(answers.length < nAnswers && tries < 100) {
    var candidateError = 0;
    var errorType = randomInteger(2)
    if(errorType == 0) {
      candidateError = (firstNumber * secondNumber) + randomIntegerInRange(-2, 2)
    } else {
      candidateError = (firstNumber + randomIntegerInRange(-1, 1)) * (secondNumber + randomIntegerInRange(-1, 1))
    }

    if(!answers.includes(candidateError)) {
      answers.push(candidateError)
    }
    tries++;
  }

  shuffleArray(answers)

  return answers;
}

type AnswerButtonProps = {
  answer: number,
  firstNumber: number,
  secondNumber: number,
  onRightAnswer: () => void,
  onWrongAnswer: () => void
}

const AnswerButton = ({answer, firstNumber, secondNumber, onRightAnswer, onWrongAnswer} : AnswerButtonProps) => {
  const onClick = () => {
    if(answer == (firstNumber * secondNumber)) {
      onRightAnswer();
    } else {
      onWrongAnswer();
    }
  }
  
  return (
    <Button variant="contained" onClick={onClick}>{answer}</Button>
  );
}

type AnswerArrayProps = {
  answers: Array<number>, 
  firstNumber: number, 
  secondNumber: number,
  onRightAnswer: () => void,
  onWrongAnswer: () => void  
}

const AnswerArray = ({answers, firstNumber, secondNumber, onRightAnswer, onWrongAnswer} : AnswerArrayProps) => {
  var buttons = answers.map((x) => <AnswerButton answer={x} firstNumber={firstNumber} secondNumber={secondNumber} onRightAnswer={onRightAnswer} onWrongAnswer={onWrongAnswer} />);
  return (
    <Stack spacing={2} direction="row">
      {buttons}
    </Stack>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  const [lost, setLost] = useState(false);
  const [firstNumber, setFirstNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [answers, setAnswers] = useState([0, 0, 0, 0, 0, 0]);
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

    setAnswers(generateAnswersArray(n1, n2, 6))    
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

  return (
    <div className="App">
      <header className="App-header">
        Multiplicathlon!<Options options={options} onChange={onOptionsChange} />

        <p>Plus haut score:{highScore}</p>
        <p>{seconds} secondes</p>
        <p>Score:{score}</p>        
        {!started ?
          <Button variant="contained" onClick={initializeGame}>Commençons!</Button> :
          !lost ?
            <>
              <p>{firstNumber} x {secondNumber}</p>
              <AnswerArray answers={answers} firstNumber={firstNumber} secondNumber={secondNumber} onRightAnswer={onRightAnswer} onWrongAnswer={onWrongAnswer} />
            </> :
            <><p>Vous avez perdu! :(</p><Button variant="contained" onClick={initializeGame}>Recommencez?</Button></>
        }        
      </header>
    </div>
  );
}

export default App;
