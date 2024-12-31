import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  NumberInput,
  NumberInputField,
  useColorMode,
  useTheme,
  useToast,
  VStack,
  useColorModeValue,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import { createContest } from "../redux/contestSlice";
import { fetchQuestions } from "../redux/Question/questionApi";
import { showToast } from "../utils/toastUtils";
import { fetchBatchById } from "../redux/Batch/batchSlice";
import { useParams } from "react-router-dom";

import ReactQuill from "react-quill";

const CreateContest = ({ onCreate, initialData = {}, onClose, isEditing }) => {
  const { user } = useSelector((store) => store.data);
  const { questions } = useSelector((store) => store.question);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { batchId } = useParams();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchBatchById(batchId));
  }, []);
  const isDarkMode = colorMode === "dark";

  const optionBgColor = isDarkMode
    ? theme.colors.gray[700]
    : theme.colors.gray[100];
  const optionHoverBgColor = isDarkMode
    ? theme.colors.gray[600]
    : theme.colors.gray[200];
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");
  const primaryColor = useColorModeValue("gray.50", "gray.700");
  const buttonColor = useColorModeValue("teal.500", "teal.400");
  const buttonBg = useColorModeValue("red.300", "teal.400");
  const buttonHoverBg = useColorModeValue("red.400", "teal.500");
  const [contestData, setContestData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    startTime: initialData.startTime || "",
    endTime: initialData.endTime || "",
    totalMarks: initialData.totalMarks || "",
    difficultyLevel: initialData.difficultyLevel || "",
    contestQuestions: initialData.contestQuestions || [],
    enrolledStudents: initialData.enrolledStudents || [],
  });

  const [isAutoDescription, setIsAutoDescription] = useState(true);

  // Generate auto-description
  useEffect(() => {
    if (isAutoDescription) {
      const levelDescriptionMap = {
        EASY: {
          color: isDarkMode ? "green.300" : "green.600",
          label: "EASY",
        },
        MEDIUM: {
          color: isDarkMode ? "orange.300" : "orange.600",
          label: "MEDIUM",
        },
        HARD: {
          color: isDarkMode ? "red.300" : "red.600",
          label: "HARD",
        },
        dynamic: {
          color: isDarkMode ? "blue.300" : "blue.600",
          label: "dynamic",
        },
      };

      const difficultyLevel =
        contestData.difficultyLevel?.toUpperCase() || "dynamic";
      const { color, label } = levelDescriptionMap[difficultyLevel];

      const generatedDescription = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: ${textColor};">
          <h2 style="color: ${color}; font-weight: bold; margin-bottom: 10px;">
            Welcome to the <span style="text-transform: capitalize;">${
              contestData.title || "Unnamed"
            }</span> Contest!
          </h2>
          <p>
            This is a 
            <span style="color: ${color}; font-weight: bold; font-size: 1.1em;">
              ${label}
            </span> 
            challenge carefully crafted to test your abilities and elevate your problem-solving skills.
          </p>
          <ul style="margin: 10px 0 15px 20px;">
            <li>Show off your expertise in tackling thought-provoking questions.</li>
            <li>Experience the thrill of competitive programming at its best.</li>
            <li>Push your boundaries, whether you are a beginner or an expert.</li>
          </ul>
          <p>
            Dive in, explore, and conquer the challenges ahead. This is your time to shine and 
            <strong style="color: ${color};">achieve greatness</strong>!
          </p>
          <footer style="margin-top: 20px; color: ${placeholderColor}; font-style: italic; text-align: right;">
            <em>Best of luck! We're rooting for you!</em>
          </footer>
        </div>
      `;

      setContestData((prev) => ({
        ...prev,
        description: generatedDescription,
      }));
    }
  }, [
    contestData.title,
    contestData.difficultyLevel,
    isAutoDescription,
    isDarkMode,
    textColor,
    placeholderColor,
  ]);

  const handleDescriptionChange = (value) => {
    setContestData((prev) => ({
      ...prev,
      description: value,
    }));
    setIsAutoDescription(false); // Disable auto-generation once edited manually
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContestData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsAutoDescription(true); // Re-enable auto-generation for new changes
  };

  const handleSelectDifficultyLevel = (selectedOption) => {
    setContestData((prev) => ({
      ...prev,
      difficultyLevel: selectedOption.value,
    }));
    setIsAutoDescription(true); // Re-enable auto-generation for difficulty level
  };

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const handleSelectQuestions = (selectedOptions) => {
    const contestQuestions = selectedOptions.map((option) => ({
      questionId: option.value,
      marks: 0, // Initialize marks with 0
    }));
    setContestData({ ...contestData, contestQuestions });
  };

  const handleMarksChange = (index, marks) => {
    const updatedQuestions = [...contestData.contestQuestions];
    updatedQuestions[index].marks = parseInt(marks, 10) || 0;
    setContestData({ ...contestData, contestQuestions: updatedQuestions });
  };

  const { selectedBatch } = useSelector((store) => store.batch);
  const validateFields = () => {
    const newErrors = {}; // Initialize new error state

    if (!contestData.title) newErrors.title = "Title is required.";
    if (!contestData.startTime) newErrors.startTime = "Start Time is required.";
    if (!contestData.endTime) newErrors.endTime = "End Time is required.";
    if (!contestData.difficultyLevel)
      newErrors.difficultyLevel = "Difficulty Level is required.";
    if (contestData.contestQuestions.length === 0)
      newErrors.contestQuestions = "At least one question must be selected.";

    const sumOfQuestionMarks = contestData.contestQuestions.reduce(
      (acc, question) => acc + question.marks,
      0
    );

    if (sumOfQuestionMarks !== parseInt(contestData.totalMarks, 10)) {
      newErrors.totalMarks =
        "Total Marks must equal the sum of question marks.";
    }

    setErrors(newErrors); // Update the error state
    return Object.keys(newErrors).length === 0; // Return if the form is valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the fields
    if (!validateFields()) {
      showToast(toast, "Please fix the errors before submitting.", "error");
      return;
    }

    // Ensure total marks match the sum of individual question marks

    // Prepare payload
    const studentsIds = selectedBatch?.students.map((id) => id) || [];
    const contestPayload = {
      ...contestData,
      createdBy: user?.id,
      enrolledStudents: studentsIds,
      batchId: batchId,
    };

    try {
      await dispatch(createContest(contestPayload)).unwrap();
      showToast(toast, "Contest Created", "success");

      if (onClose) {
        onClose(); // Close modal or reset form
      }
    } catch (error) {
      showToast(toast, error.message || "Failed to create contest", "error");
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: bgColor,
      color: textColor,
      borderColor: borderColor,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? primaryColor : optionBgColor,
      color: textColor,
      "&:hover": {
        backgroundColor: optionHoverBgColor,
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: textColor,
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: bgColor,
      zIndex: 9999,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: placeholderColor,
    }),
  };
  return (
    <Box
      bg={bgColor}
      p={8}
      rounded="lg"
      shadow="lg"
      maxW={isEditing ? "100%" : "60%"} // Center the form
      mx="auto"
      mt={8} // Add margin from the top
      borderWidth={1}
      borderColor={borderColor}
    >
      {/* Header */}
      <Heading as="h2" size="lg" textAlign="center" color={textColor} mb={6}>
        Create Contest
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          {/* Title Field */}
          <FormControl id="title" isInvalid={errors.title}>
            <FormLabel color={textColor} fontWeight="bold">
              Title
            </FormLabel>
            <Input
              type="text"
              name="title"
              value={contestData.title}
              onChange={handleChange}
              bg={primaryColor}
              color={textColor}
              border={`1px solid ${borderColor}`}
              _placeholder={{ color: placeholderColor }}
              _hover={{ borderColor: buttonHoverBg }}
              _focus={{ borderColor: buttonHoverBg, boxShadow: "0 0 4px teal" }}
            />
            {errors.title && <Text color="red.500">{errors.title}</Text>}
          </FormControl>

          {/* Description Field */}
          <FormControl>
            <FormLabel color={textColor} fontWeight="bold">
              Description
            </FormLabel>
            <ReactQuill
              value={contestData.description}
              onChange={handleDescriptionChange}
              theme="snow"
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(45, 55, 72, 1)"
                  : "rgba(255, 255, 255, 1)", // Dark mode: gray; Light mode: white
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.87)"
                  : "rgba(26, 32, 44, 1)", // Dark mode: off-white; Light mode: dark gray
                border: `1px solid ${
                  isDarkMode ? "rgba(74, 85, 104, 1)" : "rgba(226, 232, 240, 1)"
                }`, // Border colors
                borderRadius: "8px",
                minHeight: "200px",
                padding: "10px", // Padding for better appearance
                boxShadow: isDarkMode
                  ? "0 2px 4px rgba(0, 0, 0, 0.8)" // Dark mode shadow
                  : "0 2px 4px rgba(0, 0, 0, 0.1)", // Light mode shadow
              }}
            />
          </FormControl>

          {/* Start Time Field */}
          <FormControl id="startTime" isInvalid={errors.startTime}>
            <FormLabel color={textColor} fontWeight="bold">
              Start Time
            </FormLabel>
            <Input
              type="datetime-local"
              name="startTime"
              value={contestData.startTime}
              onChange={handleChange}
              bg={primaryColor}
              color={textColor}
              border={`1px solid ${borderColor}`}
              _placeholder={{ color: placeholderColor }}
              _hover={{ borderColor: buttonHoverBg }}
              _focus={{ borderColor: buttonHoverBg, boxShadow: "0 0 4px teal" }}
            />
            {errors.startTime && (
              <Text color="red.500">{errors.startTime}</Text>
            )}
          </FormControl>

          {/* End Time Field */}
          <FormControl id="endTime" isInvalid={errors.endTime}>
            <FormLabel color={textColor} fontWeight="bold">
              End Time
            </FormLabel>
            <Input
              type="datetime-local"
              name="endTime"
              value={contestData.endTime}
              onChange={handleChange}
              bg={primaryColor}
              color={textColor}
              border={`1px solid ${borderColor}`}
              _placeholder={{ color: placeholderColor }}
              _hover={{ borderColor: buttonHoverBg }}
              _focus={{ borderColor: buttonHoverBg, boxShadow: "0 0 4px teal" }}
            />
            {errors.endTime && <Text color="red.500">{errors.endTime}</Text>}
          </FormControl>

          {/* Total Marks Field */}
          <FormControl id="totalMarks" isInvalid={errors.totalMarks}>
            <FormLabel color={textColor} fontWeight="bold">
              Total Marks
            </FormLabel>
            <Input
              type="number"
              name="totalMarks"
              value={contestData.totalMarks}
              onChange={handleChange}
              bg={primaryColor}
              color={textColor}
              border={`1px solid ${borderColor}`}
              _placeholder={{ color: placeholderColor }}
              _hover={{ borderColor: buttonHoverBg }}
              _focus={{ borderColor: buttonHoverBg, boxShadow: "0 0 4px teal" }}
            />
            {errors.totalMarks && (
              <Text color="red.500">{errors.totalMarks}</Text>
            )}
          </FormControl>

          {/* Difficulty Level Field */}
          <FormControl id="difficultyLevel" isInvalid={errors.difficultyLevel}>
            <FormLabel color={textColor} fontWeight="bold">
              Difficulty Level
            </FormLabel>
            <Select
              value={{
                value: contestData.difficultyLevel,
                label:
                  contestData.difficultyLevel.charAt(0) +
                  contestData.difficultyLevel.slice(1).toLowerCase(),
              }}
              onChange={handleSelectDifficultyLevel}
              options={[
                { value: "EASY", label: "Easy" },
                { value: "MEDIUM", label: "Medium" },
                { value: "HARD", label: "Hard" },
              ]}
              styles={customSelectStyles}
              bg={primaryColor}
              color={textColor}
              border={`1px solid ${borderColor}`}
              _hover={{ borderColor: buttonHoverBg }}
              _focus={{ borderColor: buttonHoverBg, boxShadow: "0 0 4px teal" }}
            />
            {errors.difficultyLevel && (
              <Text color="red.500">{errors.difficultyLevel}</Text>
            )}
          </FormControl>

          {/* Select Questions Field */}
          <FormControl
            id="selectedQuestions"
            isInvalid={errors.contestQuestions}
          >
            <FormLabel color={textColor} fontWeight="bold">
              Select Questions
            </FormLabel>
            <Select
              options={questions.map((question) => ({
                value: question.id,
                label: question.title,
              }))}
              onChange={handleSelectQuestions}
              isMulti
              closeMenuOnSelect={false}
              styles={customSelectStyles}
            />
            {errors.contestQuestions && (
              <Text color="red.500">{errors.contestQuestions}</Text>
            )}
          </FormControl>

          {/* Add Marks for Each Question */}
          {contestData.contestQuestions.map((question, index) => (
            <Box key={index} mt={2}>
              <FormLabel color={textColor}>
                Marks for Question "
                {questions.find((q) => q.id === question.questionId)?.title}"
              </FormLabel>
              <NumberInput
                min={0}
                value={question.marks}
                onChange={(valueString) =>
                  handleMarksChange(index, valueString)
                }
              >
                <NumberInputField
                  bg={primaryColor}
                  color={textColor}
                  border={`1px solid ${borderColor}`}
                  _placeholder={{ color: placeholderColor }}
                  _hover={{ borderColor: buttonHoverBg }}
                  _focus={{
                    borderColor: buttonHoverBg,
                    boxShadow: "0 0 4px teal",
                  }}
                />
              </NumberInput>
            </Box>
          ))}

          {/* Submit Button */}
          <Button
            mt={4}
            bg={buttonBg}
            color="white"
            type="submit"
            size="lg"
            _hover={{
              bg: buttonHoverBg,
              transform: "scale(1.02)",
              transition: "all 0.2s ease-in-out",
            }}
            _active={{
              bg: buttonHoverBg,
              transform: "scale(0.98)",
            }}
          >
            Create Contest
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateContest;
