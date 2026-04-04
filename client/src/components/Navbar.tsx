import { useNavigate } from "react-router-dom"
import type { SessionData } from "../utils/dataTypes"

export const Navbar = ({ sessionData } : { sessionData: SessionData }) => {
    const navigate = useNavigate()
    
    return (
        <div id="navbar">
            <span className="pageTitle" onClick={() => {navigate("/")}}>TypeRush</span>
            <div className="restContainer">
                {!sessionData.loggedIn && <span className="item" onClick={() => {navigate("/auth")}}>Login</span>}
                {sessionData.loggedIn && <span className="item" onClick={() => {navigate("/stats")}}>{sessionData.username}</span>}
            </div>
        </div>
    )
}

export default Navbar