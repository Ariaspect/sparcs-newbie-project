import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { APIBase } from "../tools/api";
import { useInterval } from "../tools/interval";

import "./css/main.css"

const MainPage = () => {

    const navigate = useNavigate();

    // checking server connection
    const [ BStatus, setBStatus ] = React.useState<boolean>(false);

    interface BStatusRes { isOnline: boolean };
    const checkBStatus = async () => {
        const res = await axios.get<BStatusRes>(APIBase + "/status");
        setBStatus(res.data.isOnline);
    }
    useInterval(() => {
        checkBStatus().catch((e) => setBStatus(false));
    }, 2500);

    // input fields
    const [ username, setUsername ] = React.useState<string>("");

    const acquireDB = (username: string) => {
        const asyncFun = async () => {
            await axios.post(APIBase + "/user" + "/initUser", { username: username });
            navigate("/user/" + username);
        }
        asyncFun().catch( (e) => window.alert(e) );
    };

    return (
        <>
            <div className="server-status">
                { BStatus ? <h3 className={"conn-success"}>Connection success!</h3> : <h3 className={"conn-failed"}>Not connected.</h3> }
            </div>
            <div className={"account-action"}>
                Username: <input type={"text"} value={username} onChange={ ((e) => setUsername(e.target.value)) }/>
                <button className={"start-button"} onClick={ ((e) => acquireDB(username)) }>Get Started</button>
            </div>
        </>
    
    )
}

export default MainPage;