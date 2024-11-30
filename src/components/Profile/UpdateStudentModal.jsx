import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { updateStudent } from "../../redux/Student/studentsSlice";

const UpdateStudentModal = ({ isOpen, onClose, studentData, refreshStudents }) => {
  const [formData, setFormData] = useState(studentData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const toast = useToast();
  const modalBgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    setFormData(studentData || {});
    setErrors({});
  }, [studentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.course) newErrors.course = "Course is required.";
    if (!formData.branchCode) newErrors.branchCode = "Branch code is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(updateStudent({ id: formData.id, studentData: formData })).unwrap();
      toast({
        title: "Student updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      if (refreshStudents) refreshStudents();
    } catch (error) {
      toast({
        title: "Error updating student.",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg={modalBgColor}>
        <ModalHeader>Update Student</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Course</FormLabel>
            <Select
              name="course"
              value={formData.course || ""}
              onChange={handleChange}
              isInvalid={!!errors.course}
            >
              <option value="">Select Course</option>
              <option value="android Developer">Android Developer</option>
              <option value="C++">C++</option>
              <option value="backend Developer">Backend Developer</option>
              <option value="full stack Developer">Full Stack Developer</option>
              <option value="frontend Developer">Frontend Developer</option>
              <option value="C">C</option>
            </Select>
            {errors.course && <p style={{ color: "red" }}>{errors.course}</p>}
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Branch Code</FormLabel>
            <Select
              name="branchCode"
              value={formData.branchCode || ""}
              onChange={handleChange}
              isInvalid={!!errors.branchCode}
            >
              <option value="">Select Branch Code</option>
              <option value="rw1">Branch RW1</option>
              <option value="rw2">Branch RW2</option>
              <option value="rw3">Branch RW3</option>
              <option value="rw4">Branch RW4</option>
              <option value="rw5">Branch RW5</option>
            </Select>
            {errors.branchCode && <p style={{ color: "red" }}>{errors.branchCode}</p>}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Save
          </Button>
          <Button variant="ghost" onClick={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateStudentModal;
