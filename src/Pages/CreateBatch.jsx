import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  VStack,
  useColorMode,
  useTheme,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import ReactSelect from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { saveBatch, updateBatch } from "../redux/Batch/batchSlice";
import { getStudents } from "../redux/apiSlice";
import { showToast } from "../utils/toastUtils";

const CreateBatchForm = ({ batch = null, onClose }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const user = useSelector((store) => store.data.user);
  const { students } = useSelector((store) => store.data);

  const isEditing = !!batch;
  const initialFormData = batch
    ? {
        batchNameInput: batch.name.split("-")[1] || "",
        time: batch.name.split("-")[2] || "",
        branchCode: batch.branchCode,
        status: batch.status,
        studentIds: batch.studentIds || [],
      }
    : {
        batchNameInput: "",
        time: "",
        branchCode: user?.branchCode || "All branches",
        status: "ACTIVE",
        studentIds: [],
      };

  const [formData, setFormData] = useState(initialFormData);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [finalBatchName, setFinalBatchName] = useState("");

  // Colors
  const isDarkMode = colorMode === "dark";
  const bgColor = isDarkMode ? theme.colors.gray[800] : theme.colors.gray[100];
  const textColor = isDarkMode
    ? theme.colors.whiteAlpha[900]
    : theme.colors.blackAlpha[900];
  const borderColor = isDarkMode
    ? theme.colors.whiteAlpha[300]
    : theme.colors.blackAlpha[300];
  const primaryColor = useColorModeValue("red.400", "teal.400");
  const hoverBgColor = useColorModeValue("gray.200", "gray.600");

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: bgColor,
      color: textColor,
      borderColor: borderColor,
      padding: "6px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? primaryColor
        : state.isFocused
        ? hoverBgColor
        : bgColor,
      color: state.isSelected || state.isFocused ? "white" : textColor,
      cursor: "pointer",
      transition: "background-color 0.2s ease",
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
  };

  useEffect(() => {
    if (students.length === 0) {
      dispatch(getStudents());
    }
  }, [dispatch]);

  useEffect(() => {
    if (students) {
      setFilteredStudents(
        students.map((student) => ({
          value: student.id,
          label: `${student.name} - ${student.grid} - ${student.course} - ${student.branchCode}`,
        }))
      );
    }
  }, [students]);

  useEffect(() => {
    const userName = user?.name?.split(" ")[0] || "User";
    const batchName = formData.batchNameInput.trim();
    const time = formData.time.trim();
    const formattedBatchName = `${userName}-${batchName}-${time}`;
    setFinalBatchName(formattedBatchName);
  }, [formData.batchNameInput, formData.time, user]);

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 20; hour++) {
      const time12Hour = `${hour > 12 ? hour - 12 : hour}:00 ${
        hour >= 12 ? "PM" : "AM"
      }`;
      options.push({ value: time12Hour, label: time12Hour });
    }
    return options;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeSelect = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      time: selectedOption.value,
    }));
  };

  const handleStudentSelect = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      studentIds: selectedOptions.map((option) => option.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.batchNameInput ||
      !formData.time ||
      formData.studentIds.length === 0
    ) {
      showToast(toast, "Missing Information", "warning");
      return;
    }

    const payload = {
      id: batch?.id || undefined,
      name: finalBatchName,
      branchCode: formData.branchCode,
      status: formData.status,
      studentIds: formData.studentIds,
      createdById: user.id,
      contestIds: batch?.contestIds || [],
      createdAt: batch?.createdAt,
    };

    if (onClose) {
      try {
        dispatch(updateBatch(payload)).unwrap();
        showToast(toast, "Batch updated Successfully", "success");
      } catch (error) {
        showToast(toast, "Error updating batch", "error");
      }
      onClose();
    } else {
      try {
        const response = await dispatch(saveBatch(payload)).unwrap();
        showToast(toast, "Batch Created Successfully", "success");
        setFormData(initialFormData);
        setFinalBatchName("");
      } catch (error) {
        showToast(toast, "Error creating batch", "error");
      }
    }
  };

  return (
    <Box
      bg={bgColor}
      p={[6, 8]}
      rounded="lg"
      shadow="lg"
      maxW={["90%", "600px"]}
      mx="auto"
      mt={10} // Added margin from the top
      color={textColor}
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={[4, 6]} align="stretch">
          <FormControl id="batchNameInput" isRequired>
            <FormLabel fontWeight="bold">Enter Batch Name</FormLabel>
            <Input
              type="text"
              name="batchNameInput"
              value={formData.batchNameInput}
              onChange={handleInputChange}
              placeholder="Enter batch name"
              bg={bgColor}
              color={textColor}
              border={`1px solid ${borderColor}`}
              p={4} // Added padding
              rounded="md"
            />
          </FormControl>

          <FormControl id="time" isRequired>
            <FormLabel fontWeight="bold">Select Batch Time</FormLabel>
            <ReactSelect
              options={generateTimeOptions()}
              styles={customSelectStyles}
              onChange={handleTimeSelect}
              value={generateTimeOptions().find(
                (option) => option.value === formData.time
              )}
              placeholder="Select batch time"
            />
          </FormControl>

          <FormControl id="students" isRequired>
            <FormLabel fontWeight="bold">Select Students</FormLabel>
            <ReactSelect
              options={filteredStudents}
              isMulti
              closeMenuOnSelect={false}
              styles={customSelectStyles}
              onChange={handleStudentSelect}
              value={filteredStudents.filter((student) =>
                formData.studentIds.includes(student.value)
              )}
              placeholder="Search and select students"
            />
          </FormControl>

          {formData.batchNameInput.length > 0 ? (
            <Box
              bg={isDarkMode ? "gray.700" : "gray.50"}
              p={[3, 4]}
              rounded="md"
              shadow="inner"
            >
              <Text fontWeight="bold" fontSize={["md", "lg"]}>
                Batch Name:
              </Text>
              <Text fontSize={["sm", "md"]}>
                {formData.batchNameInput.length > 0
                  ? finalBatchName
                  : "Your batch name will appear here."}
              </Text>
            </Box>
          ) : null}

          <Button
            type="submit"
            colorScheme="teal"
            bg={primaryColor}
            _hover={{ bg: useColorModeValue("red.500", "teal.500") }}
            color="white"
            width="full"
            py={6} // Added vertical padding for larger button
          >
            {isEditing ? "Update Batch" : "Create Batch"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateBatchForm;
