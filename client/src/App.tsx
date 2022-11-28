import React from "react";
import { 
  createBrowserRouter, 
  RouterProvider, 
  Route 
} from "react-router-dom";

import MainPage from "./pages/main";
import UserPage, { loader as userLoader } from "./pages/user";
import MealPage from "./pages/user-meals";

import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage/>,
  },
  {
    path: "/user/:username",
    element: <UserPage/>,
    loader: userLoader,
    children: [
      {
        path: "/user/:username/meals",
        element: <MealPage/>,
        loader: userLoader,
      }
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
