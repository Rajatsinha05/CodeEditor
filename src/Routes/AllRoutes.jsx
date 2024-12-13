import React from "react";
import { Route, Routes } from "react-router-dom";
import Problems from "../Pages/Problems";
import Signup from "../Pages/Signup";
import Login from "../Pages/Login";
import SingleProblem from "../Pages/SingleProblem";
import AddQuestions from "../Pages/AddQuestions";
import CreateContest from "../Pages/CreateContest";
import Profile from "../Pages/Profile";
import PrivateRouteAdmin from "./PrivateRouteAdmin";
import { useSelector } from "react-redux";
import Home from "../Pages/Home";
import ContestDetails from "../Pages/ContestDetails";
import PrivateRoute from "./PrivateRoute";
import NotFoundPage from "../Pages/NotFoundPage";
import CreateBatch from "../Pages/CreateBatch";
import BatchListPage from "../Pages/Batch";

const AllRoutes = () => {
  let { user, isLogin } = useSelector((store) => store.data);

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <PrivateRoute>
            <BatchListPage />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/batch/:batchId"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="/problems" element={<Problems />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/problem/:questionId"
        element={<SingleProblem type="question" />}
      />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contest/:id" element={<ContestDetails />} />
      <Route
        path="/admin/update-contest/:contestId"
        element={<CreateContest />}
      />
      <Route
        path="/contests/:contestId/questions/:questionId/attempts/:attemptId"
        element={<SingleProblem type="contest" />}
      />
      {/* Private Routes only for admin or superAdmin */}
      {isLogin && (user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
        <>
          <Route
            path="/admin/create-batch"
            element={
              <PrivateRouteAdmin>
                <CreateBatch />
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/admin/batch/:batchId/create-contest"
            element={
              <PrivateRouteAdmin>
                <CreateContest />
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="admin/add-question"
            element={
              <PrivateRouteAdmin>
                <AddQuestions />
              </PrivateRouteAdmin>
            }
          />
        </>
      )}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AllRoutes;
