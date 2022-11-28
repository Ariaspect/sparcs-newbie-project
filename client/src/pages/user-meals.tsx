import React from "react";
import axios from "axios";
import { APIBase } from "../tools/api";
import { Form, useLoaderData } from "react-router-dom";

interface MealItem {
    name: string,
    qty: number,
}
interface MealAPI {
    _id: string,
    mealType: string,
    food: [MealItem],
}
interface usernameRes {
    username: string
}

const MealPage = () => {

    const { username } = useLoaderData() as usernameRes;
    const [ mealList, setMealList ] = React.useState<MealAPI[]>([]);

    React.useEffect( () => {
        const asyncFun = async () => {
            const { data } = await axios.get<MealAPI[]>(APIBase + "/meal" + "/getMeals" + "?username=" + username);
            setMealList(data);
        };
        asyncFun().catch( (e) => window.alert(`Error fetching Meal List: ${ e }`) );
        // return () => {

        // };
    })

    return (
        <>
            <h2>Meal List</h2>
            <div className="meal-list">
                { mealList.map( (meal) =>
                    <div>
                        <h3>{meal.mealType}</h3>
                        { meal.food.map( (foodItem) =>
                            <p>{foodItem.name} x {foodItem.qty}</p>
                        ) }
                    </div> 
                ) }
            </div>
        </>
    
    )
}

export default MealPage;