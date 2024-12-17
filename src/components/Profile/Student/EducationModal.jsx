import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  Flex,
  Box,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import {
  createEducation,
  updateEducation,
} from "../../../redux/Student/educationApi";
import { showToast } from "../../../utils/toastUtils";

const EducationModal = ({ isOpen, onClose, education, onSave, studentId }) => {
  const [formData, setFormData] = useState({
    id: education?.id || null,
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
    grade: "",
  });

  const inputBgColor = useColorModeValue("white", "gray.800");
  const inputTextColor = useColorModeValue("gray.800", "white");
  const modalBgColor = useColorModeValue("gray.50", "gray.900");
  const dispatch = useDispatch();
  const toast = useToast(); // Toast for notifications

  useEffect(() => {
    if (education) {
      setFormData(education);
    } else {
      setFormData({
        id: null,
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        grade: "",
      });
    }
  }, [education]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        // Update existing education entry
        await dispatch(
          updateEducation({
            id: formData.id,
            updates: { ...formData, studentId },
          })
        );
        showToast(toast, "Education Updated", "success");
      } else {
        // Create new education entry
        await dispatch(
          createEducation({
            ...formData,
            studentId,
          })
        );
        showToast(toast, "Education Added", "success");
      }
      onSave(); // Notify the parent component
      onClose(); // Close the modal
    } catch (error) {
      showToast(toast, error, "error");
    }
  };

  const isSaveDisabled =
    !formData.degree.trim() || !formData.institution.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={modalBgColor}>
        <ModalHeader>
          {formData.id ? "Edit Education" : "Add Education"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={3}>
            <Input
              placeholder="Degree"
              name="degree"
              value={formData.degree}
              onChange={handleInputChange}
              bg={inputBgColor}
              color={inputTextColor}
            />
            <Input
              placeholder="Institution"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              bg={inputBgColor}
              color={inputTextColor}
            />
            <Input
              placeholder="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              bg={inputBgColor}
              color={inputTextColor}
            />
            <Input
              placeholder="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              bg={inputBgColor}
              color={inputTextColor}
            />
            <Input
              placeholder="Grade"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              bg={inputBgColor}
              color={inputTextColor}
            />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            colorScheme="teal"
            mr={3}
            onClick={handleSave}
            isDisabled={isSaveDisabled}
          >
            {formData.id ? "Update Education" : "Add Education"}
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(EducationModal);
