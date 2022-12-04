import React from "react";
import axios from "axios";
import { APIBase } from "../tools/api";
import { useNavigate, Outlet, useLoaderData } from "react-router-dom";
import Modal from "react-modal";

import AddMealModal from "./user-meals-modal";

import './css/user.css';

export async function loader({ params }) {
    return { username: params.username };
}

const UserPage = () => {

    const { username } = useLoaderData();
    const navigate = useNavigate();

    const [ modalState, setModalState ] = React.useState(false);

    const callbackModal = () => {
        setModalState(false);
    }

    return (
        <>
            <div className="sidebar">
                <h3 className="account-username">
                    Hello! {username}
                </h3>
                <h3 onClick={ (e) => navigate("/user/" + username + "/meals") }>MEALS</h3>
                <h3 onClick={ (e) => setModalState(true) }>ADD MEALS</h3>
                <Modal 
                    isOpen={modalState} 
                    onRequestClose={ () => setModalState(false) }
                    style={ { overlay: { backgroundColor: 'rgba(0, 0, 0, 0.60' } } }
                >
                    <AddMealModal onClickClose={callbackModal} username={username}></AddMealModal>
                </Modal>
            </div>
            <Outlet/>
        </>
    
    )
}

export default UserPage;