import React from "react";
import axios from "axios";
import { APIBase } from "../tools/api";
import { Form, useLoaderData } from "react-router-dom";

import "./css/addmeal.css"

type Props = {
    onClickClose: () => void,
    username: string,
}

interface MealItem {
    name: string,
    qty: number,
}

const AddMealModal = ( { onClickClose, username }: Props ) => {
    const [ mealType, setMealType ] = React.useState<string>("breakfast");
    const [ mealDate, setMealDate ] = React.useState<string>("");
    const [ foodList, setFoodList ] = React.useState<MealItem[]>([{ name: "", qty: 1 }])

    const addFoodItem = () => {
        setFoodList([...foodList, { name: "", qty: 1}]);
    }
    const changeFoodItem = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const temp = [...foodList];
        if (event.target.name === "name") {
            temp[index]["name"] = event.target.value;
        } else if (event.target.name === "qty") {
            temp[index]["qty"] = parseInt(event.target.value);
        }
        setFoodList(temp);
    }
    const removeFoodItem = (index: number) => {
        const temp = [...foodList];
        temp.splice(index, 1);
        setFoodList(temp);
    }

    const onClickPlusMinus = (option: string, index: number) => {
        const temp = [...foodList];
        if (option === "plus") {
            temp[index].qty += 1;
        } else if (option === "minus") {
            if (temp[index].qty > 1) {
                temp[index].qty -= 1;
            }
        }
        setFoodList(temp);
    }

    const onSubmitHandler = () => {
        const data = { mealType, foodList, mealDate };
        const asyncFun = async () => {
            await axios.post(APIBase + "/meal" + "/addMeals", { data, username } );
        }
        asyncFun().catch( (e) => window.alert(`Error adding to Meal List: ${ e }`));
        onClickClose();
    }

    return (
        <>
            Meal:
            <select onChange={ (event) => setMealType(event.target.value) }>
                <option value={"breakfast"}>breakfast</option>
                <option value={"lunch"}>lunch</option>
                <option value={"dinner"}>dinner</option>
                <option value={"snack"}>snack</option>
            </select>
            Date:
            <input type={"date"} onChange={ (event) => setMealDate(event.target.value) }/>
            <button onClick={onClickClose}>close</button>
            <br/>
            { foodList.map( (foodItem, index) => (
                <div className={"input-field"} key={index}>
                    <input name={"name"} className={"food-name"} type={"text"} onChange={ (event) => changeFoodItem(index, event) }/>
                    <span className={"food-x"}>×</span><span className={"minus"} onClick={ () => onClickPlusMinus("minus", index) }>-</span><input name={"qty"} className={"food-qty"} type={"text"} value={foodItem.qty}/><span className={"plus"} onClick={ () => onClickPlusMinus("plus", index) }>+</span>
                    <button className={"remove-button"} onClick={ () => removeFoodItem(index) }>Remove</button>
                </div>
            ))}
            
            <button onClick={addFoodItem}>Add Food</button>
            <button onClick={onSubmitHandler}>Submit</button>
        </>
    )
}

export default AddMealModal;