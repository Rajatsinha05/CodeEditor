import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAllResults, fetchTestDetailById } from "../redux/project/slice";
import ProjectInformation from "../components/project/ProjectInformation";
import ProjectResult from "../components/project/ProjectResult";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const [selectedFailedTest, setSelectedFailedTest] = useState(null);
  const { testDetail, results, loading, error } = useSelector(
    (store) => store.testDetails
  );

  useEffect(() => {
    dispatch(fetchTestDetailById(projectId));
    dispatch(fetchAllResults({ cyProjectId: projectId }));
  }, [dispatch, projectId]);

  const handleCloseModal = () => setSelectedFailedTest(null);

  if (loading) {
    return (
      <Box py={6} px={8} maxW="1200px" mx="auto">
        <Skeleton height="40px" width="60%" mb={6} />
        <Box mb={8} p={6} rounded="lg" shadow="md" bg="gray.50">
          <SkeletonText noOfLines={6} spacing={4} />
        </Box>
        <Box p={6} rounded="lg" shadow="md" bg="gray.50">
          <SkeletonText noOfLines={12} spacing={4} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={6} px={8} maxW="1200px" mx="auto" textAlign="center">
        <Alert status="error" rounded="lg">
          <AlertIcon />
          Failed to load project details. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      py={6}
      px={8}
      maxW="1200px"
      mx="auto"
      bg={useColorModeValue("gray.50", "gray.800")}
      rounded="lg"
      shadow="lg"
    >
      <Heading
        size="lg"
        mb={6}
        textAlign="center"
        color={useColorModeValue("gray.800", "white")}
        borderBottom="2px solid"
        borderColor={useColorModeValue("teal.500", "teal.300")}
        pb={2}
      >
        Project Details
      </Heading>

      <Tabs variant="enclosed" colorScheme="teal" isFitted>
        <TabList>
          <Tab>Instruction</Tab>
          <Tab>Result</Tab>
        </TabList>

        <TabPanels>
          {/* Instruction Tab */}
          <TabPanel>
            <Box w="100%" mb={8}>
              <ProjectInformation testDetail={testDetail} />
            </Box>
          </TabPanel>

          {/* Result Tab */}
          <TabPanel>
            <Box w="100%">
              <ProjectResult
                results={results}
                onFailedTestClick={setSelectedFailedTest}
              />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modal for failed test details */}
      {selectedFailedTest && (
        <Modal isOpen onClose={handleCloseModal} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Failed Test Details</ModalHeader>
            <ModalBody>
              <Text fontWeight="bold" mb={2}>
                Test Name: {selectedFailedTest.testName}
              </Text>
              <Text>{selectedFailedTest.reason}</Text>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleCloseModal} colorScheme="teal">
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default ProjectDetails;
