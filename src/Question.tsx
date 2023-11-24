import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { OperationType } from './QuizGenerator';
import type { MathQuestion } from './QuizGenerator';

type AnswerButtonProps = {
  answer: number,
  correctAnswer: number,
  onRightAnswer: () => void,
  onWrongAnswer: () => void
}

const AnswerButton = ({answer, correctAnswer, onRightAnswer, onWrongAnswer} : AnswerButtonProps) => {
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  const isRightAnswer = answer === correctAnswer;

  const onClick = () => {
    setHasBeenClicked(true);

    if(isRightAnswer) {
      onRightAnswer();
    } else {
      onWrongAnswer();
    }
  }

  const buttonColor = hasBeenClicked ? (isRightAnswer ? "success" : "error") : "primary"
  return (
    <Button fullWidth size="large" variant="contained" onClick={onClick} color={buttonColor}>{answer}</Button>
  );
}

type AnswerArrayProps = {
  question: MathQuestion,
  onRightAnswer: () => void,
  onWrongAnswer: () => void  
}

const AnswerArray = ({question, onRightAnswer, onWrongAnswer} : AnswerArrayProps) => {
  var buttons = question.answers.map((x) => <AnswerButton answer={x} 
    correctAnswer={question.answer} 
    onRightAnswer={onRightAnswer} 
    onWrongAnswer={onWrongAnswer} 
  />);

  return (
    <Grid container spacing={2}>
      {buttons.map((x) => <Grid item xs={4}>{x}</Grid>)}
    </Grid>
  );
}

type AnswerFieldProps = {
  question: MathQuestion,
  onRightAnswer: () => void,
  onWrongAnswer: () => void  
}

const AnswerField = ({question, onRightAnswer, onWrongAnswer} : AnswerFieldProps) => {
  const [text, setText] = useState("")
  const [error, setError] = useState(false)

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
  }

  const handleTextKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if((event.key === "Enter") && (text !== "")) {
      const parsedInt = parseInt(text);
      if(parsedInt) {
        if(parsedInt === question.answer)  
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
  question: MathQuestion,
  multipleChoices: boolean,
  onRightAnswer: () => void,
  onWrongAnswer: () => void   
}

const Question = ({question, multipleChoices, onRightAnswer, onWrongAnswer}: QuestionProps) => {
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
        question={question} 
        onRightAnswer={rightAnswer} 
        onWrongAnswer={wrongAnswer} 
      />
    } else {
      return <AnswerField 
        question={question}
        onRightAnswer={rightAnswer} 
        onWrongAnswer={wrongAnswer} 
      />
    }
  }

  var opCharacter = "x"
  switch(question.type) {
    case OperationType.Multiplication:
      opCharacter = "x";
      break;
    case OperationType.Division:
      opCharacter = "/";
      break;
    case OperationType.Addition:
      opCharacter = "+";
      break;
    case OperationType.Subtraction:
      opCharacter = "-";
  }

  return(
    <>
      <Typography variant="h3">{question.op1} {opCharacter} {question.op2}</Typography>
      {answerInput()}
    </>
  );
}

export { Question }