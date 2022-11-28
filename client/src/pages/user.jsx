import React from "react";
import axios from "axios";
import { APIBase } from "../tools/api";
import { useNavigate, Outlet, useLoaderData } from "react-router-dom";

export async function loader({ params }) {
    return { username: params.username };
}

const UserPage = () => {

    const { username } = useLoaderData();
    const navigate = useNavigate();

    return (
        <>
            <div className="account-username">
                Hello! {username}
            </div>
            <button onClick={ (e) => navigate("/user/" + username + "/meals") }>show meals</button>
            <Outlet/>
        </>
    
    )
}

export default UserPage;