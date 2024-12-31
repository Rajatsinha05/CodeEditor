import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  useColorModeValue,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDetailsById } from "../../redux/Student/studentsSlice";
import StudentDetailsPage from "./Student/StudentDetailsPage";

const ProfileDetails = () => {
  const { user } = useSelector((store) => store.user);
  const { student } = useSelector((store) => store.student);
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState(null); // Track which section is being edited
  const [formData, setFormData] = useState({}); // Form data for the modal
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal state

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchStudentDetailsById(user?.id));
    }
  }, [dispatch, user?.id]);

  // Colors
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const tableBgColor = useColorModeValue("white", "gray.700");

  // Handle input change in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for a specific section
  const handleEdit = (section) => {
    setActiveSection(section);
    setFormData(student[section] || {});
    onOpen();
  };

  // Save data from modal (mock implementation)
  const handleSave = () => {
    onClose();
  };

  return (
    <Box bg={bgColor} p={5} minHeight="100vh">
      <StudentDetailsPage student={student} />
    </Box>
  );
};

export default ProfileDetails;
