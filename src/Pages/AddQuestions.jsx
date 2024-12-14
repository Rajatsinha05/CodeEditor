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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS

import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import ReactSelect from "react-select";
import ExampleInputs from "../components/Problems/ExampleInputs";
import { formDataValidator } from "../components/Problems/formDataValidator";
import { postQuestion, updateQuestion } from "../redux/Question/questionApi";
import { Topics } from "../components/data/Dsa"; // Import the Topics function
import { generateLongIdFromUUID } from "../utils/idHelper";
import { showToast } from "../utils/toastUtils";
import { Languages } from "../components/data/Modules";
import ModuleSelector from "../components/Problems/ModuleSelector";

const AddQuestions = ({ isOpen, onClose, initialData, isEditing }) => {
  // Component logic
  const [selectedModules, setSelectedModules] = useState(
    Languages().map((language) => language.value)
  );

  // Handle module selection
  const handleModuleSelect = (selectedOptions) => {
    setSelectedModules(selectedOptions.map((option) => option.value));
  };

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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error if the user starts typing after an error
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  }, []);

  const handleTagChange = useCallback((e) => {
    const { value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      tag: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      tag: false,
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

      if (
        newExample.input.trim() !== "" ||
        newExample.output.trim() !== "" ||
        newExample.explanation.trim() !== ""
      ) {
        // Add the newExample to examples array

        setExamples((prevExamples) => [...prevExamples, newExample]);
        // Reset newExample
        setNewExample({
          input: "",
          output: "",
          explanation: "",
        });
      }

      const validationErrors = formDataValidator(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showToast(
          toast,
          `Failed to ${isEditing ? "Update" : "Add"} Question`,
          "error"
        );
        console.log("formData", formData);

        return;
      }

      try {
        if (isEditing) {
          await dispatch(
            updateQuestion({
              questionId: initialData.id,
              data: {
                ...formData,
                examples,
                modules: selectedModules,
              },
            })
          ).unwrap();
        } else {
          await dispatch(
            postQuestion({
              ...formData,
              user: {
                id: user.id,
              },
              modules: selectedModules,
              examples,
            })
          ).unwrap();
        }

        setFormData(initialFormData);
        setExamples([]);
        showToast(
          toast,
          `Question ${isEditing ? "Updated" : "Added"}`,
          "success"
        );

        if (onClose) {
          onClose();
        } // Close the modal after submission
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
  // Adjusted for better visibility
  const formLabelColor = useColorModeValue("teal.700", "teal.300"); // Adjusted for better contrast
  const inputBgColor = useColorModeValue("gray.100", "gray.700");
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
    <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="xl">
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <FormControl mb={4} isInvalid={errors.title}>
          <FormLabel color={textColor}>Title</FormLabel>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            bg={inputBgColor}
            color={textColor}
          />
        </FormControl>

        {/* Description Field with Rich Text Editor */}
        <FormControl mb={4} isInvalid={errors?.description}>
          <FormLabel color={textColor}>Description</FormLabel>
          <ReactQuill
            value={formData.description}
            onChange={(value) =>
              handleChange({ target: { name: "description", value } })
            }
            theme="snow"
            style={{
              backgroundColor: inputBgColor,
              color: textColor,
              border: "1px solid",
              borderColor: useColorModeValue("gray.300", "gray.600"),
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
            bg={inputBgColor}
            color={textColor}
          >
            <option value="">Select</option>
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </Select>
        </FormControl>
        <ModuleSelector
          selectedModules={selectedModules}
          setSelectedModules={setSelectedModules}
          customSelectStyles={customSelectStyles}
        />
        {/* Input */}
        <FormControl mb={4} isInvalid={errors.input}>
          <FormLabel color={textColor}>Input</FormLabel>
          <Textarea
            name="input"
            value={formData.input}
            onChange={handleChange}
            ref={textAreaRefs.input}
            style={{ minHeight: "100px", resize: "none" }}
            bg={inputBgColor}
            color={textColor}
          />
        </FormControl>

        {/* Expected Output */}
        <FormControl mb={4} isInvalid={errors.expectedOutput}>
          <FormLabel color={textColor}>Expected Output</FormLabel>
          <Textarea
            name="expectedOutput"
            value={formData.expectedOutput}
            onChange={handleChange}
            ref={textAreaRefs.expectedOutput}
            style={{ minHeight: "100px", resize: "none" }}
            bg={inputBgColor}
            color={textColor}
          />
        </FormControl>

        {/* Tag Field */}
        <FormControl mb={4} isInvalid={errors.tag}>
          <FormLabel color={textColor}>Tag (Select a Topic)</FormLabel>
          <Select
            name="tag"
            value={formData.tag}
            onChange={handleTagChange}
            bg={inputBgColor}
            color={textColor}
          >
            <option value="">Select a topic</option>
            {dsaTopics.map((topic) => (
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
        <Button type="submit" colorScheme="teal" mt={4}>
          {isEditing ? "Update" : "Submit"}
        </Button>
      </form>
    </Box>
  );
};

export default React.memo(AddQuestions);
