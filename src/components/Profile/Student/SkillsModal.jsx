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
  Box,
  Flex,
  IconButton,
  Text,
  Image,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { showToast } from "../../../utils/toastUtils";

const SkillsModal = ({ isOpen, onClose, skills, onSave }) => {
  const [skillList, setSkillList] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const toast = useToast();

  const inputBgColor = useColorModeValue("white", "gray.800");
  const inputTextColor = useColorModeValue("gray.800", "white");
  const modalBgColor = useColorModeValue("gray.50", "gray.900");

  // Helper function to generate icon URL
  const getSkillIconUrl = (skill) =>
    `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill
      .toLowerCase()
      .replace(/\s+/g, "")}/${skill
      .toLowerCase()
      .replace(/\s+/g, "")}-original.svg`;

  // Initialize or update skillList when the `skills` prop changes
  useEffect(() => {
    if (skills && Array.isArray(skills)) {
      setSkillList(
        skills.map((skill) => ({
          name: skill,
          iconUrl: getSkillIconUrl(skill),
        }))
      );
    }
  }, [skills]);

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      const skillWithIcon = {
        name: newSkill.trim(),
        iconUrl: getSkillIconUrl(newSkill.trim()),
      };
      setSkillList([...skillList, skillWithIcon]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = skillList.filter((_, i) => i !== index);
    setSkillList(updatedSkills);
  };

  const handleSave = () => {
    const skillNames = skillList.map((skill) => skill.name); // Extract only names
    onSave(skillNames); // Send the list of names
    showToast(toast, "Skills updated successfully!", "success");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={modalBgColor} maxW="400px" mx="auto">
        <ModalHeader>Edit Skills</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Display Skills */}
          <Flex flexWrap="wrap" gap={3} mb={4}>
            {skillList.map((skill, index) => (
              <Box
                key={index}
                p={2}
                bg={useColorModeValue("gray.100", "gray.700")}
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                minW="150px"
                maxW="200px"
                _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
              >
                <Flex alignItems="center" gap={2}>
                  <Image
                    src={skill.iconUrl}
                    alt={skill.name}
                    boxSize="20px"
                    fallbackSrc="https://via.placeholder.com/20"
                    borderRadius="full"
                  />
                  <Text fontSize="sm" noOfLines={1}>
                    {skill.name}
                  </Text>
                </Flex>
                <IconButton
                  icon={<FaTrash />}
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => handleRemoveSkill(index)}
                  aria-label={`Remove ${skill.name}`}
                />
              </Box>
            ))}
          </Flex>

          {/* Add New Skill */}
          <Flex align="center" gap={2}>
            <Input
              placeholder="Add a new skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              bg={inputBgColor}
              color={inputTextColor}
              size="sm"
            />
            <IconButton
              icon={<FaPlus />}
              size="sm"
              colorScheme="teal"
              onClick={handleAddSkill}
              aria-label="Add Skill"
            />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" colorScheme="teal" mr={2} onClick={handleSave}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(SkillsModal);
