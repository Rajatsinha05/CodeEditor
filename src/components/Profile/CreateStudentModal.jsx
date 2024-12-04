import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Divider,
  Heading,
  Box,
  Grid,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FaFileExcel, FaPlusCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { createStudent } from "../../redux/apiSlice";
import CreateStudentForm from "./CreateStudentForm";
import ExcelUpload from "./ExcelUpload";

const CreateStudentModal = ({ isOpen, onClose }) => {
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    grid: "",
    branchCode: "",
    password: "",
    course: "",
  });
  const [isCreateButtonVisible, setCreateButtonVisible] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const dispatch = useDispatch();
  const toast = useToast();

  const modalBgColor = useColorModeValue("white", "gray.800");
  const headerTextColor = useColorModeValue("blue.600", "blue.300");
  const footerBgColor = useColorModeValue("gray.100", "gray.700");

  const validateForm = () => {
    return (
      studentData.name &&
      studentData.email &&
      studentData.grid &&
      studentData.branchCode &&
      studentData.password.length >= 8 &&
      studentData.course
    );
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the highlighted fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await dispatch(createStudent(studentData)).unwrap();
      toast({
        title: "Student created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      if (
        error.response &&
        error.response.data.message.includes("email already exists")
      ) {
        toast({
          title: "Duplicate Entry",
          description:
            "A student with the same email already exists. Please use a different email.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description:
            "An error occurred while creating the student. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleBulkCreate = async () => {
    if (uploadedData.length === 0) {
      toast({
        title: "No Data",
        description:
          "Please upload a valid Excel file before creating students.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const promises = uploadedData.map(async (student) => {
        try {
          await dispatch(createStudent(student)).unwrap();
        } catch (error) {
          if (error.response && error.response.data) {
            const errorMessage = error.response.data.message;

            if (
              errorMessage &&
              (errorMessage.includes("email already exists") ||
                errorMessage.includes("grid already exists"))
            ) {
              toast({
                title: `Duplicate Entry for ${student.email}`,
                description: `A student with the same email (${student.email}) or grid already exists. Skipping this entry.`,
                status: "warning",
                duration: 5000,
                isClosable: true,
              });
            } else {
              throw error;
            }
          } else {
            throw error;
          }
        }
      });

      await Promise.all(promises);

      toast({
        title: "Bulk Upload Complete",
        description: "All valid students have been created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error Creating Students",
        description:
          "An error occurred while creating the students. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent bg={modalBgColor}>
        <ModalHeader color={headerTextColor} textAlign="center">
          Create Student
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Excel Upload and Create from Excel Section */}
            <Box>
              <ExcelUpload
                setCreateButtonVisible={setCreateButtonVisible}
                setUploadedData={setUploadedData}
              />
            </Box>

            <Divider />

            {/* Create Form Section */}
            <Box>
              <Heading size="md" mb={2} color={headerTextColor}>
                Create Student Manually
              </Heading>
              <Divider mb={4} />
              <CreateStudentForm
                studentData={studentData}
                setStudentData={setStudentData}
              />
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter bg={footerBgColor}>
          <Grid templateColumns="repeat(3, 1fr)" gap={4} width="full">
            <Tooltip label="Create using Form" aria-label="Create Form Tooltip">
              <Button
                colorScheme="blue"
                leftIcon={<FaPlusCircle />}
                onClick={handleCreate}
              >
                Create Student
              </Button>
            </Tooltip>
            {isCreateButtonVisible && (
              <Tooltip
                label="Create from Excel File"
                aria-label="Create Excel Tooltip"
              >
                <Button
                  colorScheme="green"
                  leftIcon={<FaFileExcel />}
                  onClick={handleBulkCreate}
                >
                  Create from Excel
                </Button>
              </Tooltip>
            )}
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </Grid>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(CreateStudentModal);
