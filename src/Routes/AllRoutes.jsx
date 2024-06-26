import React from "react";
import { Route, Routes } from "react-router-dom";
import Problems from "../Pages/Problems";
import Signup from "../Pages/Signup";
import Login from "../Pages/Login";
import SingleProblem from "../Pages/SingleProblem"; // Import SingleProblem component
import AddQuestions from "../Pages/AddQuestions";
import CreateContest from "../Pages/CreateContest";
import Profile from "../Pages/Profile";
import PrivateRouteAdmin from "./PrivateRouteAdmin";
import { useSelector } from "react-redux";

const AllRoutes = () => {
  let { user, isLogin } = useSelector((store) => store.data);

  return (
    <Routes>
      <Route exact path="/" element={<Problems />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/problem/:id" element={<SingleProblem />} />
      <Route path="/profile" element={<Profile />} />

      {/* Private Routes only for admin or superAdmin */}
      {isLogin && (user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
        <>
          <Route 
            path="/createContest" 
            element={
              <PrivateRouteAdmin>
                <CreateContest />
              </PrivateRouteAdmin>
            } 
          />
          <Route 
            path="/addQuestion" 
            element={
              <PrivateRouteAdmin>
                <AddQuestions />
              </PrivateRouteAdmin>
            } 
          />
        </>
      )}
    </Routes>
  );
};

export default AllRoutes;
