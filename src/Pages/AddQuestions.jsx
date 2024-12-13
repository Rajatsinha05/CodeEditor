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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS

import ReactQuill from "react-quill";
import DOMPurify from "dompurify";

import ExampleInputs from "../components/Problems/ExampleInputs";
import { formDataValidator } from "../components/Problems/formDataValidator";
import { postQuestion, updateQuestion } from "../redux/Question/questionApi";
import { Topics } from "../components/data/Dsa"; // Import the Topics function
import { generateLongIdFromUUID } from "../utils/idHelper";
import { showToast } from "../utils/toastUtils";

const AddQuestions = ({ isOpen, onClose, initialData, isEditing }) => {
  // Component logic

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

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "gray.100"); // Adjusted for better visibility
  const formLabelColor = useColorModeValue("teal.700", "teal.300"); // Adjusted for better contrast
  const inputBgColor = useColorModeValue("gray.100", "gray.700"); // Background for inputs

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="xl">
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <FormControl mb={4} isInvalid={errors.title}>
          <FormLabel color={formLabelColor}>Title</FormLabel>
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
          <FormLabel color={formLabelColor}>Description</FormLabel>
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
          <FormLabel color={formLabelColor}>Difficulty Level</FormLabel>
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

        {/* Input */}
        <FormControl mb={4} isInvalid={errors.input}>
          <FormLabel color={formLabelColor}>Input</FormLabel>
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
          <FormLabel color={formLabelColor}>Expected Output</FormLabel>
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
          <FormLabel color={formLabelColor}>Tag (Select a Topic)</FormLabel>
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
