import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Box, useColorMode } from "@chakra-ui/react";
import { groupBy } from "lodash";

// Redux Actions
import { getContestById } from "../redux/contestSlice";
import { fetchSolvedQuestionsByContestId } from "../redux/QuestionSolvedSplice";
import { fetchContestAttemptsByContestId } from "../redux/contestAttemptSlice";
import CustomCreativeSpinner from "../components/Spinner/CustomCreativeSpinner";
import ContestHeader from "../components/ContestDetails/ContestHeader";
import ContestDetailsSection from "../components/ContestDetails/ContestDetailsSection";
import ContestQuestions from "../components/ContestDetails/ContestQuestions";
import StudentRankings from "../components/ContestDetails/StudentRankings";
import EnrolledStudents from "../components/ContestDetails/EnrolledStudents";
import ContestAttemptingDetails from "../components/ContestDetails/ContestAttemptingDetails ";

// Components

const ContestDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [showSpinner, setShowSpinner] = useState(true);

  // Combined selector to access the necessary store data in one go
  const {
    solvedQuestions,
    contest,
    user,
    contestAttempts,
    solvedLoading,
    contestLoading,
    attemptsLoading,
  } = useSelector((store) => ({
    solvedQuestions: store.solved.solvedQuestions,
    contest: store.contest.contest,
    user: store.data.user,
    contestAttempts: store.contestAttempt.contestAttempts,
    solvedLoading: store.solved.loading,
    contestLoading: store.contest.loading,
    attemptsLoading: store.contestAttempt.loading.fetchAll,
  }));

  // Fetch contest data, solved questions, and contest attempts
  useEffect(() => {
    if (id) {
      dispatch(fetchSolvedQuestionsByContestId(id));
      dispatch(getContestById(id));
      dispatch(fetchContestAttemptsByContestId(id));
    }
  }, [dispatch, id]);

  // Navigate to home if contest is not found after loading is complete
  useEffect(() => {
    if (!contestLoading && !contest) {
      navigate("/", { replace: true });
    }
  }, [contest, contestLoading, navigate]);

  // Control spinner visibility
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 1500); // Show spinner for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Memoize student rankings to avoid unnecessary recalculations
  const studentRankings = useMemo(() => {
    if (!solvedQuestions || solvedQuestions.length === 0) return [];

    const groupedByStudent = groupBy(solvedQuestions, "studentId");
    const rankings = Object.keys(groupedByStudent).map((studentId) => {
      const totalMarks = groupedByStudent[studentId]?.reduce(
        (acc, curr) => acc + curr.obtainedMarks,
        0
      );
      return { studentId, totalMarks };
    });

    return rankings.sort((a, b) => b.totalMarks - a.totalMarks);
  }, [solvedQuestions]);

  // Show spinner initially or if the contest is still loading
  if (showSpinner || contestLoading || attemptsLoading) {
    return <CustomCreativeSpinner />;
  }

  return (
    <Box
      p={8}
      maxW="1000px"
      mx="auto"
      bg={colorMode === "light" ? "gray.100" : "gray.800"}
      borderRadius="lg"
      shadow="lg"
    >
      <ContestHeader contest={contest} colorMode={colorMode} />
      <ContestDetailsSection contest={contest} colorMode={colorMode} />
      <ContestQuestions
        contest={contest}
        solvedQuestions={solvedQuestions}
        user={user}
        colorMode={colorMode}
      />
      <StudentRankings
        studentRankings={studentRankings}
        contest={contest}
        user={user}
        colorMode={colorMode}
      />
      {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
        <>
          <ContestAttemptingDetails contestAttempts={contestAttempts} />
          <EnrolledStudents contest={contest} colorMode={colorMode} />
        </>
      )}
    </Box>
  );
};

export default ContestDetails;
