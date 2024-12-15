import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  useColorModeValue,
  useColorMode,
  useTheme,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS

import ReactQuill from "react-quill";

import ExampleInputs from "../components/Problems/ExampleInputs";
import { formDataValidator } from "../components/Problems/formDataValidator";
import { postQuestion, updateQuestion } from "../redux/Question/questionApi";
import { Topics } from "../components/data/Dsa"; // Import the Topics function

import { showToast } from "../utils/toastUtils";
import { Languages } from "../components/data/Modules";
import ModuleSelector from "../components/Problems/ModuleSelector";

const AddQuestions = ({ isOpen, onClose, initialData, isEditing }) => {
  // Component logic
  const [selectedModules, setSelectedModules] = useState(
    Languages().map((language) => language.value)
  );

  useEffect(() => {
    if (initialData?.modules) {
      setSelectedModules(initialData.modules);
    }
  }, [initialData]);

  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.data);

  // Directly call the Topics function to get the array
  const dsaTopics = useMemo(() => Topics(), []);

  const initialFormData = useMemo(
    () => ({
      title: initialData?.title || "",
      description: initialData?.description || "",
      difficultLevel: initialData?.difficultLevel || "",
      input: initialData?.input || "",
      expectedOutput: initialData?.expectedOutput || "",
      sampleInput: initialData?.sampleInput || "", // Added sampleInput
      sampleExpectedOutput: initialData?.sampleExpectedOutput || "", // Added sampleExpectedOutput
      tag: initialData?.tag || "",
      userId: user?.id,
    }),
    [initialData, user?.id]
  );

  const [formData, setFormData] = useState(initialFormData);
  const [examples, setExamples] = useState([]);
  const [newExample, setNewExample] = useState({
    input: "",
    output: "",
    explanation: "",
  });
  const [errors, setErrors] = useState({});

  const textAreaRefs = {
    description: useRef(null),
    input: useRef(null),
    expectedOutput: useRef(null),
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // Update the formData state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Directly update the corresponding field
    }));

    // Clear errors for the current field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  }, []);

  useEffect(() => {
    const adjustTextareaHeight = (ref) => {
      if (ref.current) {
        ref.current.style.height = "auto";
        ref.current.style.height = ref.current.scrollHeight + "px";
      }
    };

    adjustTextareaHeight(textAreaRefs.description);
    adjustTextareaHeight(textAreaRefs.input);
    adjustTextareaHeight(textAreaRefs.expectedOutput);
  }, [formData]);

  // Update formData when initialData changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      title: initialData?.title || "",
      description: initialData?.description || "",
      difficultLevel: initialData?.difficultLevel || "",
      constraintValue: initialData?.constraintValue || "",
      input: initialData?.input || "",
      expectedOutput: initialData?.expectedOutput || "",
      sampleInput: initialData?.sampleInput || "", // Added sampleInput
      sampleExpectedOutput: initialData?.sampleExpectedOutput || "", // Added sampleExpectedOutput
      tag: initialData?.tag || "",
      userId: user?.id,
    }));
  }, [initialData, user?.id]);

  // Update examples when initialData changes
  useEffect(() => {
    if (initialData?.examples) {
      setExamples(initialData.examples);
    }
  }, [initialData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("form", formData, examples);

      // Clean input and expectedOutput fields by removing trailing spaces
      const cleanedFormData = {
        ...formData,
        input: formData.input
          .split("\n")
          .map((line) => line.trimEnd()) // Remove trailing spaces from each line
          .join("\n"),
        expectedOutput: formData.expectedOutput
          .split("\n")
          .map((line) => line.trimEnd()) // Remove trailing spaces from each line
          .join("\n"),
      };
      console.log("cleanedFormData", cleanedFormData);

      // Add new example if fields are non-empty
      if (
        newExample.input.trim() !== "" ||
        newExample.output.trim() !== "" ||
        newExample.explanation.trim() !== ""
      ) {
        setExamples((prevExamples) => [...prevExamples, newExample]);
        setNewExample({
          input: "",
          output: "",
          explanation: "",
        });
      }

      // Validate formData (use cleaned data)
      const validationErrors = formDataValidator(cleanedFormData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showToast(
          toast,
          `Failed to ${isEditing ? "Update" : "Add"} Question`,
          "error"
        );
        console.log("formData", cleanedFormData);
        return;
      }

      try {
        if (isEditing) {
          await dispatch(
            updateQuestion({
              questionId: initialData.id,
              data: {
                ...cleanedFormData,
                examples,
                modules: selectedModules,
              },
            })
          ).unwrap();
        } else {
          await dispatch(
            postQuestion({
              ...cleanedFormData,
              user: {
                id: user.id,
              },
              modules: selectedModules,
              examples,
            })
          ).unwrap();
        }

        // Reset form after submission
        setFormData(initialFormData);
        setExamples([]);
        showToast(
          toast,
          `Question ${isEditing ? "Updated" : "Added"}`,
          "success"
        );

        if (onClose) {
          onClose();
        }
      } catch (err) {
        showToast(
          toast,
          `Failed to ${isEditing ? "Update" : "Add"} Question`,
          "error"
        );
      }
    },
    [
      dispatch,
      formData,
      examples,
      initialFormData,
      toast,
      user?.id,
      isEditing,
      initialData?.id,
      onClose,
    ]
  );

  const theme = useTheme();
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const bgColor = isDarkMode ? theme.colors.gray[800] : theme.colors.gray[50];
  const textColor = isDarkMode
    ? theme.colors.whiteAlpha[900]
    : theme.colors.blackAlpha[900];
  const borderColor = isDarkMode ? "gray.600" : "gray.300";
  const boxShadowColor = isDarkMode
    ? "rgba(0, 0, 0, 0.4)"
    : "rgba(0, 0, 0, 0.1)";
  const buttonColor = isDarkMode ? "teal.400" : "red.400";

  return (
    <Box
      width={isEditing ? "100%" : "60%"}
      margin="5rem auto" // Centering the form on the screen
      p={8}
      bg={bgColor}
      borderRadius="lg"
      boxShadow={`0 4px 12px ${boxShadowColor}`} // Subtle shadow for better appearance
      border="1px solid"
      borderColor={borderColor}
    >
      {/* Form Title */}
      <Heading as="h2" size="lg" textAlign="center" color={textColor} mb={6}>
        {isEditing ? "Update Question" : "Add Question"}
      </Heading>

      <Divider mb={6} />

      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <FormControl mb={4} isInvalid={errors.title}>
          <FormLabel color={textColor}>Title</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            bg={bgColor}
            color={textColor}
            borderColor={borderColor}
            _hover={{ borderColor: buttonColor }}
          />
        </FormControl>

        {/* Description Field */}
        <FormControl mb={4} isInvalid={errors.description}>
          <FormLabel color={textColor}>Description</FormLabel>
          <ReactQuill
            value={formData.description}
            onChange={(value) =>
              handleChange({ target: { name: "description", value } })
            }
            theme="snow"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              border: "1px solid",
              borderColor: borderColor,
              borderRadius: "5px",
              minHeight: "150px",
            }}
          />
        </FormControl>

        {/* Difficulty Level */}
        <FormControl mb={4} isInvalid={errors.difficultLevel}>
          <FormLabel color={textColor}>Difficulty Level</FormLabel>
          <Select
            name="difficultLevel"
            value={formData.difficultLevel}
            onChange={handleChange}
            bg={bgColor}
            color={textColor}
            borderColor={borderColor}
            _hover={{ borderColor: buttonColor }}
          >
            <option value="">Select</option>
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </Select>
        </FormControl>

        {/* Module Selector */}
        <ModuleSelector
          selectedModules={selectedModules}
          setSelectedModules={setSelectedModules}
        />

        {/* Input Field */}
        <FormControl mb={4} isInvalid={errors.input}>
          <FormLabel color={textColor}>Input</FormLabel>
          <Textarea
            name="input"
            value={formData.input}
            onChange={handleChange} // Link updated handleChange
            placeholder="Enter input data"
            bg={bgColor}
            color={textColor}
            borderColor={borderColor}
            _hover={{ borderColor: buttonColor }}
            style={{
              resize: "vertical",
              whiteSpace: "pre-wrap", // Preserve line breaks and spaces visually
            }}
          />
        </FormControl>

        <FormControl mb={4} isInvalid={errors.expectedOutput}>
          <FormLabel color={textColor}>Expected Output</FormLabel>
          <Textarea
            name="expectedOutput"
            value={formData.expectedOutput}
            onChange={handleChange} // Link updated handleChange
            placeholder="Enter expected output"
            style={{
              minHeight: "100px",
              resize: "none",
              whiteSpace: "pre-wrap", // Preserve line breaks and spaces visually
            }}
            bg={useColorModeValue("gray.50", "gray.800")}
            color={textColor}
          />
        </FormControl>

        {/* Sample Input Field */}
        <FormControl mb={4} isInvalid={errors.sampleInput}>
          <FormLabel color={textColor}>Sample Input</FormLabel>
          <Textarea
            name="sampleInput"
            value={formData.sampleInput}
            onChange={handleChange}
            bg={bgColor}
            color={textColor}
            borderColor={borderColor}
            _hover={{ borderColor: buttonColor }}
            style={{ resize: "none" }}
          />
        </FormControl>

        {/* Sample Expected Output */}
        <FormControl mb={4} isInvalid={errors.sampleExpectedOutput}>
          <FormLabel color={textColor}>Sample Expected Output</FormLabel>
          <Textarea
            name="sampleExpectedOutput"
            value={formData.sampleExpectedOutput}
            onChange={handleChange}
            bg={bgColor}
            color={textColor}
            borderColor={borderColor}
            _hover={{ borderColor: buttonColor }}
            style={{ resize: "none" }}
          />
        </FormControl>

        {/* Tag Selector */}
        <FormControl mb={4} isInvalid={errors.tag}>
          <FormLabel color={textColor}>Tag</FormLabel>
          <Select
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            bg={bgColor}
            color={textColor}
            borderColor={borderColor}
            _hover={{ borderColor: buttonColor }}
          >
            <option value="">Select a topic</option>
            {Topics().map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Example Inputs */}
        <ExampleInputs
          examples={examples}
          newExample={newExample}
          setExamples={setExamples}
          setNewExample={setNewExample}
          toast={toast}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          width="100%"
          mt={6}
          bg={buttonColor}
          color="white"
          _hover={{ bg: isDarkMode ? "teal.500" : "red.500" }}
        >
          {isEditing ? "Update Question" : "Add Question"}
        </Button>
      </form>
    </Box>
  );
};

export default React.memo(AddQuestions);
