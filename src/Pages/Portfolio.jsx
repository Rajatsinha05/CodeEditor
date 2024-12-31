import React, { useEffect } from "react";
import Navbar from "../components/Profile/portfolio/Navbar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDetailsById } from "../redux/Student/studentsSlice";
import About from "../components/Profile/portfolio/About";

const Portfolio = () => {
  const { studentId } = useParams();

  const dispatch = useDispatch();
  const { student } = useSelector((store) => store.student);
  // Fetch student details
  const refreshStudentData = () => {
    if (studentId) {
      dispatch(fetchStudentDetailsById(studentId));
    }
  };

  useEffect(() => {
    refreshStudentData();
  }, [studentId]);

  return (
    <div>
      <Navbar />
      <About student={student} />
    </div>
  );
};

export default Portfolio;
