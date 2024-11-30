import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  Button,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { getCourse } from "../data/course";
import { getBranch } from "../data/branch";

const CreateUserForm = ({ userData = {}, setUserData, isSubmitting, apiError }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const inputBgColor = useColorModeValue("gray.100", "gray.800");
  const labelColor = useColorModeValue("teal.700", "teal.300");

  const renderErrorMessage = (field) =>
    errors[field] && (
      <Text color="red.500" fontSize="sm">
        {errors[field]}
      </Text>
    );

  return (
    <Box maxWidth="500px" mx="auto" p={4}>
      <VStack spacing={4} width="full">
        {/* Display API error message */}
        {apiError && (
          <Text color="red.500" fontSize="sm" mb={4}>
            {apiError}
          </Text>
        )}

        <FormControl isRequired isDisabled={isSubmitting}>
          <FormLabel color={labelColor}>User Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={userData.name || ""}
            onChange={handleChange}
            bg={inputBgColor}
            isInvalid={!!errors.name}
          />
          {renderErrorMessage("name")}
        </FormControl>

        <FormControl isRequired isDisabled={isSubmitting}>
          <FormLabel color={labelColor}>User Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={userData.email || ""}
            onChange={handleChange}
            bg={inputBgColor}
            isInvalid={!!errors.email}
          />
          {renderErrorMessage("email")}
        </FormControl>

        <FormControl isDisabled={isSubmitting}>
          <FormLabel color={labelColor}>
            Password{" "}
            {userData.id
              ? "(Leave blank to keep current)"
              : "(min. 8 characters)"}
          </FormLabel>
          <Input
            type="password"
            name="password"
            value={userData.password || ""}
            onChange={handleChange}
            bg={inputBgColor}
            placeholder={userData.id ? "********" : ""}
            isInvalid={!!errors.password}
          />
          {renderErrorMessage("password")}
        </FormControl>

        <FormControl isRequired isDisabled={isSubmitting}>
          <FormLabel color={labelColor}>Department (Course)</FormLabel>
          <Select
            name="department"
            value={userData.department || ""}
            onChange={handleChange}
            bg={inputBgColor}
            isInvalid={!!errors.department}
          >
            <option value="">Select Department</option>
            {getCourse().map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </Select>
          {renderErrorMessage("department")}
        </FormControl>

        <FormControl isRequired isDisabled={isSubmitting}>
          <FormLabel color={labelColor}>Branch Code</FormLabel>
          <Select
            name="branchCode"
            value={userData.branchCode || ""}
            onChange={handleChange}
            bg={inputBgColor}
            isInvalid={!!errors.branchCode}
          >
            <option value="">Select Branch Code</option>
            {getBranch().map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </Select>
          {renderErrorMessage("branchCode")}
        </FormControl>
      </VStack>
    </Box>
  );
};

export default CreateUserForm;
