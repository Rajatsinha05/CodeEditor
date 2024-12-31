import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, useColorMode, useToast } from "@chakra-ui/react";
import { groupBy } from "lodash";

// Redux Actions
import {
  fetchContestAttemptsByContestId,
  endContestAttempt,
} from "../redux/contestAttemptSlice";
import { getContestById } from "../redux/contestSlice";
import { fetchSolvedQuestionsByContestId } from "../redux/ContestQuestionSolvedSplice";

// Components
import CustomCreativeSpinner from "../components/Spinner/CustomCreativeSpinner";
import ContestHeader from "../components/ContestDetails/ContestHeader";
import ContestDetailsSection from "../components/ContestDetails/ContestDetailsSection";
import ContestQuestions from "../components/ContestDetails/ContestQuestions";
import StudentRankings from "../components/ContestDetails/StudentRankings";
import EnrolledStudents from "../components/ContestDetails/EnrolledStudents";

// Utils
import { showToast } from "../utils/toastUtils";
import ContestAttemptingDetails from "../components/ContestDetails/ContestAttemptingDetails ";

const ContestDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode } = useColorMode();

  const [showSpinner, setShowSpinner] = useState(true);

  // Selector for necessary data
  const { solvedQuestions, contest, user, contestAttempts, loadingStates } =
    useSelector((store) => ({
      solvedQuestions: store.solved.solvedQuestions,
      contest: store.contest.contest,
      user: store.data.user,
      contestAttempts: store.contestAttempt.contestAttempts,
      loadingStates: {
        solvedLoading: store.solved.loading,
        contestLoading: store.contest.loading,
        attemptsLoading: store.contestAttempt.loading.fetchAll,
      },
    }));

  console.log("user", user);

  // Fetch contest-related data
  useEffect(() => {
    if (id) {
      dispatch(fetchSolvedQuestionsByContestId(id));
      dispatch(getContestById(id));
      dispatch(fetchContestAttemptsByContestId(id));
    }
  }, [dispatch, id]);

  // Spinner timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate student rankings
  const studentRankings = useMemo(() => {
    if (!solvedQuestions || solvedQuestions.length === 0) return [];

    const groupedByStudent = groupBy(solvedQuestions, "studentId");
    return Object.keys(groupedByStudent)
      .map((studentId) => ({
        studentId,
        totalMarks: groupedByStudent[studentId]?.reduce(
          (acc, curr) => acc + curr.obtainedMarks,
          0
        ),
      }))
      .sort((a, b) => b.totalMarks - a.totalMarks);
  }, [solvedQuestions]);

  // Get current user's attempt
  const currentAttempt = useMemo(() => {
    return contestAttempts.find((attempt) => attempt.studentId === user.id);
  }, [contestAttempts, user.id]);

  const attemptId = useMemo(() => currentAttempt?.id, [currentAttempt]);

  // Handle contest submission
  const handleSubmitContest = useCallback(() => {
    if (!currentAttempt) {
      showToast(toast, "No contest attempt found.", "error");
      return;
    }

    dispatch(endContestAttempt({ attemptId }))
      .unwrap()
      .then(() =>
        showToast(toast, "Contest submitted successfully!", "success")
      )
      .catch((error) =>
        showToast(
          toast,
          error || "Failed to submit the contest. Please try again.",
          "error"
        )
      );
  }, [dispatch, currentAttempt, attemptId, toast]);

  // Show spinner or loading state
  const isLoading = useMemo(() => {
    return (
      showSpinner ||
      loadingStates.contestLoading ||
      loadingStates.attemptsLoading
    );
  }, [showSpinner, loadingStates]);

  if (isLoading) {
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
        attemptId={attemptId}
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
      {currentAttempt?.endTime == null && (
        <Button mt={4} colorScheme="teal" onClick={handleSubmitContest}>
          Submit Contest
        </Button>
      )}
    </Box>
  );
};

export default React.memo(ContestDetails);
