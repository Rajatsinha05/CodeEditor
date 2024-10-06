import React from "react";
import { VStack, FormControl, FormLabel, Input, Select, Box } from "@chakra-ui/react";
import "./css/CreateForm.css"; // Import CSS for shake effect if necessary

const CreateForm = ({ formType, studentData, setStudentData }) => {
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
        <FormLabel>{formType === "user" ? "User Name" : "Student Name"}</FormLabel>
        <Box>
          <Input type="text" id="name" value={studentData.name} onChange={handleChange} />
        </Box>
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>{formType === "user" ? "User Email" : "Student Email"}</FormLabel>
        <Box>
          <Input type="email" id="email" value={studentData.email} onChange={handleChange} />
        </Box>
      </FormControl>

      {formType === "student" && (
        <>
          <FormControl id="grid" isRequired>
            <FormLabel>Grid</FormLabel>
            <Box>
              <Input type="text" id="grid" value={studentData.grid} onChange={handleChange} />
            </Box>
          </FormControl>

          <FormControl id="branchCode" isRequired>
            <FormLabel>Branch Code</FormLabel>
            <Box>
              <Input type="text" id="branchCode" value={studentData.branchCode} onChange={handleChange} />
            </Box>
          </FormControl>

          <FormControl id="course" isRequired>
            <FormLabel>Course</FormLabel>
            <Box>
              <Select id="course" value={studentData.course} onChange={handleChange}>
                <option value="">Choose</option>
                <option value="full stack Developer">Full Stack Developer</option>
                <option value="frontend Developer">Frontend Developer</option>
                <option value="backend Developer">Backend Developer</option>
                <option value="android Developer">Android Developer</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
              </Select>
            </Box>
          </FormControl>
        </>
      )}

      <FormControl id="password" isRequired>
        <FormLabel>Password (min. 8 characters)</FormLabel>
        <Box>
          <Input type="password" id="password" value={studentData.password} onChange={handleChange} />
        </Box>
      </FormControl>
    </VStack>
  );
};

export default CreateForm;
