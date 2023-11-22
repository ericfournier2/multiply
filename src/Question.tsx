import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {randomInteger, randomIntegerInRange, shuffleArray} from './Utils';

enum QuestionType {
  "Multiplication",
  "Division",
  "Addition",
  "Subtraction"
}

function mathOp(type: QuestionType, arg1: number, arg2: number): number {
  switch(type) {
    case QuestionType.Multiplication:
      return arg1 * arg2;
    case QuestionType.Division:
      return arg1 / arg2;
    case QuestionType.Addition:
      return arg1 + arg2;
    case QuestionType.Subtraction:
      return arg1 - arg2;
    default:
      return 0;
  }
}

function generateAnswersArray(type: QuestionType, firstNumber: number, secondNumber: number, nAnswers: number) {
  var answers = [mathOp(type, firstNumber, secondNumber)]
  var tries = 0;

  while(answers.length < nAnswers && tries < 100) {
    var candidateError = 0;
    var errorType = randomInteger(2)
    if(errorType == 0) {
      candidateError = mathOp(type, firstNumber, secondNumber) + randomIntegerInRange(-3, 3)
    } else {
      candidateError = mathOp(type, firstNumber + randomIntegerInRange(-2, 2), secondNumber + randomIntegerInRange(-2, 2))
    }

    if(candidateError >= 0 && Math.round(candidateError) == candidateError && Number.isFinite(candidateError)) {
      if(!answers.includes(candidateError)) {
        answers.push(candidateError)
      }
    }
    
    tries++;
  }

  shuffleArray(answers)

  return answers;
}

type AnswerButtonProps = {
  type: QuestionType,
  answer: number,
  firstNumber: number,
  secondNumber: number,
  onRightAnswer: () => void,
  onWrongAnswer: () => void
}

const AnswerButton = ({type, answer, firstNumber, secondNumber, onRightAnswer, onWrongAnswer} : AnswerButtonProps) => {
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  const isRightAnswer = ((type === QuestionType.Multiplication && answer === (firstNumber * secondNumber)) ||
                         (type === QuestionType.Division && answer === (firstNumber / secondNumber)))

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
  type: QuestionType,
  answers: Array<number>, 
  firstNumber: number, 
  secondNumber: number,
  onRightAnswer: () => void,
  onWrongAnswer: () => void  
}

const AnswerArray = ({type, answers, firstNumber, secondNumber, onRightAnswer, onWrongAnswer} : AnswerArrayProps) => {
  var buttons = answers.map((x) => <AnswerButton type={type} answer={x} firstNumber={firstNumber} secondNumber={secondNumber} onRightAnswer={onRightAnswer} onWrongAnswer={onWrongAnswer} />);
  return (
    <Grid container spacing={2}>
      {buttons.map((x) => <Grid item xs={4}>{x}</Grid>)}
    </Grid>
  );
}

type AnswerFieldProps = {
  type: QuestionType,
  firstNumber: number, 
  secondNumber: number,
  onRightAnswer: () => void,
  onWrongAnswer: () => void  
}

const AnswerField = ({type, firstNumber, secondNumber, onRightAnswer, onWrongAnswer} : AnswerFieldProps) => {
  const [text, setText] = useState("")
  const [error, setError] = useState(false)

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
  }

  const handleTextKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if((event.key === "Enter") && (text !== "")) {
      const parsedInt = parseInt(text);
      if(parsedInt) {
        if((type === QuestionType.Multiplication && parsedInt === (firstNumber * secondNumber)) ||
           (type === QuestionType.Division && parsedInt === (firstNumber / secondNumber)) )  
        {
          onRightAnswer()
        } else {
          setError(true)
          onWrongAnswer()
        }
      }
    }
  }

  return(
    <TextField 
      error={error}
      onChange={handleTextChange} 
      onKeyDown={handleTextKeyDown} 
      inputRef={(input) => {
        if(input != null) {
           input.focus();
        }
      }}
    />
  );
}

type QuestionProps = {
  type: QuestionType,
  firstNumber: number, 
  secondNumber: number,  
  multipleChoices: boolean,
  onRightAnswer: () => void,
  onWrongAnswer: () => void   
}

const Question = ({type, firstNumber, secondNumber, multipleChoices, onRightAnswer, onWrongAnswer}: QuestionProps) => {
  const [answers, setAnswers] = useState(generateAnswersArray(type, firstNumber, secondNumber, 6))
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

  const answerInput = () => {
    if(multipleChoices) {
      return <AnswerArray 
        type={type}
        answers={answers} 
        firstNumber={firstNumber} 
        secondNumber={secondNumber} 
        onRightAnswer={rightAnswer} 
        onWrongAnswer={wrongAnswer} 
      />
    } else {
      return <AnswerField 
        type={type}
        firstNumber={firstNumber} 
        secondNumber={secondNumber} 
        onRightAnswer={rightAnswer} 
        onWrongAnswer={wrongAnswer} 
      />
    }
  }

  var opCharacter = "x"
  switch(type) {
    case QuestionType.Multiplication:
      opCharacter = "x";
      break;
    case QuestionType.Division:
      opCharacter = "/";
      break;
    case QuestionType.Addition:
      opCharacter = "+";
      break;
    case QuestionType.Subtraction:
      opCharacter = "-";
  }

  return(
    <>
      <Typography variant="h3">{firstNumber} {opCharacter} {secondNumber}</Typography>
      {answerInput()}
    </>
  );
}

export {generateAnswersArray, Question, QuestionType}