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
  Textarea,
  Checkbox,
  Flex,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import {
  createExperience,
  updateExperience,
} from "../../../redux/Student/ExperienceApi";
import { showToast } from "../../../utils/toastUtils";

const ExperienceModal = ({
  isOpen,
  onClose,
  experience,
  onSave,
  studentId,
}) => {
  const [formData, setFormData] = useState({
    id: experience?.id || null,
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    currentlyWorking: false, // New state field
  });

  const inputBgColor = useColorModeValue("white", "gray.800");
  const inputTextColor = useColorModeValue("gray.800", "white");
  const modalBgColor = useColorModeValue("gray.50", "gray.900");
  const dispatch = useDispatch();
  const toast = useToast(); // For notifications

  useEffect(() => {
    if (experience) {
      setFormData({
        ...experience,
        currentlyWorking: experience.endDate === null, // Set currentlyWorking based on endDate
      });
    } else {
      setFormData({
        id: null,
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        currentlyWorking: false,
      });
    }
  }, [experience]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      currentlyWorking: checked,
      endDate: checked ? null : prev.endDate, // Set endDate to null if checked
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        id: formData.id || null,
        jobTitle: formData.jobTitle,
        company: formData.company,
        startDate: formData.startDate,
        endDate: formData.currentlyWorking ? null : formData.endDate,
        description: formData.description,
        studentId: studentId, // Pass studentId explicitly
      };

      if (formData.id) {
        // Update existing experience entry
        await dispatch(updateExperience({ id: formData.id, updates: payload }));
        showToast(toast, "Experience Updated", "success");
      } else {
        // Create new experience entry
        await dispatch(createExperience(payload));
        showToast(toast, "Experience Added", "success");
      }

      onSave(); // Notify the parent component
      onClose(); // Close the modal
    } catch (error) {
      showToast(toast, error.message || "Something went wrong!", "error");
    }
  };

  const isSaveDisabled =
    !formData.jobTitle.trim() ||
    !formData.company.trim() ||
    !formData.startDate;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={modalBgColor}>
        <ModalHeader>
          {formData.id ? "Edit Experience" : "Add Experience"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={3}>
            <Input
              placeholder="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              bg={inputBgColor}
              color={inputTextColor}
            />
            <Input
              placeholder="Company"
              name="company"
              value={formData.company}
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
            <Checkbox
              isChecked={formData.currentlyWorking}
              onChange={handleCheckboxChange}
              colorScheme="teal"
            >
              Currently Working
            </Checkbox>
            <Input
              placeholder="End Date"
              type="date"
              name="endDate"
              value={formData.endDate || ""}
              onChange={handleInputChange}
              bg={inputBgColor}
              color={inputTextColor}
              isDisabled={formData.currentlyWorking}
            />
            <Textarea
              placeholder="Job Description"
              name="description"
              value={formData.description}
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
            {formData.id ? "Update Experience" : "Add Experience"}
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(ExperienceModal);
