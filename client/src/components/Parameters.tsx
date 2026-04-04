import type { GameState, Options } from "../utils/dataTypes"
import { OPTIONSTIME, OPTIONSWORDS } from "../utils/dataTypes"

export const Parameters = ({ options, gameState, setOptions } : { options: Options, gameState: GameState, setOptions: (val: Options) => void }) => {    
    return (
        (gameState == "waiting") && 
        <div className="parametersContainer">
            <div className="parameters">
                <span>Time</span>
                {
                    OPTIONSTIME.map((option) => {
                        return <p className={(option == options.time ? "selected" : "deselected")} onClick={() => {setOptions({time: option, words: options.words})}}>{option}</p>
                    })
                }
            </div>

            <div className="parameters">
                <span>Words</span>
                {
                    OPTIONSWORDS.map((option) => {
                        return <p className={(option == options.words) ? "selected" : "deselected"} onClick={() => {setOptions({time: options.time, words: option})}}>{option}</p>
                    })
                }
            </div>
        </div>
    )
}

export default Parameters