import {randomInteger, randomIntegerInRange, shuffleArray} from './Utils';
import type { GameOptions, MultiplicationOptions, DivisionOptions } from './Modes';

enum OperationType {
  "Multiplication",
  "Division",
  "Addition",
  "Subtraction"
}

type MathQuestion = {
  type: OperationType,
  answer: number,
  answers: Array<number>,
  op1: number,
  op2: number,
}

function mathOp(type: OperationType, arg1: number, arg2: number): number {
  switch(type) {
    case OperationType.Multiplication:
      return arg1 * arg2;
    case OperationType.Division:
      return arg1 / arg2;
    case OperationType.Addition:
      return arg1 + arg2;
    case OperationType.Subtraction:
      return arg1 - arg2;
    default:
      return 0;
  }
}

function generateAnswersArray(type: OperationType, op1: number, op2: number, nAnswers: number) {
  var answers = [mathOp(type, op1, op2)]
  var tries = 0;

  while(answers.length < nAnswers && tries < 100) {
    var candidateError = 0;
    var errorType = randomInteger(2)
    if(errorType == 0) {
      candidateError = mathOp(type, op1, op2) + randomIntegerInRange(-3, 3)
    } else {
      candidateError = mathOp(type, op1 + randomIntegerInRange(-2, 2), op2 + randomIntegerInRange(-2, 2))
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

type Quiz = {
  id: string,
  questions: Array<MathQuestion>,
  options: GameOptions,
}

function generateMultiplication(options: MultiplicationOptions, nAnswers: number): MathQuestion {
  let op1 = 0;
  let op2 = 0;

  if(!options.useTables) {
    op1 = randomIntegerInRange(options.minNumber, options.maxNumber);
    op2 = randomIntegerInRange(options.minNumber, options.maxNumber);
  } else {
    op1 = options.tables[randomIntegerInRange(0, options.tables.length)];
    if(options.excludeZeroAndOne) {
      op2 = randomIntegerInRange(2, options.maxNumber);
    } else {
      op2 = randomIntegerInRange(0, options.maxNumber);
    }
  }

  return {
    type: OperationType.Multiplication,
    op1:op1, 
    op2:op2,
    answer: op1 * op2,
    answers: generateAnswersArray(OperationType.Multiplication, op1, op2, nAnswers)
  }  
}

function generateDivision(options: DivisionOptions, nAnswers: number): MathQuestion {
  let op1 = options.tables[randomIntegerInRange(0, options.tables.length)];
  let op2 = randomIntegerInRange(options.excludeOne ? 2 : 1, options.maxNumber);
 
  return {
    type: OperationType.Division,
    op1: op1 * op2, 
    op2: op2,
    answer: op1,
    answers: generateAnswersArray(OperationType.Division, op1, op2, nAnswers)
  }  
}


function generateQuestion(options: GameOptions): MathQuestion {
  if(!options.divisionOptions && !options.multiplicationOptions) {
    console.log("No valid operations!");
    throw Error("No operations")
  } else {
    const validOps:Array<OperationType> = [];
    if(options.multiplicationOptions) {
      validOps.push(OperationType.Multiplication)
    }

    if(options.divisionOptions) {
      validOps.push(OperationType.Division)
    }

    const whichOp = validOps[randomIntegerInRange(0, validOps.length - 1)];
    switch(whichOp) {
      case OperationType.Multiplication:
        return generateMultiplication(options.multiplicationOptions as MultiplicationOptions, options.quizOptions.nQuestions)
        break;
      case OperationType.Division:
        return generateDivision(options.divisionOptions as DivisionOptions, options.quizOptions.nQuestions)
        break;        
      default:
        throw Error("No operations")
    }
  }
}

function generateQuiz(id: string, options: GameOptions): Quiz {
  var questions: Array<MathQuestion> = [];
  for(var i=0; i<options.quizOptions.nQuestions; ++i) {
    questions.push(generateQuestion(options))
  }

  return {
    id: id,
    options: options,
    questions: questions
  }
}

export type { MathQuestion, Quiz}
export {generateQuiz, OperationType}