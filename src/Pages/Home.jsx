import React, { useEffect, useState, useMemo, useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchContestsByBatchId } from "../redux/contestSlice";
import {
  Box,
  useDisclosure,
  useColorModeValue,
  VStack,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import ContestFilter from "../components/Home/ContestFilter";
import ContestList from "../components/Home/ContestList";
import StartContestModal from "../components/Home/StartContestModal";
import { fetchBatchById } from "../redux/Batch/batchSlice";
import { modules } from "../components/data/Modules";
import { fetchAllTestDetailsByBatchId } from "../redux/project/slice";
import ProjectCard from "../components/project/ProjectCard";

dayjs.extend(duration);

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { batchId } = useParams();

  const [filter, setFilter] = useState("active");
  const [selectedContest, setSelectedContest] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((store) => store.data.user, shallowEqual);
  const contests = useSelector((store) => store.contest.contests, shallowEqual);
  const isFetched = useSelector(
    (store) => store.contest.isFetched,
    shallowEqual
  );
  const selectedBatch = useSelector(
    (store) => store.batch.selectedBatch,
    shallowEqual
  );
  const { testDetails } = useSelector((store) => store.testDetails);

  const isValidModule = useMemo(
    () =>
      selectedBatch &&
      modules().some((module) => module.value === selectedBatch.module),
    [selectedBatch]
  );

  useEffect(() => {
    dispatch(fetchBatchById(batchId));
  }, [batchId, dispatch]);

  useEffect(() => {
    if (!isFetched) dispatch(fetchContestsByBatchId(batchId));
  }, [dispatch, batchId, isFetched]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isValidModule) dispatch(fetchAllTestDetailsByBatchId(batchId));
  }, [dispatch, batchId, isValidModule]);

  const handleStartContestClick = useCallback(
    (contest) => {
      setSelectedContest(contest);
      onOpen();
    },
    [onOpen]
  );

  const filteredContests = useMemo(() => {
    const currentTime = dayjs();
    return (
      contests?.filter((contest) => {
        switch (filter) {
          case "active":
            return currentTime.isBetween(
              dayjs(contest.startTime),
              dayjs(contest.endTime)
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
      }) || []
    );
  }, [contests, filter]);

  const renderSkeleton = () => (
    <VStack spacing={6} align="stretch">
      <Skeleton height="40px" width="100%" />
      {Array.from({ length: 3 }).map((_, idx) => (
        <Box
          key={idx}
          p={6}
          borderRadius="md"
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.600")}
        >
          <SkeletonText mt="4" noOfLines={3} spacing="4" />
          <SkeletonCircle size="10" mt="4" />
        </Box>
      ))}
    </VStack>
  );

  if (loading) {
    return (
      <Box
        py={8}
        px={6}
        maxW="1000px"
        mx="auto"
        bg={useColorModeValue("gray.50", "gray.800")}
        borderRadius="lg"
        shadow="md"
        mt="3"
      >
        {renderSkeleton()}
      </Box>
    );
  }

  return (
    <Box
      py={8}
      px={6}
      maxW="1000px"
      mx="auto"
      bg={useColorModeValue("gray.50", "gray.800")}
      borderRadius="lg"
      shadow="md"
      mt="3"
    >
      <VStack spacing={8} align="stretch">
        {isValidModule ? (
          testDetails?.map((test) => (
            <ProjectCard
              key={test.id}
              test={test}
              moduleIcons={modules()}
              borderColor={useColorModeValue("gray.200", "gray.600")}
              hoverBorderColor={useColorModeValue("teal.300", "teal.500")}
              textColor={useColorModeValue("gray.800", "whiteAlpha.900")}
            />
          ))
        ) : (
          <>
            <ContestFilter filter={filter} setFilter={setFilter} />
            <ContestList
              contests={filteredContests}
              onStartContestClick={handleStartContestClick}
              user={user}
            />
          </>
        )}
      </VStack>
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
