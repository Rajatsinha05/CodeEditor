import React from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
} from "@chakra-ui/react";
import { getCourse } from "../data/course";
import { getBranch } from "../data/branch";

const CreateStudentForm = ({ studentData, setStudentData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <VStack spacing={4} width="full">
      <FormControl id="name" isRequired>
        <FormLabel>Student Name</FormLabel>
        <Box>
          <Input
            type="text"
            id="name"
            value={studentData.name}
            onChange={handleChange}
          />
        </Box>
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Student Email</FormLabel>
        <Box>
          <Input
            type="email"
            id="email"
            value={studentData.email}
            onChange={handleChange}
          />
        </Box>
      </FormControl>

      <FormControl id="grid" isRequired>
        <FormLabel>Grid</FormLabel>
        <Box>
          <Input
            type="text"
            id="grid"
            value={studentData.grid}
            onChange={handleChange}
          />
        </Box>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password (min. 8 characters)</FormLabel>
        <Box>
          <Input
            type="password"
            id="password"
            value={studentData.password}
            onChange={handleChange}
          />
        </Box>
      </FormControl>

      <FormControl id="course" isRequired>
        <FormLabel>Course</FormLabel>
        <Box>
          <Select
            id="course"
            value={studentData.course}
            onChange={handleChange}
          >
            <option value="">Select Course</option>
            {getCourse().map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </Select>
        </Box>
      </FormControl>

      <FormControl id="branchCode" isRequired>
        <FormLabel>Branch Code</FormLabel>
        <Box>
          <Select
            id="branchCode"
            value={studentData.branchCode}
            onChange={handleChange}
          >
            <option value="">Select Branch Code</option>
            {getBranch().map((code, index) => (
              <option key={index} value={code}>
                {code}
              </option>
            ))}
          </Select>
        </Box>
      </FormControl>
    </VStack>
  );
};

export default CreateStudentForm;
