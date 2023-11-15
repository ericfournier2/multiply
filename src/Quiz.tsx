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
import type { GameOptions } from './Modes';
import { GameType } from './Modes';
import { Question, QuestionType } from "./Question";
import type { ExamResults } from "./Profiles";

type QuizProps = {
  id: string,
  options: GameOptions,
  onQuit: (results?: ExamResults) => void
}

function pickNumbers(options: GameOptions) {
  let n1 = 0;
  let n2 = 0;
  
  if(options.multiplicationOptions) {
    if(!options.multiplicationOptions.useTables) {
      n1 = randomIntegerInRange(options.multiplicationOptions.minNumber, options.multiplicationOptions.maxNumber);
      n2 = randomIntegerInRange(options.multiplicationOptions.minNumber, options.multiplicationOptions.maxNumber);
    } else {
      n1 = options.multiplicationOptions.tables[randomIntegerInRange(0, options.multiplicationOptions.tables.length)];
      if(options.multiplicationOptions.excludeZeroAndOne) {
        n2 = randomIntegerInRange(2, options.multiplicationOptions.maxNumber);
      } else {
        n2 = randomIntegerInRange(0, options.multiplicationOptions.maxNumber);
      }
    }

    return {n1:n1, n2:n2}
  } else if(options.divisionOptions) {
    n1 = options.divisionOptions.tables[randomIntegerInRange(0, options.divisionOptions.tables.length)];
    if(options.divisionOptions.excludeOne) {
      n2 = randomIntegerInRange(2, options.divisionOptions.maxNumber);
    } else {
      n2 = randomIntegerInRange(1, options.divisionOptions.maxNumber);
    }    

    return {n1: n1 * n2, n2: n2}
  } else {
    return {n1: 1, n2: 1}
  }
}

function scorePercent(score: number, wrongAnswers: number) {
  return (score * 100 / (score + wrongAnswers))
}

function scorePercentString(score: number, wrongAnswers: number) {
  return `${score} / ${score + wrongAnswers} (${scorePercent(score, wrongAnswers).toFixed(0)})%`
}


function Quiz({id, options, onQuit}: QuizProps) {
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
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + (options.quizOptions.timeLimit * 60))
  const [timerExpiry, setTimerExpiry] = useState(expiryTimestamp);

  const onTimerExpire = () => {
    if(options.quizOptions.mode == GameType.TimeLimit) {
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
    if(options.quizOptions.mode == GameType.SuddenDeath) {
      setLost(true)
    } else {
      initializeMultiplication()      
    }
  }

  const restartClick = () => {
    const results = {
      score: scorePercent(score, wrongAnswers),
      passed: score > options.quizOptions.threshold,
      id: id
    }
    onQuit(results)
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
    if(options.quizOptions.mode == GameType.TimeLimit) {
      return <CountdownCircleTimer
        size={90}
        isPlaying
        duration={options.quizOptions.timeLimit * 60}
        colors={['#32a852', '#fff824', '#f70000']}
        colorsTime={[options.quizOptions.timeLimit * 60, options.quizOptions.timeLimit * 30, 0]}          
      >
        {renderTime}
      </CountdownCircleTimer>
    } else {
      return null;
    }
  }

  const gameSummary = () => {
    if(options.quizOptions.mode == GameType.TimeLimit) {    
      return <Typography>Résultats: {scorePercentString(score, wrongAnswers)}</Typography>
    } else {
      return <Typography>Score: {score}</Typography>
    }
  }

  return (
    <Paper>
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="h4">Score:{score}</Typography>
        </Grid>
        <Grid item xs={4}>
          {renderTimer()}
        </Grid>
        <Grid item xs={2}>
        <Button variant="contained" onClick={() => { onQuit(undefined) }}>X</Button>
        </Grid>        
        <Grid item xs={12}>
          {!lost ?
              <Question type={options.multiplicationOptions ? QuestionType.Multiplication : QuestionType.Division}
                        firstNumber={firstNumber} 
                        secondNumber={secondNumber} 
                        onRightAnswer={onRightAnswer}
                        onWrongAnswer={onWrongAnswer} 
                        multipleChoices={options.quizOptions.multipleChoices}
                        key={questionKey}/> :
              <>
                <Typography>Partie terminée!</Typography>
                {gameSummary()}
                <Button variant="contained" onClick={restartClick}>Retour au menu?</Button>
              </>
          }    
        </Grid>        
      </Grid>
    </Paper>    
  );
}

export default Quiz;