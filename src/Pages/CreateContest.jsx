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
import { getStudents, fetchQuestions } from "../redux/apiSlice";
import { createContest } from "../redux/contestSlice";

const CreateContest = ({ onCreate }) => {
  const { user, questions } = useSelector((store) => store.data);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const dispatch = useDispatch();

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
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    totalMarks: "",
    difficultyLevel: "",
    contestQuestions: [],
    enrolledStudents: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  const { students } = useSelector((store) => store.data);
  console.log("students: ", students);

  useEffect(() => {
    dispatch(getStudents());
    dispatch(fetchQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (students) {
      const formattedStudents = students?.map((student) => ({
        id: student.id,
        name: student.name,
        grid: student.grid,
        branchCode: student.branchCode,
        course: student.course,
      }));
      setFilteredStudents(formattedStudents);
    }
  }, [students]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    setFilteredStudents(
      students.filter(
        (student) =>
          student?.name?.toLowerCase().includes(lowercasedQuery) ||
          student?.id?.toString().includes(lowercasedQuery) ||
          student?.grid?.toLowerCase().includes(lowercasedQuery) ||
          student?.branchCode?.toLowerCase().includes(lowercasedQuery) ||
          student?.course?.toLowerCase().includes(lowercasedQuery)
      )
    );
  }, [searchQuery, students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContestData({ ...contestData, [name]: value });
  };

  const handleAttemptQuestion = (questionId) => {
    navigate(`/contest/${id}/attempt/${questionId}`);
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

  const handleSelectStudents = (selectedOptions) => {
    const enrolledStudents = selectedOptions.map((option) => ({
      id: option.value,
      name: option.label.split(" - ")[0], // Extracting name from label
      email: "", // Placeholder, assuming you may fill it based on other info or API
    }));
    setContestData({ ...contestData, enrolledStudents });
  };

  const handleSelectDifficultyLevel = (selectedOption) => {
    setContestData({ ...contestData, difficultyLevel: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate the sum of marks for all questions
    const sumOfQuestionMarks = contestData.contestQuestions.reduce(
      (acc, question) => acc + question.marks,
      0
    );

    // Validate totalMarks vs sumOfQuestionMarks
    if (sumOfQuestionMarks !== parseInt(contestData.totalMarks, 10)) {
      toast({
        title: "Total Marks Mismatch",
        description: `The sum of question marks (${sumOfQuestionMarks}) does not match the total marks (${contestData.totalMarks}). Please correct this before submitting.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }

    if (
      !contestData.title ||
      !contestData.contestQuestions.length ||
      !contestData.enrolledStudents.length
    ) {
      toast({
        title: "Missing Information",
        description:
          "Please ensure all fields are filled and selections are made.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }

    const contestPayload = {
      ...contestData,
      createdBy: user?.id,
    };

    try {
      await dispatch(createContest(contestPayload)).unwrap();
      setContestData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        totalMarks: "",
        difficultyLevel: "",
        contestQuestions: [],
        enrolledStudents: [],
      });
      toast({
        title: "Contest Created",
        description: "The contest has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      onCreate && onCreate(); // Callback for additional actions
    } catch (error) {
      toast({
        title: "Error Creating Contest",
        description:
          error.message || "Failed to create contest due to an error.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
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
          <FormLabel color={textColor}>Description</FormLabel>
          <Textarea
            name="description"
            value={contestData.description}
            onChange={handleChange}
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
        <FormControl id="selectedStudents" mt={4}>
          <FormLabel color={textColor}>Select Students</FormLabel>
          <Select
            options={filteredStudents.map((student) => ({
              value: student.id,
              label: `${student.name} - ${student.id} - ${student.grid} - ${student.course} - ${student.branchCode}`,
            }))}
            onChange={handleSelectStudents}
            isMulti
            closeMenuOnSelect={false}
            styles={customSelectStyles}
            onInputChange={(inputValue) => setSearchQuery(inputValue)}
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
                Marks for Question "{questions.find((q) => q.id === question.questionId)?.title}"
              </FormLabel>
              <NumberInput
                min={0}
                value={question.marks}
                onChange={(valueString) => handleMarksChange(index, valueString)}
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
        <Button mt={4} colorScheme="blue" type="submit">
          Create Contest
        </Button>
      </form>
    </Box>
  );
};

export default CreateContest;
