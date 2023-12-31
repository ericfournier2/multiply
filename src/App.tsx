import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import useLocalStorage from './Storage'
import { Options } from './Options';
import { defaultGameOptions} from './Modes';
import ModeSelect from './ModeSelect';
import type { GameOptions } from './Modes';
import Quiz from './Quiz';
import type { Profile, ExamResults } from './Profiles';
import Profiles from './Profiles';
import { generateQuiz } from './QuizGenerator';

function getActiveProfile(profiles: Array<Profile>) {
  return profiles.find((x) => x.active)
}

function App() {
  const [started, setStarted] = useState(false);
  const [quizKey, setQuizKey] = useState(0);
  const [options, setOptions] = useState(defaultGameOptions);
  const [id, setId] = useState("timeLimitPractice");
  const [profiles, setProfiles] = useLocalStorage("profiles", []);
  const [quiz, setQuiz] = useState(generateQuiz("defaultQuiz", options))

  // const [activeProfile, setActiveProfile] = useState(profiles.length > 0 ? profiles[0] : undefined)

  const onModeSelect = (id:string, options: GameOptions) => {
    if(options) {
      setOptions(options)
    }
    setQuiz(generateQuiz(id, options))
    setStarted(true)
    setQuizKey(quizKey + 1)
  }

  const onQuit = (results?: ExamResults) => {
    if(results) {
      const newProfiles = [...profiles]
      const activeProfile = getActiveProfile(newProfiles) as Profile;
      if(activeProfile) {
        const examStat = activeProfile.stats.exams.find((x) => x.id === results.id)
        if(examStat) {
          if(!examStat.passed && results.passed) {
            examStat.passed = true;
          }

          if(examStat.score < results.score) {
            examStat.score = results.score
          }
        } else {
          activeProfile.stats.exams.push(results)
        }

        setProfiles(newProfiles)
      }
    }

    setStarted(false);
  }

  const onProfilesChange = (profiles: Array<Profile>) => {
    setProfiles(profiles)
  }

  return (
    <div className="App">
      <AppBar>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Multiplicathlon!
          </Typography>
          <Profiles profiles={profiles} onChange={onProfilesChange} />
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        {!started ?
          <ModeSelect stats={getActiveProfile(profiles)?.stats}  onSelect={onModeSelect}/> :
          <Quiz quiz={quiz} onQuit={onQuit} key={quizKey}/>
        }        
      </Container>
    </div>
  );
}

export default App;
