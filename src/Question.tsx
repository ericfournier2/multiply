import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {randomInteger, randomIntegerInRange, shuffleArray} from './Utils';

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
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  const isRightAnswer = answer == (firstNumber * secondNumber)

  const onClick = () => {
    setHasBeenClicked(true);

    if(isRightAnswer) {
      onRightAnswer();
    } else {
      onWrongAnswer();
    }
  }
  
  // let buttonColor = "primary";
  // if(hasBeenClicked && isRightAnswer) {
  //   buttonColor = "success";
  // } else {
  //   buttonColor = "error";
  // }


  return (
    <Button fullWidth size="large" variant="contained" onClick={onClick} color={hasBeenClicked ? (isRightAnswer ? "success" : "error") : "primary"}>{answer}</Button>
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
    <Grid container spacing={2}>
      {buttons.map((x) => <Grid item xs={4}>{x}</Grid>)}
    </Grid>
  );
}

type QuestionProps = {
  firstNumber: number, 
  secondNumber: number,  
  onRightAnswer: () => void,
  onWrongAnswer: () => void   
}

const Question = ({firstNumber, secondNumber, onRightAnswer, onWrongAnswer}: QuestionProps) => {
  const [answers, setAnswers] = useState(generateAnswersArray(firstNumber, secondNumber, 6))
  const [wrong, setWrong] = useState(false);

  const wrongAnswer = () => {
    setWrong(true);
  }

  const rightAnswer = () => {
    if(wrong) {
      onWrongAnswer()
    } else {
      onRightAnswer()
    }
  }

  return(
    <>
      <Typography variant="h3">{firstNumber} x {secondNumber}</Typography>
      <AnswerArray answers={answers} firstNumber={firstNumber} secondNumber={secondNumber} onRightAnswer={rightAnswer} onWrongAnswer={wrongAnswer} />
    </>
  );
}

export {generateAnswersArray, Question}