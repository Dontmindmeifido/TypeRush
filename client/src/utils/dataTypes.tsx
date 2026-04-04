export type GameState = "waiting" | "playing" | "end"
export type CharStatus = "pending" | "correct" | "incorrect"
export type TimeOption = 5 | 10 | 20 | 30
export type WordsOption = 10 | 25 | 50 | 75

export interface TypedChar {
  expected: string,
  actual: string | null,
  status: CharStatus
}

export interface StatisticsData {
    rightWords: number;
    wrongWords: number;
    totalTime: number;
}

export interface AuthData {
    username: string,
    password: string
}

export interface SessionData {
    username: string,
    loggedIn: boolean
}

export interface Options {
    time: TimeOption,
    words: WordsOption
}

export const OPTIONSWORDS: WordsOption[] = [10, 25, 50, 75]
export const OPTIONSTIME: TimeOption[] = [5, 10, 20, 30]


