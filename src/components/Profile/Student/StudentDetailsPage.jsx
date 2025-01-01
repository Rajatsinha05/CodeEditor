import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileSection from "./ProfileSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import EducationSection from "./EducationSection";
import CertificatesSection from "./CertificatesSection";
import { fetchStudentDetailsById } from "../../../redux/Student/studentsSlice";
import { useParams } from "react-router-dom";
import ExperienceSection from "./ExperienceSection";
import { Box, Skeleton, SkeletonText, VStack, HStack } from "@chakra-ui/react";

const StudentDetailsPage = () => {
  const { user } = useSelector((store) => store.user);
  const { studentId } = useParams();
  const { student, loading } = useSelector((store) => store.student);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch student details
  const refreshStudentData = () => {
    if (studentId) {
      dispatch(fetchStudentDetailsById(studentId));
    }
  };

  useEffect(() => {
    refreshStudentData();
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [studentId]);

  if (loading || isLoading) {
    return (
      <Box p={6}>
        <VStack spacing={6} align="stretch">
          {/* Profile Section Skeleton */}
          <Box p={6} borderWidth="1px" borderRadius="md">
            <HStack spacing={4}>
              <Skeleton height="50px" width="50px" borderRadius="full" />
              <VStack align="start" spacing={2}>
                <Skeleton height="20px" width="200px" />
                <Skeleton height="15px" width="150px" />
              </VStack>
            </HStack>
          </Box>

          {/* Skills Section Skeleton */}
          <Box p={6} borderWidth="1px" borderRadius="md">
            <Skeleton height="25px" width="30%" mb={4} />
            <HStack spacing={3}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  height="25px"
                  width="100px"
                  borderRadius="md"
                />
              ))}
            </HStack>
          </Box>

          {/* Experience Section Skeleton */}
          <Box p={6} borderWidth="1px" borderRadius="md">
            <Skeleton height="25px" width="30%" mb={4} />
            <SkeletonText
              mt="4"
              noOfLines={4}
              spacing="4"
              skeletonHeight="20px"
            />
          </Box>

          {/* Projects Section Skeleton */}
          <Box p={6} borderWidth="1px" borderRadius="md">
            <Skeleton height="25px" width="30%" mb={4} />
            <VStack spacing={3} align="stretch">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} height="30px" width="100%" />
              ))}
            </VStack>
          </Box>

          {/* Education Section Skeleton */}
          <Box p={6} borderWidth="1px" borderRadius="md">
            <Skeleton height="25px" width="30%" mb={4} />
            <SkeletonText
              mt="4"
              noOfLines={3}
              spacing="4"
              skeletonHeight="20px"
            />
          </Box>

          {/* Certificates Section Skeleton */}
          <Box p={6} borderWidth="1px" borderRadius="md">
            <Skeleton height="25px" width="30%" mb={4} />
            <HStack spacing={3}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  height="20px"
                  width="150px"
                  borderRadius="md"
                />
              ))}
            </HStack>
          </Box>
        </VStack>
      </Box>
    );
  }

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
