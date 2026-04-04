import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { TypingArea } from './components/TypingArea.tsx'
import { Navbar } from './components/Navbar.tsx'
import { Parameters } from './components/Parameters.tsx'
import { Authentification } from './components/Authentification.tsx'
import { Statistics } from './components/Statistics.tsx'

import type { GameState, Options, SessionData } from './utils/dataTypes.tsx'

import './css/App.css'

function App() {
  const [options, setOptions] = useState<Options>({time: 10, words: 50})
  const [gameState, setGameState] = useState<GameState>("waiting")
  const [sessionData, setSessionData] = useState<SessionData>({username: "", loggedIn: false})

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={
          <div className="appLayout">
            <Navbar sessionData={sessionData}/>
            <Parameters options={options} gameState={gameState} setOptions={setOptions}/>
            <TypingArea options={options} sessionData={sessionData} gameState={gameState} setGameState={setGameState}/>
          </div>
        }/>

        <Route path="/auth" element={
          <div className="appLayoutAuth">
            <Navbar sessionData={sessionData}/>
            <Authentification setSessionData={setSessionData}/>
          </div>
        }/>

        <Route path="/stats" element={
          <div className="appLayoutStatistics">
            <Navbar sessionData={sessionData}/>
            <span className="statisticsHeader">Statistics</span>
            <Statistics username={sessionData.username} />
          </div>
        }/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
