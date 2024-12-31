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
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import ReactSelect from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { saveBatch, updateBatch } from "../redux/Batch/batchSlice";
import { Languages, modules } from "../components/data/Modules";

const CreateBatchForm = ({ batch = null, onClose }) => {
  console.log("batch: ", batch);
  const dispatch = useDispatch();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const user = useSelector((store) => store.data.user);

  const isEditing = !!batch;
  const initialFormData = batch
    ? {
        batchNameInput: batch.name.split("-")[0] || "",
        time: batch.name.split("-")[2] || "",
        module: batch.module || "",
        branchCode: batch.branchCode,
        status: batch.status,
      }
    : {
        batchNameInput: "",
        time: "",
        module: "",
        branchCode: user?.branchCode || "All branches",
        status: "ACTIVE",
      };

  const [formData, setFormData] = useState(initialFormData);
  const [finalTitle, setFinalTitle] = useState("");

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const formBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const buttonColor = useColorModeValue("red.400", "teal.400");
  const hoverButtonColor = useColorModeValue("red.500", "teal.500");

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: formBgColor,
      color: textColor,
      borderColor: borderColor,
      "&:hover": { borderColor: hoverButtonColor },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? buttonColor
        : state.isFocused
        ? hoverButtonColor
        : formBgColor,
      color: textColor,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: textColor,
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: formBgColor,
    }),
  };

  useEffect(() => {
    const module = formData.module || "";
    const batchName = formData.batchNameInput.trim();
    const time = formData.time.trim();
    const title =
      batchName && module && time
        ? `${batchName}-${module}-${time}`.toUpperCase()
        : "";
    setFinalTitle(title);
  }, [formData.module, formData.batchNameInput, formData.time]);

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

  const handleModuleSelect = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      module: selectedOption.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.batchNameInput || !formData.time || !formData.module) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      id: batch?.id || undefined,
      name: finalTitle,
      module: formData.module,
      branchCode: formData.branchCode,
      status: formData.status,
      createdById: user.id,
      studentIds: [],
    };

    try {
      if (isEditing) {
        await dispatch(updateBatch(payload)).unwrap();
        toast({
          title: "Success",
          description: "Batch updated successfully!",
          status: "success",
        });
        onClose();
      } else {
        await dispatch(saveBatch(payload)).unwrap();
        toast({
          title: "Success",
          description: "Batch created successfully!",
          status: "success",
        });
        setFormData(initialFormData);
        setFinalTitle("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to save batch",
        status: "error",
      });
    }
  };

  const allModules = [...Languages(), ...modules()];

  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = 8 + i;
    const isPM = hour >= 12;
    const adjustedHour = hour > 12 ? hour - 12 : hour;
    return {
      value: `${adjustedHour}:00 ${isPM ? "PM" : "AM"}`,
      label: `${adjustedHour}:00 ${isPM ? "PM" : "AM"}`,
    };
  });

  return (
    <Box
      bg={bgColor}
      p={6}
      rounded="lg"
      shadow="lg"
      maxW="lg"
      mx="auto"
      mt={10}
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel fontWeight="bold">Batch Name</FormLabel>
            <Input
              name="batchNameInput"
              placeholder="Enter batch name"
              value={formData.batchNameInput}
              onChange={handleInputChange}
              bg={formBgColor}
              color={textColor}
              border={`1px solid ${borderColor}`}
              _hover={{ borderColor: hoverButtonColor }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="bold">Module</FormLabel>
            <ReactSelect
              options={allModules}
              styles={customSelectStyles}
              onChange={handleModuleSelect}
              value={allModules.find((mod) => mod.value === formData.module)}
              placeholder="Select module"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="bold">Batch Time</FormLabel>
            <ReactSelect
              options={timeOptions}
              styles={customSelectStyles}
              onChange={handleTimeSelect}
              value={timeOptions.find((time) => time.value === formData.time)}
              placeholder="Select time"
            />
          </FormControl>

          {finalTitle && (
            <Box
              bg={formBgColor}
              p={4}
              rounded="md"
              shadow="md"
              visibility={finalTitle ? "visible" : "hidden"}
            >
              <Text fontWeight="bold" textAlign="center" color={textColor}>
                {finalTitle}
              </Text>
            </Box>
          )}

          <Button
            type="submit"
            colorScheme="teal"
            bg={buttonColor}
            color="white"
            _hover={{ bg: hoverButtonColor }}
          >
            {isEditing ? "Update Batch" : "Create Batch"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateBatchForm;
