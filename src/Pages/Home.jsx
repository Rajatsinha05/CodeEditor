import React, { useEffect, useState, useMemo, useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchContests, fetchContestsByStudent } from "../redux/contestSlice";
import { Box, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import ContestFilter from "../components/Home/ContestFilter";
import ContestList from "../components/Home/ContestList";
import StartContestModal from "../components/Home/StartContestModal";
import MotivationalLoadingSpinner from "../components/Spinner/MotivationalLoadingSpinner";

dayjs.extend(duration);

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filter, setFilter] = useState("active");
  const [selectedContest, setSelectedContest] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((store) => store.data.user, shallowEqual);
  const contests = useSelector((store) => store.contest.contests, shallowEqual);
  const isFetched = useSelector((store) => store.contest.isFetched, shallowEqual);

  useEffect(() => {
    if (isFetched) return;

    const fetchData = () => {
      if (user?.role === "STUDENT") {
        dispatch(fetchContestsByStudent(user.id));
      } else {
        dispatch(fetchContests());
      }
    };

    fetchData();
  }, [dispatch, user?.role, user?.id, isFetched]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartContestClick = useCallback(
    (contest) => {
      setSelectedContest(contest);
      onOpen();
    },
    [onOpen]
  );

  const filteredContests = useMemo(() => {
    if (!contests || contests.length === 0) return [];
    const currentTime = dayjs();

    return contests.filter((contest) => {
      switch (filter) {
        case "active":
          return (
            currentTime.isAfter(dayjs(contest.startTime)) &&
            currentTime.isBefore(dayjs(contest.endTime))
          );
        case "upcoming":
          return currentTime.isBefore(dayjs(contest.startTime));
        case "past":
          return currentTime.isAfter(dayjs(contest.endTime));
        case "all":
          return true;
        default:
          return false;
      }
    });
  }, [contests, filter]);

  if (loading) {
    return <MotivationalLoadingSpinner />;
  }

  return (
    <Box
      p={8}
      maxW="1000px"
      mx="auto"
      bg={useColorModeValue("gray.50", "gray.800")}
      borderRadius="lg"
      shadow="md"
    >
      <ContestFilter filter={filter} setFilter={setFilter} />
      <ContestList
        contests={filteredContests}
        onStartContestClick={handleStartContestClick}
        user={user}
      />
      {selectedContest && (
        <StartContestModal
          isOpen={isOpen}
          onClose={onClose}
          contest={selectedContest}
          user={user}
          onProceed={() => navigate(`/Contest/${selectedContest.id}`)}
        />
      )}
    </Box>
  );
};

export default Home;
