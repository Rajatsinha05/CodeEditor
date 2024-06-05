import React, { useState } from "react";
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

const CreateContest = ({ onCreate }) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const bgColor = theme.colors[colorMode].background;
  console.log("bgColor: ", bgColor);
  const textColor = theme.colors[colorMode].text;
  console.log("textColor: ", textColor);
  const primaryColor = theme.colors[colorMode].primary;
  const secondaryColor = theme.colors[colorMode].secondary;
  console.log("primaryColor: ", primaryColor);
  const borderColor = theme.colors[colorMode].text;
  const placeholderColor = theme.colors[colorMode].primary;

  const [contestData, setContestData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    totalMarks: "",
    difficultyLevel: "",
    selectedQuestions: [],
    selectedStudents: [],
    studentsList: [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Mike Johnson" },
    ],
    questionsList: [
      { id: 1, title: "Question 1" },
      { id: 2, title: "Question 2" },
      { id: 3, title: "Question 3" },
    ],
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(contestData);
    // Reset form data after submission
    setContestData({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      totalMarks: "",
      difficultyLevel: "",
      selectedQuestions: [],
      selectedStudents: [],
      studentsList: [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "Mike Johnson" },
      ],
      questionsList: [
        { id: 1, title: "Question 1" },
        { id: 2, title: "Question 2" },
        { id: 3, title: "Question 3" },
      ],
    });
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
            bg={colorMode === "dark" ? "transparent" : primaryColor}
            color="black" // Change text color here
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
            bg={colorMode === "dark" ? "transparent" : primaryColor}
            color="black" // Change text color here
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
            bg={colorMode === "dark" ? "transparent" : primaryColor}
            color="black" // Change text color here
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
            bg={colorMode === "dark" ? "transparent" : primaryColor}
            color="black" // Change text color here
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
            bg={colorMode === "dark" ? "transparent" : primaryColor}
            color="black" // Change text color here
            border={`1px solid ${borderColor}`}
            _placeholder={{ color: placeholderColor }}
          />
        </FormControl>
        <FormControl id="difficultyLevel" mt={4}>
          <FormLabel color={textColor}>Difficulty Level</FormLabel>
          <Select
            name="difficultyLevel"
            value={contestData.difficultyLevel}
            onChange={(value) =>
              setContestData({ ...contestData, difficultyLevel: value })
            }
            options={[
              { value: "EASY", label: "Easy" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HARD", label: "Hard" },
            ]}
            bg={bgColor}
            color={textColor}
            borderColor={borderColor}
            placeholderTextColor={placeholderColor}
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: bgColor,
                color: textColor,
                borderColor: borderColor,
              }),
              placeholder: (provided, state) => ({
                ...provided,
                color: placeholderColor,
              }),
            }}
          />
        </FormControl>
        <FormControl id="selectedQuestions" mt={4}>
          <FormLabel color={textColor}>Select Questions</FormLabel>
          <Select
            options={contestData.questionsList.map((question) => ({
              value: question.id,
              label: question.title,
            }))}
            onChange={handleSelectQuestions}
            isMulti
            closeMenuOnSelect={false}
            bg={bgColor}
            color={textColor}
            borderColor={borderColor}
            placeholderTextColor={placeholderColor}
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: bgColor,
                color: textColor,
                borderColor: borderColor,
              }),
              placeholder: (provided, state) => ({
                ...provided,
                color: placeholderColor,
              }),
            }}
          />
        </FormControl>
        <FormControl id="selectedStudents" mt={4}>
          <FormLabel color={textColor}>Select Students</FormLabel>
          <Select
            options={contestData.studentsList.map((student) => ({
              value: student.id,
              label: student.name,
            }))}
            onChange={handleSelectStudents}
            isMulti
            closeMenuOnSelect={false}
            bg={bgColor}
            color={textColor}
            borderColor={borderColor}
            placeholderTextColor={placeholderColor}
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: bgColor,
                color: secondaryColor,
                borderColor: borderColor,
              }),
              placeholder: (provided, state) => ({
                ...provided,
                color: placeholderColor,
              }),
            }}
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
