import React from "react";
import axios from "axios";
import { APIBase } from "../tools/api";
import { useInterval } from "../tools/interval";

const MainPage = () => {

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

    const acquireDB = async (username: string) => {
        const res = await axios.post(APIBase + "/user" + "/initUser", { username: username });
    };

    return (
        <>
            <div className="server-status">
                { BStatus ? "Connection success!" : "Not connected." }
            </div>
            <div className={"account-action"}>
                Username: <input type={"text"} value={username} onChange={ ((e) => setUsername(e.target.value)) }/>
                <div className={"start-button"} onClick={ ((e) => acquireDB(username)) }>Get Started</div>
            </div>
        </>
    
    )
}

export default MainPage;