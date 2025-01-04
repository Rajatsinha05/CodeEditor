import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Badge,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchResultById } from "../redux/project/slice";

const SubmissionDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { result, loading, error } = useSelector((store) => store.testDetails);
  const [selectedFailedTest, setSelectedFailedTest] = useState(null);

  useEffect(() => {
    dispatch(fetchResultById(id));
  }, [dispatch, id]);

  const textColor = useColorModeValue("gray.700", "teal.200");
  const boxBg = useColorModeValue("gray.50", "gray.800");
  const passedBg = useColorModeValue("green.50", "green.900");
  const failedBg = useColorModeValue("red.50", "red.900");

  const handleFailedTestClick = (test) => {
    setSelectedFailedTest(test);
  };

  const closeModal = () => {
    setSelectedFailedTest(null);
  };

  if (loading) {
    return (
      <Box p={6} bg={boxBg} rounded="lg" shadow="md">
        <Skeleton height="40px" mb={4} />
        <SkeletonText noOfLines={4} spacing={4} />
        <Divider my={4} />
        <Tabs variant="enclosed" colorScheme="teal">
          <TabList>
            <Skeleton height="30px" width="150px" mr={2} />
            <Skeleton height="30px" width="150px" />
          </TabList>
          <TabPanels>
            <TabPanel>
              <SkeletonText noOfLines={5} spacing={4} />
            </TabPanel>
            <TabPanel>
              <SkeletonText noOfLines={5} spacing={4} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    );
  }

  if (error || !result) {
    return (
      <Box py={6} px={8}>
        <Alert status="error">
          <AlertIcon />
          {error || "Failed to fetch submission details."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={6} bg={boxBg} rounded="lg" shadow="md">
      <Heading size="lg" mb={4}>
        Submission Details
      </Heading>

      {/* Basic Information */}
      <Text fontSize="md" mb={2}>
        <strong>Student Name:</strong> {result.name}
      </Text>
      <Text fontSize="md" mb={2}>
        <strong>Email:</strong> {result.email}
      </Text>
      <Text fontSize="md" mb={2}>
        <strong>Status:</strong>{" "}
        <Badge colorScheme={result.status === "PASSED" ? "teal" : "red"}>
          {result.status}
        </Badge>
      </Text>
      <Text fontSize="md" mb={4}>
        <strong>Marks:</strong> {result.marks}
      </Text>

      <Divider my={4} />

      {/* Tabs for Passed and Failed Tests */}
      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>
            <Flex align="center" gap={2}>
              <FiCheckCircle />
              Passed ({result.passedTests.length})
            </Flex>
          </Tab>
          <Tab>
            <Flex align="center" gap={2}>
              <FiXCircle />
              Failed ({result.failedTestsWithReasons.length})
            </Flex>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Passed Tests */}
          <TabPanel>
            {result.passedTests.length > 0 ? (
              <VStack align="start" spacing={4}>
                {result.passedTests.map((test, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg={passedBg}
                    rounded="md"
                    shadow="sm"
                    w="100%"
                  >
                    <Flex align="center" gap={2}>
                      <FiCheckCircle color="green" />
                      <Text fontWeight="bold" fontSize="md" color={textColor}>
                        {test}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>No passed tests.</Text>
            )}
          </TabPanel>

          {/* Failed Tests */}
          <TabPanel>
            {result.failedTestsWithReasons.length > 0 ? (
              <VStack align="start" spacing={4}>
                {result.failedTestsWithReasons.map((test, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg={failedBg}
                    rounded="md"
                    shadow="sm"
                    w="100%"
                    cursor="pointer"
                    _hover={{ bg: useColorModeValue("red.100", "red.800") }}
                    onClick={() => handleFailedTestClick(test)}
                  >
                    <Flex align="center" gap={2}>
                      <FiXCircle color="red" />
                      <Text fontWeight="bold" fontSize="md" color={textColor}>
                        {test.testName}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>No failed tests.</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modal for Failed Test Reason */}
      {selectedFailedTest && (
        <Modal isOpen={!!selectedFailedTest} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Failed Test Details</ModalHeader>
            <ModalBody>
              <Text fontWeight="bold" mb={2}>
                Test Name:
              </Text>
              <Text mb={4}>{selectedFailedTest.testName}</Text>

              <Text fontWeight="bold" mb={2}>
                Reason:
              </Text>
              <Text>{selectedFailedTest.reason}</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default SubmissionDetails;
