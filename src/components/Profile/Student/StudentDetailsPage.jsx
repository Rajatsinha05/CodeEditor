import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileSection from "./ProfileSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import EducationSection from "./EducationSection";
import CertificatesSection from "./CertificatesSection";
import { fetchStudentDetailsById } from "../../../redux/Student/studentsSlice";
import { useParams } from "react-router-dom";
import ExperienceSection from "./ExperienceSection";

const StudentDetailsPage = () => {
  const { user } = useSelector((store) => store.user);
  const { studentId } = useParams();
  const { student } = useSelector((store) => store.student);
  const dispatch = useDispatch();

  // Fetch student details
  const refreshStudentData = () => {
    if (user?.id) {
      dispatch(fetchStudentDetailsById(student?.id));
    }
  };

  useEffect(() => {
    refreshStudentData();
  }, [user?.id]);

  return (
    <>
      <ProfileSection student={student} onRefresh={refreshStudentData} />
      <SkillsSection student={student} onRefresh={refreshStudentData} />
      <ExperienceSection student={student} onRefresh={refreshStudentData} />
      <ProjectsSection student={student} onRefresh={refreshStudentData} />
      <EducationSection student={student} onRefresh={refreshStudentData} />
      <CertificatesSection student={student} onSave={refreshStudentData} />
    </>
  );
};

export default StudentDetailsPage;
