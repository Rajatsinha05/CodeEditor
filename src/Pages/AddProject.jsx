import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Select,
  useColorMode,
  useTheme,
  useToast,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { createTestDetail, updateTestDetail } from "../redux/project/slice";
import { modules } from "../components/data/Modules";

const AddProject = ({ project = null }) => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const dispatch = useDispatch();

  const initialFormData = project
    ? {
        title: project.title || "",
        fileName: project.fileName || "",
        module: project.module || "",
        description: project.description || "",
        marks: project.marks || "",
        createdAt: project.createdAt || new Date().toISOString(),
        difficultyLevel: project.difficultyLevel || "",
      }
    : {
        title: "",
        fileName: "",
        module: "",
        description: "",
        marks: "",
        createdAt: new Date().toISOString(),
        difficultyLevel: "",
      };

  const [formData, setFormData] = useState(initialFormData);

  // Theme-based colors
  const bgColor = useColorModeValue("white", theme.colors.gray[800]);
  const formBgColor = useColorModeValue(
    theme.colors.gray[50],
    theme.colors.gray[700]
  );
  const textColor = useColorModeValue(
    theme.colors.gray[800],
    theme.colors.whiteAlpha[900]
  );
  const borderColor = useColorModeValue(
    theme.colors.gray[300],
    theme.colors.gray[600]
  );
  const primaryColor = useColorModeValue("red.400", "teal.400");
  const hoverColor = useColorModeValue("red.500", "teal.500");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation to ensure all required fields are filled
    if (
      !formData.title ||
      !formData.fileName ||
      !formData.module ||
      !formData.description ||
      !formData.marks ||
      !formData.difficultyLevel
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (project) {
        // Update project logic
        await dispatch(
          updateTestDetail({ id: project.id, testDetail: { ...formData } })
        ).unwrap();
        toast({
          title: "Success",
          description: "Project updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add project logic
        await dispatch(createTestDetail(formData)).unwrap();
        toast({
          title: "Success",
          description: "Project added successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setFormData(initialFormData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      rounded="xl"
      shadow="lg"
      maxW="lg"
      mx="auto"
      mt={12}
      color={textColor}
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        {project ? "Update Project" : "Add New Project"}
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack
          spacing={6}
          align="stretch"
          bg={formBgColor}
          p={6}
          rounded="lg"
          shadow="md"
        >
          <FormControl id="title" isRequired>
            <FormLabel fontWeight="semibold">Project Title</FormLabel>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter project title"
              bg={bgColor}
              color={textColor}
              border={`1px solid ${borderColor}`}
              _focus={{ borderColor: primaryColor }}
              rounded="md"
            />
          </FormControl>

          <FormControl id="fileName" isRequired>
            <FormLabel fontWeight="semibold">File Name</FormLabel>
            <Input
              type="text"
              name="fileName"
              value={formData.fileName}
              onChange={handleInputChange}
              placeholder="Enter file name"
              bg={bgColor}
              color={textColor}
              border={`1px solid ${borderColor}`}
              _focus={{ borderColor: primaryColor }}
              rounded="md"
            />
          </FormControl>

          <FormControl id="module" isRequired>
            <FormLabel fontWeight="semibold">Module</FormLabel>
            <Select
              placeholder="Select module"
              name="module"
              value={formData.module}
              onChange={handleInputChange}
              bg={bgColor}
              color={textColor}
              border={`1px solid ${borderColor}`}
              _focus={{ borderColor: primaryColor }}
              rounded="md"
            >
              {modules().map((module) => (
                <option key={module.value} value={module.value}>
                  {module.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl id="difficultyLevel" isRequired>
            <FormLabel fontWeight="semibold">Difficulty Level</FormLabel>
            <Select
              placeholder="Select difficulty"
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleInputChange}
              bg={bgColor}
              color={textColor}
              border={`1px solid ${borderColor}`}
              _focus={{ borderColor: primaryColor }}
              rounded="md"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </Select>
          </FormControl>

          <FormControl id="description" isRequired>
            <FormLabel fontWeight="semibold">Description</FormLabel>
            <ReactQuill
              value={formData.description}
              onChange={handleDescriptionChange}
              theme="snow"
              style={{
                backgroundColor: bgColor,
                color: textColor,
                border: `1px solid ${borderColor}`,
                borderRadius: "5px",
                minHeight: "150px",
              }}
            />
          </FormControl>

          <FormControl id="marks" isRequired>
            <FormLabel fontWeight="semibold">Marks</FormLabel>
            <Input
              type="number"
              name="marks"
              value={formData.marks}
              onChange={handleInputChange}
              placeholder="Enter marks"
              min="0"
              bg={bgColor}
              color={textColor}
              border={`1px solid ${borderColor}`}
              _focus={{ borderColor: primaryColor }}
              rounded="md"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            bg={primaryColor}
            _hover={{ bg: hoverColor }}
            color="white"
            width="full"
            py={6}
          >
            {project ? "Update Project" : "Add Project"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddProject;
