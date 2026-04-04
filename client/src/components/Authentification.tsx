import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyLoginAndRoute, postAuthDataAndLogin } from '../utils/apiCalls'
import type {AuthData, SessionData} from '../utils/dataTypes'

export const Authentification = ({setSessionData} : {setSessionData: (val: SessionData) => void}) => {
    const [switchAuth, setSwitchAuth] = useState<boolean>(true)
    const [fieldData, setFieldData] = useState<AuthData>({username: "", password: ""})
    const navigate = useNavigate()

    return (
        <>
            {
            switchAuth && 
            <div className="authContainer">
                <span>Login</span>
                <div className="loginContainer">
                    <span>Username </span>
                    <input onChange={(e) => {setFieldData(prevFieldData => {prevFieldData.username = e.target.value; return prevFieldData})}}></input>
                    <br></br>
                    <span>Password </span>
                    <input type="password" onChange={(e) => {setFieldData(prevFieldData => {prevFieldData.password = e.target.value; return prevFieldData})}}></input>
                    <br></br>
                    <button onClick={()=>{verifyLoginAndRoute(fieldData, navigate, setSessionData)}}>Send</button>
                </div>
            </div>
            }

            {
            !switchAuth && 
            <div className="authContainer">
                <span>Register</span>
                <div className="loginContainer">
                    <span>Username </span>
                    <input onChange={(e) => {setFieldData(prevFieldData => {prevFieldData.username = e.target.value; return prevFieldData})}}></input>
                    <br></br>
                    <span>Password </span>
                    <input type="password" onChange={(e) => {setFieldData(prevFieldData => {prevFieldData.password = e.target.value; return prevFieldData})}}></input>
                    <br></br>
                    <button onClick={()=>{postAuthDataAndLogin(fieldData, navigate, setSessionData)}}>Send</button>
                </div>
            </div>
            }

            <button className="switchAuth" onClick={() => {setSwitchAuth(prevSwitchAuth => !prevSwitchAuth)}}>I want to {switchAuth == true ? "Register" : "Login"}</button>
        </>
    )
}

export default Authentification