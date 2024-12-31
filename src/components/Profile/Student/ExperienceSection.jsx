import React, { useState } from "react";
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  IconButton,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useToast,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import {
  FaPlus,
  FaEllipsisV,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import ExperienceModal from "./ExperienceModal"; // Similar to EducationModal
import { deleteExperience } from "../../../redux/Student/ExperienceApi"; // API call for deletion
import { useDispatch } from "react-redux";

const ExperienceSection = ({ student, onRefresh }) => {
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBgColor = useColorModeValue("red.50", "gray.800");
  const hoverBgColor = useColorModeValue("red.100", "teal.800");
  const textColor = useColorModeValue("gray.800", "white");
  const headingColor = useColorModeValue("red.600", "teal.300");
  const buttonBg = useColorModeValue("red.100", "teal.600");
  const buttonText = useColorModeValue("red.900", "white");
  const iconColor = useColorModeValue("red.500", "teal.300");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleEdit = (experience) => {
    setCurrentExperience(experience);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentExperience(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteExperience(id));
      toast({
        title: "Experience Deleted",
        description: "The experience entry was successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the experience entry.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    onRefresh();
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      mb={6}
      w="100%"
      maxW="1200px"
      mx="auto"
    >
      <Flex align="center" justify="space-between" mb={6}>
        <Flex align="center" gap={2}>
          <Icon as={FaBriefcase} color={headingColor} />
          <Heading size="lg" color={headingColor}>
            Experience
          </Heading>
        </Flex>

        <Button
          size="md"
          bg={buttonBg}
          color={buttonText}
          leftIcon={<FaPlus />}
          onClick={handleAdd}
          _hover={{ bg: useColorModeValue("red.200", "teal.500") }}
        >
          Add Experience
        </Button>
      </Flex>
      {student?.experiences?.length > 0 ? (
        <List spacing={6}>
          {student.experiences.map((exp) => (
            <ListItem
              key={exp.id}
              bg={cardBgColor}
              p={5}
              borderRadius="lg"
              boxShadow="sm"
              _hover={{ bg: hoverBgColor, boxShadow: "md" }}
              transition="background-color 0.3s, box-shadow 0.3s"
            >
              <Flex align="center" justify="space-between">
                <VStack align="start" spacing={2} w="full">
                  <HStack>
                    <FaBriefcase color={iconColor} />
                    <Text fontWeight="bold" fontSize="lg" color={textColor}>
                      {exp.jobTitle}
                    </Text>
                  </HStack>
                  <HStack>
                    <FaBuilding color={iconColor} />
                    <Text fontSize="md" color={textColor}>
                      {exp.company}
                    </Text>
                  </HStack>
                  <HStack>
                    <FaCalendarAlt color={iconColor} />
                    <Text fontSize="sm" color={textColor}>
                      {exp.startDate} - {exp.endDate || "Ongoing"}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color={textColor}>
                    {exp.description}
                  </Text>
                </VStack>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FaEllipsisV />}
                    size="sm"
                    aria-label="Options"
                    variant="ghost"
                    color={iconColor}
                  />
                  <MenuList>
                    <MenuItem icon={<FaEdit />} onClick={() => handleEdit(exp)}>
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<FaTrash />}
                      onClick={() => handleDelete(exp.id)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </ListItem>
          ))}
        </List>
      ) : (
        <Text color={textColor} textAlign="center" mt={6} fontSize="lg">
          No experience records added yet.
        </Text>
      )}
      <ExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        experience={currentExperience}
        studentId={student?.id}
        onSave={handleSave}
      />
    </Box>
  );
};

export default React.memo(ExperienceSection);
