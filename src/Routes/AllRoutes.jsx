import React from "react";
import { Route, Routes } from "react-router-dom";
import Problems from "../Pages/Problems";
import Signup from "../Pages/Signup";
import Login from "../Pages/Login";
import Profile from "../Pages/Profile";
import Navbar from "../components/Navbar";
import SingleProblem from "../Pages/SingleProblem"; // Import SingleProblem component
import AddQuestions from "../Pages/AddQuestions";
import CreateContest from "../Pages/CreateContest";

const AllRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Problems />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/problem/:id" element={<SingleProblem />} />

      {/* private only admin or superAdmin can access  */}
      <Route path="/createContest" element={<CreateContest />} />
      <Route path="/addQuestion" element={<AddQuestions />} />
    </Routes>
  );
};

export default AllRoutes;
