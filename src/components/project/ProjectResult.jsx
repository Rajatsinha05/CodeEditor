import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  Heading,
  IconButton,
  Skeleton,
  SkeletonText,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import FilterModal from "./FilterModal";
import StudentList from "./StudentList";
import SubmissionDetails from "./SubmissionDetails";

const ProjectResult = ({ results, isLoading }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [marksRange, setMarksRange] = useState([0, 100]);
  const [courseFilter, setCourseFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  // Group results by studentId
  const groupedResults = results.reduce((acc, result) => {
    acc[result.studentId] = acc[result.studentId] || [];
    acc[result.studentId].push(result);
    return acc;
  }, {});

  // Filter and sort results
  const filteredResults = Object.keys(groupedResults).filter((studentId) => {
    const bestResult = groupedResults[studentId][0];
    return (
      (!statusFilter || bestResult.status === statusFilter) &&
      bestResult.marks >= marksRange[0] &&
      bestResult.marks <= marksRange[1] &&
      (!courseFilter || bestResult.course === courseFilter)
    );
  });

  const sortedResults = filteredResults.sort((a, b) => {
    const studentA = groupedResults[a][0];
    const studentB = groupedResults[b][0];
    if (sortKey === "name") return studentA.name.localeCompare(studentB.name);
    if (sortKey === "marks") return studentB.marks - studentA.marks;
    if (sortKey === "status")
      return studentA.status.localeCompare(studentB.status);
    return 0;
  });

  // Styling variables
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "teal.200");
  const sidebarBg = useColorModeValue("gray.50", "gray.900");

  if (isLoading) {
    return (
      <Flex direction={{ base: "column", md: "row" }} h="100vh" bg={bgColor}>
        {/* Sidebar Skeleton */}
        <Box
          w={{ base: "full", md: "350px" }}
          p={4}
          bg={sidebarBg}
          shadow="lg"
          borderRight="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Skeleton height="30px" width="70%" mb={4} />
          <SkeletonText noOfLines={8} spacing={4} />
        </Box>

        {/* Main Content Skeleton */}
        <Box flex="1" p={6} overflowY="auto">
          <Skeleton height="40px" width="50%" mb={6} />
          <SkeletonText noOfLines={12} spacing={4} />
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction={{ base: "column", md: "row" }} h="100vh" bg={bgColor}>
      {/* Sidebar: Student List */}
      <Box
        w={{ base: "full", md: "350px" }}
        p={4}
        bg={sidebarBg}
        shadow="lg"
        borderRight="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Flex align="center" justify="space-between" mb={4}>
          <Heading size="md" color={textColor}>
            Students
          </Heading>
          <IconButton
            icon={<FiFilter />}
            aria-label="Open Filters"
            onClick={() => setIsFilterOpen(true)}
            colorScheme="teal"
            variant="ghost"
            _hover={{ bg: useColorModeValue("teal.100", "teal.700") }}
          />
        </Flex>
        <StudentList
          sortedResults={sortedResults}
          groupedResults={groupedResults}
          selectedStudentId={selectedStudentId}
          setSelectedStudentId={setSelectedStudentId}
          setSortKey={setSortKey}
          isLoading={isLoading}
        />
      </Box>

      {/* Main Content: Submission Details */}
      <Box flex="1" p={6} overflowY="auto">
        <SubmissionDetails
          selectedStudentId={selectedStudentId}
          groupedResults={groupedResults}
          textColor={textColor}
          cardBg={cardBg}
        />
      </Box>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        marksRange={marksRange}
        setMarksRange={setMarksRange}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        courses={[...new Set(results.map((result) => result.course))]}
      />
    </Flex>
  );
};

export default ProjectResult;
