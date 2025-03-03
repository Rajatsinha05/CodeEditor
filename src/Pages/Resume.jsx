import React from "react";
import ResumeUi from "../components/Profile/resume/ResumeUi";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDetailsById } from "../redux/Student/studentsSlice";
const studentData = {
  id: "01JGAZ03PJHPK5GWB2TFPAVGRB",
  name: "test",
  email: "test@gmail.com",
  grid: "1234",
  course: "Full Stack Developer",
  branchCode: "rw5",
  phoneNumber: "7717750136",
  githubURL: "rajatsinha05",
  linkedInURL: "test",
  summary: "testing  summry",
  profileURL: null,
  education: [
    {
      id: "01JGPT7Q65EAZ1BZW06FMCBHEZ",
      degree: "full stack",
      institution: "test",
      startDate: "2025-01-04",
      endDate: "2025-01-10",
      grade: "A",
      studentId: "01JGAZ03PJHPK5GWB2TFPAVGRB",
    },
  ],
  experiences: [
    {
      id: "01JMG0Z0A5X2WZ5431S00T3R1G",
      jobTitle: "test",
      company: "test",
      startDate: "2025-02-05",
      endDate: null,
      description: "",
      studentId: "01JGAZ03PJHPK5GWB2TFPAVGRB",
    },
  ],
  projects: [
    {
      id: "01JGPT6D32XAD6F4DYEHMP74RR",
      title: "pr1",
      description: "<p>this is project</p>",
      technologies: "react,node,js",
      githubLink: "link",
      link: "link",
      studentId: "01JGAZ03PJHPK5GWB2TFPAVGRB",
    },
    {
      id: "01JGPT76BC14TN5BNKKYV2PMSZ",
      title: "pr2",
      description: "<p>project 2</p>",
      technologies: "node,js ,react,css",
      githubLink: "link",
      link: "link",
      studentId: "01JGAZ03PJHPK5GWB2TFPAVGRB",
    },
  ],
  certificates: [
    {
      id: "01JGPT8JP278G0F3A7WK3R38Q1",
      title: "full stack",
      institution: "test",
      dateIssued: "2025-01-04",
      startingDate: null,
      endDate: null,
      link: "link",
      studentId: "01JGAZ03PJHPK5GWB2TFPAVGRB",
    },
  ],
  skills: [
    "REACT",
    "NODEJS",
    "HTML",
    "CSS",
    "JAVASCRIPT",
    "AWS",
    "EXPRESS",
    "MONGODB",
  ],
};

function Resume() {
  const { studentId } = useParams();
  

  const dispatch = useDispatch();
  const { student } = useSelector((store) => store.student);
  

  const refreshStudentData = () => {
    if (studentId) {
      dispatch(fetchStudentDetailsById(studentId));
    }
  };

  // useEffect(() => {
  //   refreshStudentData();
  // }, [studentId, dispatch]);
  return (
    <div className="min-h-screen bg-gray-100">
      <ResumeUi student={studentData} />
    </div>
  );
}

export default Resume;
