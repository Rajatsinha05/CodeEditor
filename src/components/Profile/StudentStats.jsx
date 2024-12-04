import React, { useEffect, useMemo } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchByStudentId } from "../../redux/Question/questionSolvedSlice";
import SolvedQuestionsList from "./SolvedQuestionsList";
import ActivityGraph from "./ActivityGraph";

const StudentStats = ({ student }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (student && student.id) {
      dispatch(fetchByStudentId(student.id));
    }
  }, [dispatch, student?.id]);

  const { studentRecords } = useSelector((store) => store.questionSolved);

  const groupedRecords = useMemo(() => {
    if (!studentRecords || studentRecords.length === 0) return [];

    const grouped = studentRecords.reduce((acc, record) => {
      const { questionId, title, tag, difficultLevel, testCase } = record;

      if (!acc[questionId]) {
        acc[questionId] = {
          questionId,
          title,
          tag,
          difficultLevel,
          attempts: 0,
          passed: false,
        };
      }

      acc[questionId].attempts += 1;
      if (testCase === "PASSED") {
        acc[questionId].passed = true;
      }

      return acc;
    }, {});

    return Object.values(grouped);
  }, [studentRecords]);

  const graphData = useMemo(() => {
    if (!studentRecords || studentRecords.length === 0) return null;

    const attemptsByDate = {};
    const solvedByDate = {};

    studentRecords.forEach((record) => {
      const date = new Date(record.solvedAt).toLocaleDateString();

      // Count total attempts
      if (!attemptsByDate[date]) attemptsByDate[date] = 0;
      attemptsByDate[date]++;

      // Count unique questions solved
      if (!solvedByDate[date]) solvedByDate[date] = new Set();
      solvedByDate[date].add(record.questionId);
    });

    return {
      labels: Object.keys(attemptsByDate), // Dates
      datasets: [
        {
          label: "Total Attempts",
          data: Object.values(attemptsByDate),
          backgroundColor: "teal",
          borderColor: "teal",
          borderWidth: 2,
          borderRadius: 5,
        },
        {
          label: "Unique Questions Solved",
          data: Object.keys(solvedByDate).map(
            (date) => solvedByDate[date].size
          ),
          backgroundColor: "orange",
          borderColor: "orange",
          borderWidth: 2,
          borderRadius: 5,
        },
      ],
    };
  }, [studentRecords]);

  return (
    <Box
      bg="gray.50"
      py={{ base: 6, md: 12 }}
      px={{ base: 4, md: 8 }}
      borderRadius="xl"
      boxShadow="2xl"
      _dark={{ bg: "gray.800", boxShadow: "dark-lg" }}
      maxW="1200px"
      mx="auto"
      mt={6}
    >
      <VStack spacing={10} align="stretch">
        {studentRecords && studentRecords.length > 0 ? (
          <>
            <SolvedQuestionsList groupedRecords={groupedRecords} />
            {graphData ? (
              <ActivityGraph graphData={graphData} />
            ) : (
              <Text
                fontSize="lg"
                color="gray.500"
                _dark={{ color: "gray.300" }}
                textAlign="center"
              >
                No graph data available.
              </Text>
            )}
          </>
        ) : (
          <Text
            mt={4}
            fontSize="lg"
            color="gray.500"
            _dark={{ color: "gray.300" }}
            textAlign="center"
          >
            No solved questions yet.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default React.memo(StudentStats);
