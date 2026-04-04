import { useState } from "react"
import type { StatisticsData, AuthData, SessionData } from "./dataTypes"


export const postScore = (data: StatisticsData, username: string) => {
    fetch("http://localhost:8000/api/scores", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({"right_words": data.rightWords, "wrong_words": data.wrongWords, "total_time": data.totalTime, "username": username})})
}

export function postAuthDataAndLogin(data : AuthData, navigate: (val: string) => void, setSessionData: (val: SessionData) => void) {
    fetch("http://localhost:8000/api/users/register", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({"username": data.username, "password": data.password})})
    navigate("/")
    setSessionData({username: data.username, loggedIn: true})
    return true;
}

export function verifyLoginAndRoute(data : AuthData, navigate: (val: string) => void, setSessionData: (val: SessionData) => void) {
    fetch("http://localhost:8000/api/users/login", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({"username": data.username, "password": data.password})}).then(response => {
        return response.json()
    }).then(json => {
        let verdict: string = json["message"]

        if (verdict == "logged in") {
            navigate("/")
            setSessionData({username: data.username, loggedIn: true})
        }
    }
    )
}

export function getStatistics(playerUsername: string) {
    const [stats, setStats] = useState<StatisticsData[] | null>(null)
    const [isWaiting, setIsWaiting] = useState<boolean>(false)

    if (!isWaiting) {
        setIsWaiting(true)
        fetch("http://localhost:8000/api/scores/statistics", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({"username": playerUsername})}).then(response => {
            return response.json()
        }).then(json => {
            let arr: StatisticsData[] = []
            for (let x in json["message"]) {
                arr.push({rightWords: Number(json["message"][x][1]), wrongWords: Number(json["message"][x][2]), totalTime: Number(json["message"][x][3])})
            }

            setStats(arr)
        }
        )
    }

    return stats
}