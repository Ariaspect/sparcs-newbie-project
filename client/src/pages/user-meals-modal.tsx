import React from "react";
import axios from "axios";
import { APIBase } from "../tools/api";
import { Form, useLoaderData } from "react-router-dom";

import "./css/addmeal.css"

type Props = {
    onClickClose: () => void,
    username: string,
    editflag: boolean,
    editdata: MealAPI,
}

interface MealItem {
    name: string,
    qty: number,
}
interface MealAPI {
    _id: Object,
    mealType: number,
    food: [MealItem],
    date: string,
}

interface Preset {
    alias: string,
    preset: string,
}

const AddMealModal = ( { onClickClose, username, editflag, editdata }: Props ) => {
    const [ mealType, setMealType ] = React.useState<number>(editflag ? editdata.mealType : 0);
    const [ mealDate, setMealDate ] = React.useState<string>(editflag ? editdata.date : "");
    const [ foodList, setFoodList ] = React.useState<MealItem[]>(editflag ? editdata.food : [{ name: "", qty: 1 }])

    const [ presetList, setPresetList ] = React.useState<Preset[]>([]);

    React.useEffect( () => {
        const asyncFun = async () => {
            const { data } = await axios.get<Preset[]>(APIBase + "/preset" + "/getPresets" + "?username=" + username);
            setPresetList(data);
        };
        asyncFun().catch( (e) => window.alert(`Error fetching Preset List: ${ e }`) );
    }, [])

    const getMealType = () => {
        return <select onChange={ (event) => setMealType(parseInt(event.target.value)) }>
            <option value="0" selected={mealType == 0 ? true : false}>breakfast</option>
            <option value="1" selected={mealType == 1 ? true : false}>lunch</option>
            <option value="2" selected={mealType == 2 ? true : false}>dinner</option>
            <option value="3" selected={mealType == 3 ? true : false}>snack</option>
        </select>
    }

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

    const applyPreset = (index: number, event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.value.startsWith('#')) {
            const preset = presetList.filter( (preset) => preset.alias === event.target.value.slice(1));
            if (preset.length > 0) {
                const temp = [...foodList];
                temp[index].name = preset[0].preset;
                setFoodList(temp);
            }
        }
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
            <span>Meal: {getMealType()} Date: </span>
            <input type={"date"} value={mealDate} onChange={ (event) => setMealDate(event.target.value) }/>
            <button className={"close-button"} onClick={onClickClose}>close</button>
            <br/>
            { foodList.map( (foodItem, index) => (
                <div className={"input-field"} key={index}>
                    <input name={"name"} className={"food-name"} type={"text"} value={foodItem.name} onChange={ (event) => changeFoodItem(index, event) } onBlur={ (event) => applyPreset(index, event) }/>
                    <span className={"food-x"}>×</span><span className={"minus"} onClick={ () => onClickPlusMinus("minus", index) }>-</span><input name={"qty"} className={"food-qty"} type={"text"} value={foodItem.qty}/><span className={"plus"} onClick={ () => onClickPlusMinus("plus", index) }>+</span>
                    <button className={"food-remove-button"} onClick={ () => removeFoodItem(index) }>Remove</button>
                </div>
            ))}
            
            <button className={"addfood-button"} onClick={addFoodItem}>Add Food</button>
            <button className={"submit-button"} onClick={onSubmitHandler}>Submit</button>
        </>
    )
}

export default AddMealModal;