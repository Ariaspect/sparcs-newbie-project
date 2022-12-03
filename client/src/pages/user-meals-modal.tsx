import React from "react";
import axios from "axios";
import { APIBase } from "../tools/api";
import { Form, useLoaderData } from "react-router-dom";

import "./css/addmeal.css"

type Props = {
    onClickClose: () => void,
}

interface MealItem {
    name: string,
    qty: number,
}

const AddMealModal = ( { onClickClose }: Props ) => {
    const [ foodList, setFoodList ] = React.useState<MealItem[]>([{ name: "", qty: 1 }])

    const addFoodItem = () => {
        setFoodList([...foodList, { name: "", qty: 1}]);
    }
    const removeFoodItem = (index: number) => {
        const temp = [...foodList];
        temp.splice(index, 1);
        setFoodList(temp);
    }

    return (
        <>
            <button onClick={onClickClose}>close</button>
            <br/>
            { foodList.map( (foodItem, index) => (
                <div className={"input-field"}>
                    <input className={"food-name"} type={"text"}/>
                    <span className={"food-x"}>×</span><span className={"minus"}>-</span><input className={"food-qty"} type={"text"} value={foodItem.qty}/><span className={"plus"}>+</span>
                    <button className={"remove-button"} onClick={ () => removeFoodItem(index) }>Remove</button>
                </div>
            ))}
            
            <button onClick={addFoodItem}>Add Food</button>
            
        </>
    )
}

export default AddMealModal;