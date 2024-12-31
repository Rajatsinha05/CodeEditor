import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Flex,
  Image,
  Icon,
} from "@chakra-ui/react";
import { FaEdit, FaWrench } from "react-icons/fa";
import SkillsModal from "./SkillsModal";
import { useDispatch } from "react-redux";
import { updateStudent } from "../../../redux/Student/studentsSlice";

const SkillsSection = ({ student }) => {
  // Theme-based colors
  const bgColor = useColorModeValue("red.50", "gray.900"); // Soft red in light mode
  const cardBgColor = useColorModeValue("red.100", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const headingColor = useColorModeValue("red.600", "teal.300");
  const buttonBg = useColorModeValue("red.100", "teal.600");
  const buttonText = useColorModeValue("red.900", "white");
  const buttonHoverBg = useColorModeValue("red.200", "teal.500");
  const iconColor = useColorModeValue("red.500", "teal.300");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillsWithIcons, setSkillsWithIcons] = useState([]);

  const dispatch = useDispatch();

  // Generate icon URL for skills
  const getSkillIconUrl = (skill) =>
    `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill
      .toLowerCase()
      .replace(/\s+/g, "")}/${skill
      .toLowerCase()
      .replace(/\s+/g, "")}-original.svg`;

  // Initialize skills with icons when student data is available
  useEffect(() => {
    if (student?.skills) {
      const enrichedSkills = student.skills.map((skill) => ({
        name: skill,
        iconUrl: getSkillIconUrl(skill),
      }));
      setSkillsWithIcons(enrichedSkills);
    }
  }, [student?.skills]);

  const handleSave = async (updatedSkills) => {
    if (student?.id) {
      try {
        await dispatch(
          updateStudent({ id: student.id, updates: { skills: updatedSkills } })
        );
      } catch (error) {
        console.error("Failed to update student: ", error);
      }
    }

    setSkillsWithIcons(
      updatedSkills.map((skill) => ({
        name: skill,
        iconUrl: getSkillIconUrl(skill),
      }))
    );

    setIsModalOpen(false);
  };

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="lg" mb={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Flex align="center" gap={2}>
          <Icon as={FaWrench} color={iconColor} />
          <Heading size="lg" color={headingColor}>
            Skills
          </Heading>
        </Flex>
        <Button
          size="md"
          bg={buttonBg}
          color={buttonText}
          leftIcon={<FaEdit />}
          onClick={() => setIsModalOpen(true)}
          _hover={{ bg: buttonHoverBg }}
        >
          Edit Skills
        </Button>
      </Flex>
      {skillsWithIcons?.length > 0 ? (
        <Flex flexWrap="wrap" gap={3}>
          {skillsWithIcons.map((skill, index) => (
            <Box
              key={index}
              p={3}
              bg={cardBgColor}
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap={2}
              minW="120px"
              maxW="200px"
              boxShadow="sm"
              _hover={{ boxShadow: "md" }}
            >
              <Image
                src={skill.iconUrl}
                alt={skill.name}
                boxSize="24px"
                fallbackSrc="https://via.placeholder.com/24"
                borderRadius="full"
              />
              <Text fontSize="sm" color={textColor} isTruncated>
                {skill.name}
              </Text>
            </Box>
          ))}
        </Flex>
      ) : (
        <Text color={textColor} mt={3}>
          No skills added yet.
        </Text>
      )}
      <SkillsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skills={student?.skills || []}
        onSave={handleSave}
      />
    </Box>
  );
};

export default React.memo(SkillsSection);
