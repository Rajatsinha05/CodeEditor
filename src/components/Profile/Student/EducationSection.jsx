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
  FaUniversity,
  FaCalendarAlt,
  FaGraduationCap,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import EducationModal from "./EducationModal";
import { deleteEducation } from "../../../redux/Student/educationApi";
import { useDispatch } from "react-redux";

const EducationSection = ({ student, onRefresh }) => {
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBgColor = useColorModeValue("red.50", "gray.800");
  const hoverBgColor = useColorModeValue("red.100", "teal.800");
  const textColor = useColorModeValue("gray.800", "white");
  const headingColor = useColorModeValue("red.600", "teal.300");
  const buttonBg = useColorModeValue("red.100", "teal.600");
  const buttonText = useColorModeValue("red.900", "white");
  const iconColor = useColorModeValue("red.500", "teal.300");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState(null);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleEdit = (education) => {
    setCurrentEducation(education);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentEducation(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEducation(id));
      toast({
        title: "Education Deleted",
        description: "The education entry was successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onRefresh(); // Refresh the student data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the education entry.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    onRefresh(); // Refresh the student data
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
          <Icon as={FaGraduationCap} color={headingColor} />
          <Heading size="lg" color={headingColor}>
            Education
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
          Add Education
        </Button>
      </Flex>
      {student?.education?.length > 0 ? (
        <List spacing={6}>
          {student.education.map((edu) => (
            <ListItem
              key={edu.id}
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
                    <FaGraduationCap color={iconColor} />
                    <Text fontWeight="bold" fontSize="lg" color={textColor}>
                      {edu.degree}
                    </Text>
                  </HStack>
                  <HStack>
                    <FaUniversity color={iconColor} />
                    <Text fontSize="md" color={textColor}>
                      {edu.institution}
                    </Text>
                  </HStack>
                  <HStack>
                    <FaCalendarAlt color={iconColor} />
                    <Text fontSize="sm" color={textColor}>
                      {edu.startDate} - {edu.endDate || "Ongoing"}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color={textColor}>
                    <strong>Grade:</strong> {edu.grade || "N/A"}
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
                    <MenuItem icon={<FaEdit />} onClick={() => handleEdit(edu)}>
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<FaTrash />}
                      onClick={() => handleDelete(edu.id)}
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
          No education records added yet.
        </Text>
      )}
      <EducationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        education={currentEducation}
        studentId={student?.id}
        onSave={handleSave}
      />
    </Box>
  );
};

export default React.memo(EducationSection);
