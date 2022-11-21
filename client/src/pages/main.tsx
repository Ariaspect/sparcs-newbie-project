import React, { useState, useEffect } from "react";
import axios from "axios";
import { APIBase } from "../tools/api";
import { useInterval } from "../tools/interval";

const MainPage = () => {
    const [ BStatus, setBStatus ] = React.useState<Boolean>(false);

    interface BStatusRes { isOnline: boolean };
    const checkBStatus = async () => {
        const res = await axios.get<BStatusRes>(APIBase + "/status");
        setBStatus(res.data.isOnline);
    }
    useInterval(() => {
        checkBStatus().catch((e) => setBStatus(false));
    }, 1000);

    return (
        <div className="server-status">
            { BStatus ? "Connection success!" : "Not connected." }
        </div>
    )
}

export default MainPage;