enum GameType {
  "TimeLimit",
  "SuddenDeath",
  "Endless"
}

type MultiplicationOptions = {
  minNumber: number,
  maxNumber: number,
  useTables: boolean,
  tables: Array<number>,
  excludeZeroAndOne: boolean,  
}

type DivisionOptions = {
  maxNumber: number,  
  tables: Array<number>,
  excludeOne: boolean, 
}

type QuizOptions = {
  mode: GameType,
  timeLimit: number,
  multipleChoices: boolean,
  nQuestions: number,
  threshold: number,
}

type GameOptions = {
  quizOptions: QuizOptions,
  multiplicationOptions?: MultiplicationOptions,
  divisionOptions?: DivisionOptions
}

const defaultMultiplicationOptions : MultiplicationOptions = {
  minNumber: 2,
  maxNumber: 10,
  useTables: true,
  tables: [2, 3, 5, 10],
  excludeZeroAndOne: true,  
}

const defaultDivisionOptions : DivisionOptions = {
  maxNumber: 10,
  tables: [2, 3, 5, 10],
  excludeOne: true,  
}

const defaultQuizOptions: QuizOptions = {
  mode: GameType.TimeLimit,
  timeLimit: 1,
  multipleChoices: false,
  nQuestions: 20,
  threshold: 18,
}

const defaultGameOptions: GameOptions = {
  quizOptions: defaultQuizOptions,
  multiplicationOptions: defaultMultiplicationOptions,
  divisionOptions: defaultDivisionOptions
}

function makeBeltOptions(multTables?: Array<number>, divTables?: Array<number>): GameOptions {
  const quizOptions = {...defaultQuizOptions}

  var multOptions = undefined;
  if(multTables) {
    multOptions = {...defaultMultiplicationOptions}
    multOptions.tables = multTables;
  }

  var divOptions = undefined;
  if(divTables) {
    divOptions = {...defaultDivisionOptions}
    divOptions.tables = divTables;
  }

  return {quizOptions:quizOptions, multiplicationOptions: multOptions, divisionOptions: divOptions}
}

const examsDefinitions = [
  {
    id: "BELT_1",
    label: "Ceinture blanche",
    desc: "Tables du 2 et du 3!",
    icon: "belt.svg",
    options: makeBeltOptions([2,3], undefined)
  },
  {
    id: "BELT_2",    
    label: "Ceinture jaune",
    desc: "Tables du 2, du 3, du 5 et du 10!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 5, 10], undefined)    
  },
  {
    id: "BELT_3",    
    label: "Ceinture orange",
    desc: "Tables de 2 à 5 et de 10!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 10], undefined)        
  },    
  {
    id: "BELT_4",    
    label: "Ceinture vert pâle",
    desc: "Tables de 2 à 6 et de 10!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 10], undefined)            
  },    
  {
    id: "BELT_5",    
    label: "Ceinture vert forêt",
    desc: "Tables de 2 à 7 et de 10!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 7, 10], undefined)     
  },  
  {
    id: "BELT_6",    
    label: "Ceinture bleu pâle",
    desc: "Tables de 2 à 8 et de 10!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 7, 8, 10], undefined)     
  },   
  {
    id: "BELT_7",    
    label: "Ceinture bleu foncé",
    desc: "Tables de 2 à 10!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 7, 8, 9, 10], undefined)     
  },   
  {
    id: "BELT_8",    
    label: "Ceinture rose",
    desc: "Divisions jusqu'à 6!",
    icon: "belt.svg",
    options: makeBeltOptions(undefined, [2, 3, 4, 5, 6])     
  },   
  {
    id: "BELT_9",    
    label: "Ceinture rouge",
    desc: "Divisions jusqu'à 10!",
    icon: "belt.svg",
    options: makeBeltOptions(undefined, [2, 3, 4, 5, 6, 7, 8, 9, 10])     
  },       
  {
    id: "BELT_10",    
    label: "Ceinture noire",
    desc: "Toutes les opérations!",
    icon: "belt.svg",
    options: makeBeltOptions([2, 3, 4, 5, 6, 7, 8, 9, 10], [2, 3, 4, 5, 6, 7, 8, 9, 10])     
  },      
]

export { GameType, examsDefinitions, defaultGameOptions }
export type { QuizOptions, MultiplicationOptions, DivisionOptions, GameOptions }