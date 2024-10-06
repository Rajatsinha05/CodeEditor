import React from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
} from "@chakra-ui/react";

const CreateUserForm = ({ userData, setUserData }) => {
  const departmentOptions = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Android Developer",
    "C Programming",
    "C++ Programming",
    "Data Science",
    "DevOps",
    "UI/UX Design",
    "Project Management",
  ];

  const branchCodeOptions = [
    "rw1",
    "rw2",
    "rw3",
    "rw4",
    "rw5",
    "rw6",
    "rw7",
    "rw8",
  ];

  // Update role options to match backend Enum values
  const roleOptions = ["STUDENT", "ADMIN", "EMPLOYEE"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <VStack spacing={4} width="full">
      <FormControl isRequired>
        <FormLabel>User Name</FormLabel>
        <Box>
          <Input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
        </Box>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>User Email</FormLabel>
        <Box>
          <Input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </Box>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password (min. 8 characters)</FormLabel>
        <Box>
          <Input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </Box>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Department (Course)</FormLabel>
        <Box>
          <Select
            name="department"
            value={userData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departmentOptions.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </Select>
        </Box>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Branch Code</FormLabel>
        <Box>
          <Select
            name="branchCode"
            value={userData.branchCode}
            onChange={handleChange}
          >
            <option value="">Select Branch Code</option>
            {branchCodeOptions.map((code, index) => (
              <option key={index} value={code}>
                {code}
              </option>
            ))}
          </Select>
        </Box>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>User Role</FormLabel>
        <Box>
          <Select name="role" value={userData.role} onChange={handleChange}>
            <option value="">Select Role</option>
            {roleOptions.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </Select>
        </Box>
      </FormControl>
    </VStack>
  );
};

export default CreateUserForm;
