import React from "react";
import axios from "axios";
import { APIBase } from "../tools/api";
import { Form, useLoaderData } from "react-router-dom";
import Modal from "react-modal";

import AddMealModal from "./user-meals-modal";

import "./css/user-meals.css"


interface MealItem {
    name: string,
    qty: number,
}
interface MealAPI {
    _id: string,
    mealType: number,
    food: [MealItem],
    date: string,
}
interface usernameRes {
    username: string
}

const mealTypeEnum = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const MealPage = () => {

    const [ modalState, setModalState ] = React.useState(false);

    const callbackModal = () => {
        setModalState(false);
    }
    const editMealHandler = (mealType: number, mealDate: string) => {
        const asyncFun = async () => {
            const { data } = await axios.post<MealAPI>(APIBase + "/meal" + "/getMeal", {mealType, mealDate, username});
            setMealData(data);
            setModalState(true);
        };
        asyncFun().catch( (e) => window.alert(`Error fetching Meal data: ${ e }`) );
    }

    const { username } = useLoaderData() as usernameRes;
    const [ mealList, setMealList ] = React.useState<MealAPI[]>([]);
    const [ mealData, setMealData ] = React.useState<MealAPI>({ _id: "", mealType: 0, food: [{name: "", qty: 1}], date: ""});

    React.useEffect( () => {
        const asyncFun = async () => {
            const { data } = await axios.get<MealAPI[]>(APIBase + "/meal" + "/getMeals" + "?username=" + username);
            setMealList(data);
        };
        asyncFun().catch( (e) => window.alert(`Error fetching Meal List: ${ e }`) );
        // return () => {

        // };
    })

    const deleteHandler = (meal: MealAPI) => {
        const asyncFun = async () => {
            console.log(meal._id);
            await axios.post(APIBase + "/meal" + "/deleteMeals", { mealType: meal.mealType, mealDate: meal.date, username } );
        }
        asyncFun().catch( (e) => window.alert(`Error deleting from Meal List: ${ e }`));
    }

    return (
        <>
            <h2>Meal List</h2>
            <div className="meal-list">
                { Array
                    .from(mealList.reduce( (dateset, meal) => dateset.add(meal.date), new Set<string>() ))
                    .sort()
                    .map( (date) => // per date
                        <fieldset className={"day-block"}>
                            <legend>
                                &nbsp;{date}&nbsp;
                                <span>
                                </span>
                            </legend>
                            { mealList.filter( (meal) => meal.date === date )
                            .sort( (a, b) => a.mealType - b.mealType )
                            .map( (meal) => // per meal
                                <div className={"meal-block"}>
                                    <p className={"x-button"} onClick={ () => {deleteHandler(meal)} }><h3 className="x-button-h3">x</h3></p>
                                    <h3 className={"meal-type"} onClick={ () => {editMealHandler(meal.mealType, meal.date)} }>{mealTypeEnum[meal.mealType]}</h3>
                                    { meal.food.map( (foodItem) =>  // per foodItem
                                        <p className={"food-item"}>{foodItem.name} x {foodItem.qty}</p>
                                    ) }
                                </div>
                            )}
                        </fieldset>
                    )
                }
            </div>
            <Modal 
                isOpen={modalState} 
                onRequestClose={ () => setModalState(false) }
                style={ { overlay: { backgroundColor: 'rgba(0, 0, 0, 0.60' } } }
            >
                <AddMealModal onClickClose={callbackModal} username={username} editflag={true} editdata={mealData}></AddMealModal>
            </Modal>
        </>
    
    )
}

export default MealPage;