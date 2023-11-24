import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import type { TimeProps }  from 'react-countdown-circle-timer'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import { GameType } from './Modes';
import { Question } from "./Question";
import type { ExamResults } from "./Profiles";
import { Quiz } from './QuizGenerator';

type QuizControlProps = {
  quiz: Quiz,
  onQuit: (results?: ExamResults) => void
}

function scorePercent(score: number, wrongAnswers: number) {
  return (score * 100 / (score + wrongAnswers))
}

function scorePercentString(score: number, wrongAnswers: number) {
  return `${score} / ${score + wrongAnswers} (${scorePercent(score, wrongAnswers).toFixed(0)})%`
}

function QuizControl({quiz, onQuit}: QuizControlProps) {
  const [lost, setLost] = useState(false);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  
  const quizMode = quiz.options.quizOptions.mode
  const timeLimit = quiz.options.quizOptions.timeLimit

  // Set up the timer.
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + (timeLimit * 60))
  const [timerExpiry, setTimerExpiry] = useState(expiryTimestamp);

  const onTimerExpire = () => {
    if(quizMode == GameType.TimeLimit) {
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

  const onRightAnswer = () => {
    setScore(score + 1)
    setQuestionNumber(questionNumber + 1)
  }

  const onWrongAnswer = () => {
    setWrongAnswers(wrongAnswers + 1)
    if(quizMode == GameType.SuddenDeath) {
      setLost(true)
    } else {
      setQuestionNumber(questionNumber + 1)  
    }
  }

  const restartClick = () => {
    const results = {
      score: scorePercent(score, wrongAnswers),
      passed: score > quiz.options.quizOptions.threshold,
      id: quiz.id
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
    if(quizMode == GameType.TimeLimit) {
      return <CountdownCircleTimer
        size={90}
        isPlaying
        duration={timeLimit * 60}
        colors={['#32a852', '#fff824', '#f70000']}
        colorsTime={[timeLimit * 60, timeLimit * 30, 0]}          
      >
        {renderTime}
      </CountdownCircleTimer>
    } else {
      return null;
    }
  }

  const gameSummary = () => {
    if(quiz.options.quizOptions.mode == GameType.TimeLimit) {    
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
              <Question question={quiz.questions[questionNumber]}
                        onRightAnswer={onRightAnswer}
                        onWrongAnswer={onWrongAnswer} 
                        multipleChoices={quiz.options.quizOptions.multipleChoices}
                        key={questionNumber}/> :
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

export default QuizControl;