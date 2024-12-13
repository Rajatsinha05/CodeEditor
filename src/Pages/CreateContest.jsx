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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getStudents } from "../redux/apiSlice";
import { createContest } from "../redux/contestSlice";
import { fetchQuestions } from "../redux/Question/questionApi";
import { showToast } from "../utils/toastUtils";
import { fetchBatchById } from "../redux/Batch/batchSlice";
import { useParams } from "react-router-dom";

const CreateContest = ({ onCreate, initialData = {}, onClose, isEditing }) => {
  const { user } = useSelector((store) => store.data);
  const { questions } = useSelector((store) => store.question);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { batchId } = useParams();
  useEffect(() => {
    dispatch(fetchBatchById(batchId));
  }, []);
  const isDarkMode = colorMode === "dark";
  const bgColor = isDarkMode ? theme.colors.gray[800] : theme.colors.gray[100];
  const textColor = isDarkMode
    ? theme.colors.whiteAlpha[900]
    : theme.colors.blackAlpha[900];
  const primaryColor = isDarkMode
    ? theme.colors.gray[700]
    : theme.colors.gray[200];
  const borderColor = isDarkMode
    ? theme.colors.whiteAlpha[300]
    : theme.colors.blackAlpha[300];
  const placeholderColor = isDarkMode
    ? theme.colors.gray[400]
    : theme.colors.gray[600];
  const optionBgColor = isDarkMode
    ? theme.colors.gray[700]
    : theme.colors.gray[100];
  const optionHoverBgColor = isDarkMode
    ? theme.colors.gray[600]
    : theme.colors.gray[200];

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
      const generatedDescription = `Step into the ${
        contestData.title
      } contest—a ${
        contestData.difficultyLevel?.toLowerCase() || "dynamic"
      }-level challenge designed to push your limits and sharpen your skills. Whether you're a seasoned expert or eager to learn, this contest offers a chance to showcase your knowledge and achieve greatness. Best of luck!`;

      setContestData((prev) => ({
        ...prev,
        description: generatedDescription,
      }));
    }
  }, [contestData.title, contestData.difficultyLevel, isAutoDescription]);

  const handleDescriptionChange = (e) => {
    setContestData({ ...contestData, description: e.target.value });
    setIsAutoDescription(false); // Disable auto-generation once edited manually
  };

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContestData({ ...contestData, [name]: value });
  };

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

  const handleSelectDifficultyLevel = (selectedOption) => {
    setContestData({ ...contestData, difficultyLevel: selectedOption.value });
  };

  const { selectedBatch } = useSelector((store) => store.batch);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let studentsIds = [];
    selectedBatch?.students.map((id) => {
      studentsIds.push(id);
    });
    // Calculate the sum of marks for all questions
    const sumOfQuestionMarks = contestData.contestQuestions.reduce(
      (acc, question) => acc + question.marks,
      0
    );

    // Validate totalMarks vs sumOfQuestionMarks
    if (sumOfQuestionMarks !== parseInt(contestData.totalMarks, 10)) {
      showToast(toast, "Total Marks Mismatch", "error");

      return;
    }

    if (!contestData.title || !contestData.contestQuestions.length) {
      showToast(toast, "Missing Information", "warning");

      return;
    }

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
        onClose();
      }
    } catch (error) {
      showToast(toast, error, "error");
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
    <Box bg={bgColor} p={4} rounded="md">
      <form onSubmit={handleSubmit}>
        <FormControl id="title" mt={4}>
          <FormLabel color={textColor}>Title</FormLabel>
          <Input
            type="text"
            name="title"
            value={contestData.title}
            onChange={handleChange}
            bg={primaryColor}
            color={textColor}
            border={`1px solid ${borderColor}`}
            _placeholder={{ color: placeholderColor }}
          />
        </FormControl>
        <FormControl id="description" mt={4}>
          <FormLabel color={textColor}>Description </FormLabel>
          <Textarea
            name="description"
            value={contestData.description}
            onChange={handleDescriptionChange}
            bg={primaryColor}
            color={textColor}
            border={`1px solid ${borderColor}`}
            _placeholder={{ color: placeholderColor }}
          />
        </FormControl>

        <FormControl id="startTime" mt={4}>
          <FormLabel color={textColor}>Start Time</FormLabel>
          <Input
            type="datetime-local"
            name="startTime"
            value={contestData.startTime}
            onChange={handleChange}
            bg={primaryColor}
            color={textColor}
            border={`1px solid ${borderColor}`}
            _placeholder={{ color: placeholderColor }}
          />
        </FormControl>
        <FormControl id="endTime" mt={4}>
          <FormLabel color={textColor}>End Time</FormLabel>
          <Input
            type="datetime-local"
            name="endTime"
            value={contestData.endTime}
            onChange={handleChange}
            bg={primaryColor}
            color={textColor}
            border={`1px solid ${borderColor}`}
            _placeholder={{ color: placeholderColor }}
          />
        </FormControl>
        <FormControl id="totalMarks" mt={4}>
          <FormLabel color={textColor}>Total Marks</FormLabel>
          <Input
            type="number"
            name="totalMarks"
            value={contestData.totalMarks}
            onChange={handleChange}
            bg={primaryColor}
            color={textColor}
            border={`1px solid ${borderColor}`}
            _placeholder={{ color: placeholderColor }}
          />
        </FormControl>
        <FormControl id="difficultyLevel" mt={4}>
          <FormLabel color={textColor}>Difficulty Level</FormLabel>
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
          />
        </FormControl>

        <FormControl id="selectedQuestions" mt={4}>
          <FormLabel color={textColor}>Select Questions</FormLabel>
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
                />
              </NumberInput>
            </Box>
          ))}
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit">
          Create Contest
        </Button>
      </form>
    </Box>
  );
};

export default CreateContest;
