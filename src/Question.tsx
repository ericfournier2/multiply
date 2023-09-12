import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
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

type QuestionProps = {
  firstNumber: number, 
  secondNumber: number,  
  onRightAnswer: () => void,
  onWrongAnswer: () => void   
}

const Question = ({firstNumber, secondNumber, onRightAnswer, onWrongAnswer}: QuestionProps) => {
  const [answers, setAnswers] = useState(generateAnswersArray(firstNumber, secondNumber, 6))
  
  return(
    <>
      <Typography>{firstNumber} x {secondNumber}</Typography>
      <AnswerArray answers={answers} firstNumber={firstNumber} secondNumber={secondNumber} onRightAnswer={onRightAnswer} onWrongAnswer={onWrongAnswer} />
    </>
  );
}

export {generateAnswersArray, Question}