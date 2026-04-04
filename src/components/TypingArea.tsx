import { useTypingEngine } from '../hooks/useTypingEngine'
import type { GameState, Options, SessionData } from '../utils/dataTypes'

export const TypingArea = ( { options, sessionData, gameState, setGameState } : { options: Options, sessionData: SessionData, gameState: GameState, setGameState: (val: GameState) => void } ) => {
  const {wordList, index, isTyping, isLoading, timeLeft, gameData} = useTypingEngine(options, sessionData, gameState, setGameState);

  if (isLoading) {
    return <span className="loading">Loading...</span>
  }

  if (wordList)

  return (
    <>
    <div className="typingContainer">
      {
        (gameState == "playing") && 
        <div>{timeLeft}</div>
      }
      
      {
        (gameState == "waiting" || gameState == "playing") && 
        wordList.map((char, indexChar) => {
          if (index == indexChar) {
            return <span className={char.status}><span className={!isTyping ? "indexCursor blink" : "indexCursor"}>|</span>{char.expected}</span>
          } else {
            return <span className={char.status}>{char.expected}</span>
          }
        })
      }

      {
        (gameState == "end" && gameData) && 
        <div className="endGameContainer">
          Right Chars <div className="endGameItem">{gameData.rightWords}</div>
          <br></br> 
          Wrong Chars <div className="endGameItem">{gameData.wrongWords}</div> 
          <br></br> 
          Total Time  <div className="endGameItem">{gameData.totalTime}</div>
        </div>
      }
    </div>

    {
      (gameState == "end") && 
      <div className="hintContainer">
        <div className="actionHint">press <div className="key">Enter</div> to continue</div>
        <div className="actionHint">start typing to try again</div>
      </div>
    }

    {
      (gameState == "waiting") &&
      <div className="actionHint">start typing to play</div>
    }
    </>
  )
}

export default TypingArea
