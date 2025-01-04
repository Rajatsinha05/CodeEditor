import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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
import ProfileDetails from "../components/Profile/ProfileDetails";
import Rankings from "../components/Profile/Rankings";
import StudentStats from "../components/Profile/StudentStats";
import CreateUserForm from "../components/Profile/CreateUserForm";
import CreateStudentForm from "../components/Profile/CreateStudentForm";
import Users from "../components/Profile/Users";
import Students from "../components/Profile/Students";
import AdminProfile from "../Pages/AdminProfile";
import StudentDetailsPage from "../components/Profile/Student/StudentDetailsPage";
import Portfolio from "../Pages/Portfolio";
import ResumeSection from "../components/Profile/resume/ResumeSection";
import AddProject from "../Pages/AddProject";
import AssignStudents from "../Pages/AssignStudents";
import AssignProject from "../Pages/AssignProject";
import ProjectDetails from "../Pages/ProjectDetails";
import SubmissionDetails from "../Pages/SubmissionDetails";

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
      <Route
        path="/batch/:batchId/project/:projectId"
        element={
          <PrivateRoute>
            <ProjectDetails />
          </PrivateRoute>
        }
      />
      <Route path="/problems" element={<Problems />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/portfolio/:studentId" element={<Portfolio />} />
      <Route path="/resume/:studentId" element={<ResumeSection />} />
      <Route
        path="/problem/:questionId"
        element={<SingleProblem type="question" />}
      />
      <Route path="/profile" element={<Profile />}>
        {user?.role === "ADMIN" || user?.role === "SUPERADMIN" ? (
          <Route index element={<AdminProfile />} />
        ) : (
          <Route index element={<ProfileDetails />} />
        )}

        {/* Nested Routes */}
        <Route path="student-rankings" element={<Rankings />} />
        <Route path="student-statistics" element={<StudentStats />} />
        <Route path="create-user" element={<CreateUserForm />} />
        <Route path="create-student" element={<CreateStudentForm />} />
        <Route path="manage-users" element={<Users />} />
        <Route path="manage-students" element={<Students />} />

        {/* Dynamic Student Profile Route */}
        {/* <Route path=":studentId" element={<StudentDetailsPage />} /> */}
      </Route>

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
            path="/admin/batch/:batchId/assign-project"
            element={
              <PrivateRouteAdmin>
                <AssignProject />
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/admin/batch/assign-students/:batchId"
            element={
              <PrivateRouteAdmin>
                <AssignStudents />
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
          <Route path="/admin/add-project" element={<AddProject />} />
        </>
      )}
      <Route
        path="/submissions/:id"
        element={
          <PrivateRoute>
            <SubmissionDetails />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AllRoutes;
