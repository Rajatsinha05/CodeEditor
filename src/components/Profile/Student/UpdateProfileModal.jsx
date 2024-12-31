import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Input,
  Textarea,
  useColorModeValue,
  Flex,
  Icon,
  useToast,
} from "@chakra-ui/react";
import {
  FaUser,
  FaPhone,
  FaGithub,
  FaLinkedin,
  FaFileAlt,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateStudent } from "../../../redux/Student/studentsSlice";
import { showToast } from "../../../utils/toastUtils";

const UpdateProfileModal = ({ isOpen, onClose, student, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    githubURL: "",
    linkedInURL: "",
    summary: "",
  });

  const dispatch = useDispatch();
  const toast = useToast();

  // Update formData with student data
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        phoneNumber: student.phoneNumber || "",
        githubURL: student.githubURL || "",
        linkedInURL: student.linkedInURL || "",
        summary: student.summary || "",
      });
    }
  }, [student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formData.name.trim() && formData.phoneNumber.trim()) {
      try {
        await dispatch(updateStudent({ id: student.id, updates: formData }));
        showToast(toast, "Profile updated successfully", "success");

        onSave();
      } catch (error) {
        showToast(toast, error, "error");
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Name and Phone Number are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bg={useColorModeValue("gray.50", "gray.900")}
        borderRadius="lg"
      >
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={4}>
            <Flex align="center">
              <Icon as={FaUser} mr={2} />
              <Input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Flex>
            <Flex align="center">
              <Icon as={FaPhone} mr={2} />
              <Input
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </Flex>
            <Flex align="center">
              <Icon as={FaGithub} mr={2} />
              <Input
                name="githubURL"
                placeholder="GitHub URL"
                value={formData.githubURL}
                onChange={handleInputChange}
              />
            </Flex>
            <Flex align="center">
              <Icon as={FaLinkedin} mr={2} />
              <Input
                name="linkedInURL"
                placeholder="LinkedIn URL"
                value={formData.linkedInURL}
                onChange={handleInputChange}
              />
            </Flex>
            <Flex align="center">
              <Icon as={FaFileAlt} mr={2} />
              <Textarea
                name="summary"
                placeholder="Summary"
                value={formData.summary}
                onChange={handleInputChange}
                resize="none"
              />
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(UpdateProfileModal);
