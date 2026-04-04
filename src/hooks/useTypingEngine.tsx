import { useState, useEffect, useRef } from 'react'
import { postScore } from '../utils/apiCalls'
import type { TypedChar, StatisticsData, CharStatus, GameState, Options, SessionData } from '../utils/dataTypes'


function isAlpha(char: string) {
  return /^[ a-zA-Z0-9.,?!]$/.test(char)
}

const useFetchHandler = (count: number) => {
    const [wordString, setWordString] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // Synchronize with option count
    useEffect(() => {
        fetch("/3000englishwords.txt").then(response => response.text()).then((txt) => {
            let data: string[] = txt.split("\n")

            for (let i = 0; i < count; i++) {
                let rand: number = Math.floor(Math.random() * 3000)
                data[i] = data[rand]
            }

            setWordString(data.slice(0, count).join(" "))
            
            setIsLoading(false)
        })
    }, [count])

    return {wordString, isLoading}
}

const useTimerHandler = (timeCount: number) => {
    const [timeLeft, setTimeLeft] = useState<number>(timeCount)
    const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const [gameDataTime, setGameDataTime] = useState<StatisticsData>({
        rightWords: 0,
        wrongWords: 0,
        totalTime: 0
    });

    const startTimer = () => {
        setGameDataTime(prevData => {prevData.totalTime = timeCount; return prevData})
        timeoutRef.current = setInterval(() => {setTimeLeft(prevTime => {return prevTime-1;})}, 1000)
    }

    const endTimer = () => {
        if (timeoutRef.current) {
            setGameDataTime(prevData => {prevData.totalTime = prevData.totalTime - timeLeft; return prevData})
            setTimeLeft(timeCount)
            clearInterval(timeoutRef.current);
            timeoutRef.current = null;
        }
    }

    const resetGameDataTime = () => {
        setGameDataTime({
            rightWords: 0,
            wrongWords: 0,
            totalTime: 0
        });
    }

    // Synchronize with option timeCount
    useEffect(() => {
        setTimeLeft(timeCount);
    }, [timeCount])

    // Destruct
    useEffect(() => {
        return () => endTimer();
    }, [])

    return {timeLeft, gameDataTime, resetGameDataTime, startTimer, endTimer}
    
}

const useCharListHandler = (wordString: string | undefined) => {
    const [wordList, setWordList] = useState<TypedChar[]>()
    const indexRef = useRef<number>(0)
    const [index, setIndex] = useState<number>(0);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const timerCountdown = 200
    const [gameDataWords, setGameDataWords] = useState<StatisticsData>({
        rightWords: 0,
        wrongWords: 0,
        totalTime: 0
    })

    const resetIndex = () => {
        indexRef.current = 0
        setIndex(0)
    }

    const resetWordList = () => {
        if (wordString) {
            setWordList(wordString.split("").map(char => ({
                expected: char,
                actual: null,
                status: "pending"
            })))
        }
    }

    const updateWordList = (index: number, _actual: string | null, _status: CharStatus) => {
            setWordList(prevChars => {
                if (prevChars) {                    
                    prevChars[index] = {
                        ...prevChars[index],
                        actual: _actual,
                        status: _status
                    }

                    return prevChars;
                }
            })
    }

    const resetGameDataWords = () => {
        setGameDataWords({
            rightWords: 0,
            wrongWords: 0,
            totalTime: 0
        });
    }

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Keyboard event handler
        if (isAlpha(e.key)) {
            if (wordString) {
                setIsTyping(true)
                
                // Index bounding behavior
                if (indexRef.current == wordString.length) return

                // Update current char status and actual
                if (e.key === wordString[indexRef.current]) {
                    updateWordList(indexRef.current, e.key, "correct")
                    setGameDataWords(prevData => ({ ...prevData, rightWords: prevData.rightWords + 1}))
                } else {
                    updateWordList(indexRef.current, e.key, "incorrect")
                    setGameDataWords(prevData => ({ ...prevData, wrongWords: prevData.wrongWords + 1}))
                }

                indexRef.current += 1;
                setIndex(prevIndex => prevIndex + 1)
            }
        } else if (e.key == "Backspace") {
            // Index bounding behavior
            if (indexRef.current == 0) return

            // Default current char status and actual
            updateWordList(indexRef.current - 1, null, "pending")

            indexRef.current -= 1;
            setIndex(prevIndex => prevIndex - 1)
        }

        // Is typing logic
        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current)
        }

        typingTimerRef.current = setTimeout(() => {
            setIsTyping(false)
        }, timerCountdown)

    }

    window.addEventListener("keydown", handleKeyDown)

    // Initialize wordList
    resetWordList()

    return () => {
        window.removeEventListener('keydown', handleKeyDown)
    }
    }, [wordString])

    return {wordList, index, isTyping, gameDataWords, resetGameDataWords, resetIndex, resetWordList, updateWordList}
}

export const useTypingEngine = (options: Options, sessionData: SessionData, gameState: GameState, setGameState: (val: GameState) => void) => {
    // Initialize hooks for index (current char) and chars list
    const {wordString, isLoading} = useFetchHandler(options.words)
    const {timeLeft, gameDataTime, resetGameDataTime, startTimer, endTimer} = useTimerHandler(options.time)
    const {wordList, index, isTyping, gameDataWords, resetGameDataWords, resetIndex, resetWordList} = useCharListHandler(wordString)
    const [gameData, setGameData] = useState<StatisticsData | null>(null)

    useEffect(() => {
        window.addEventListener("keypress", (e) => {
            if (e.key == "Enter") {
                resetGameDataTime();
                resetGameDataWords();
                setGameState("waiting")
            }
        })
    }, [])

    // Start game
    useEffect(() => {
        if (isTyping && (gameState != "playing")) {
            setGameState("playing")
            resetGameDataTime()
            resetGameDataWords()
            startTimer()
        }
    }, [isTyping])

    // End game
    useEffect(() => {
        console.log(index)
        if (((gameState == "playing") && timeLeft == 0) || ((gameState == "playing") && index >= (wordList ? wordList.length : -1))) {
            setGameState("end")
            endTimer()
            resetIndex()
            resetWordList()
            setGameData(({rightWords: gameDataWords.rightWords, wrongWords: gameDataWords.wrongWords, totalTime: gameDataTime.totalTime - timeLeft}))
            postScore({rightWords: gameDataWords.rightWords, wrongWords: gameDataWords.wrongWords, totalTime: gameDataTime.totalTime}, sessionData.username)
        }
    }, [timeLeft, index])


    return {wordList, index, isTyping, isLoading, timeLeft, gameData}
}

export default useTypingEngine
