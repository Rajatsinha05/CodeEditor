import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getStudents, fetchQuestions } from "../redux/apiSlice";
import { createContest } from "../redux/contestSlice";

const CreateContest = ({ onCreate }) => {
  const { user, questions } = useSelector((store) => store.data);

  const { colorMode } = useColorMode();
  const theme = useTheme();
  const dispatch = useDispatch();

  const isDarkMode = colorMode === "dark";
  const bgColor = isDarkMode ? theme.colors.gray[800] : theme.colors.gray[100];
  const textColor = isDarkMode ? theme.colors.whiteAlpha[900] : theme.colors.blackAlpha[900];
  const primaryColor = isDarkMode ? theme.colors.gray[700] : theme.colors.gray[200];
  const borderColor = isDarkMode ? theme.colors.whiteAlpha[300] : theme.colors.blackAlpha[300];
  const placeholderColor = isDarkMode ? theme.colors.gray[400] : theme.colors.gray[600];
  const optionBgColor = isDarkMode ? theme.colors.gray[700] : theme.colors.gray[100];
  const optionHoverBgColor = isDarkMode ? theme.colors.gray[600] : theme.colors.gray[200];

  const [contestData, setContestData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    totalMarks: "",
    difficultyLevel: "",
    selectedQuestions: [],
    selectedStudents: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  const { students } = useSelector((store) => store.data);

  useEffect(() => {
    dispatch(getStudents());
    dispatch(fetchQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (students) {
      const formattedStudents = students.map((student) => ({
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
          student.name.toLowerCase().includes(lowercasedQuery) ||
          student.id.toString().includes(lowercasedQuery) ||
          student.grid.toLowerCase().includes(lowercasedQuery) ||
          student.branchCode.toLowerCase().includes(lowercasedQuery) ||
          student.course.toLowerCase().includes(lowercasedQuery)
      )
    );
  }, [searchQuery, students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContestData({ ...contestData, [name]: value });
  };

  const handleSelectQuestions = (selectedOptions) => {
    const selectedQuestions = selectedOptions.map((option) => option.value);
    setContestData({ ...contestData, selectedQuestions });
  };

  const handleSelectStudents = (selectedOptions) => {
    const selectedStudents = selectedOptions.map((option) => option.value);
    setContestData({ ...contestData, selectedStudents });
  };

  const handleSelectDifficultyLevel = (selectedOption) => {
    setContestData({ ...contestData, difficultyLevel: selectedOption.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const contestPayload = {
      ...contestData,
      createdById: user?.id,
      questionIds: contestData.selectedQuestions,
      enrolledStudentIds: contestData.selectedStudents,
    };
    dispatch(createContest(contestPayload));
    setContestData({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      totalMarks: "",
      difficultyLevel: "",
      selectedQuestions: [],
      selectedStudents: [],
    });
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
              label: contestData.difficultyLevel.charAt(0) + contestData.difficultyLevel.slice(1).toLowerCase(),
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
        </FormControl>
        <Button mt={4} colorScheme="blue" type="submit">
          Create Contest
        </Button>
      </form>
    </Box>
  );
};

export default CreateContest;
