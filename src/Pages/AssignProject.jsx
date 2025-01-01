import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Input,
  useColorModeValue,
  useToast,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestDetailsByModule,
  createCyProject,
} from "../redux/project/slice";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AssignProjectCard from "../components/project/AssignProjectCard";
import { FaJs, FaNodeJs, FaReact } from "react-icons/fa";
import { showToast } from "../utils/toastUtils";
import { useParams } from "react-router-dom";

const AssignProject = () => {
  const dispatch = useDispatch();
  const testDetails = useSelector((state) => state.testDetails.testDetails);
  const loading = useSelector((state) => state.testDetails.loading);
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentTestId, setCurrentTestId] = useState(null);
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const cardBgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("red.200", "teal.100");
  const hoverBorderColor = useColorModeValue("red.300", "teal.200");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const toast = useToast();
  const { batchId } = useParams();
  console.log("batchId: ", batchId);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const moduleName = query.get("module");
    if (moduleName) {
      dispatch(fetchTestDetailsByModule(moduleName));
    }
  }, [dispatch]);

  const handleAssignClick = (id) => {
    setCurrentTestId(id);
    setModalOpen(true);
  };

  const handleAssignProject = async () => {
    try {
      const payload = {
        id: currentTestId,
        startTime: startDateTime,
        endTime: endDateTime,
        status: "ACTIVE",
        testDetailId: currentTestId,
        batchId: batchId,
      };

      await dispatch(createCyProject(payload)).unwrap();
      showToast(toast, "Project Assigned Successfully!", "success");
      setModalOpen(false);
    } catch (error) {
      showToast(toast, error.message || "Failed to assign project", "error");
    }
  };

  const skeletonLoader = (
    <>
      {[...Array(7)].map((_, idx) => (
        <Flex
          key={idx}
          direction="column"
          p={6}
          rounded="lg"
          shadow="md"
          bg={cardBgColor}
          border="1px solid"
          borderColor={borderColor}
          mb={4}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <SkeletonCircle size="10" />
            <Skeleton height="20px" width="70%" />
          </Flex>
          <Divider mb={4} />
          <SkeletonText mt="4" noOfLines={2} spacing="4" />
          <Skeleton height="15px" mt="2" width="50%" />
        </Flex>
      ))}
    </>
  );

  return (
    <Box maxW="1200px" mx="auto" px={6} py={6}>
      {loading
        ? skeletonLoader
        : testDetails.map((test) => (
            <AssignProjectCard
              key={test.id}
              test={test}
              onAssignClick={handleAssignClick}
              moduleIcons={{
                REACT: <FaReact color="#61DBFB" />,
                NODE: <FaNodeJs color="#3C873A" />,
                JAVASCRIPT: <FaJs color="#F7DF1E" />,
              }}
              borderColor={borderColor}
              hoverBorderColor={hoverBorderColor}
              textColor={textColor}
            />
          ))}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Project</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Start Date & Time</FormLabel>
                {!showStartPicker ? (
                  <Input
                    placeholder="Select Start Date & Time"
                    value={startDateTime ? startDateTime.toLocaleString() : ""}
                    readOnly
                    onClick={() => setShowStartPicker(true)}
                  />
                ) : (
                  <DatePicker
                    selected={startDateTime}
                    onChange={(date) => {
                      setStartDateTime(date);
                      setShowStartPicker(false);
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    ref={startDatePickerRef}
                  />
                )}
              </FormControl>
              <FormControl>
                <FormLabel>End Date & Time</FormLabel>
                {!showEndPicker ? (
                  <Input
                    placeholder="Select End Date & Time"
                    value={endDateTime ? endDateTime.toLocaleString() : ""}
                    readOnly
                    onClick={() => setShowEndPicker(true)}
                  />
                ) : (
                  <DatePicker
                    selected={endDateTime}
                    onChange={(date) => {
                      setEndDateTime(date);
                      setShowEndPicker(false);
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    ref={endDatePickerRef}
                  />
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={handleAssignProject}
              isDisabled={!startDateTime || !endDateTime}
            >
              Assign
            </Button>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AssignProject;
