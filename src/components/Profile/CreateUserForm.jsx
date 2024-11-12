// CreateUserForm.js
import React, { useState, useEffect } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { getBranch } from "../data/branch";
import { getCourse } from "../data/course";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreateUserForm = ({ userData, setUserData }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const inputBgColor = useColorModeValue("white", "gray.700");
  const labelColor = useColorModeValue("red.600", "red.300");

  return (
    <VStack spacing={4} width="full">
      <FormControl isRequired>
        <FormLabel color={labelColor}>User Name</FormLabel>
        <Box>
          <Input
            type="text"
            name="name"
            value={userData.name || ""}
            onChange={handleChange}
            bg={inputBgColor}
          />
        </Box>
      </FormControl>

      <FormControl isRequired>
        <FormLabel color={labelColor}>User Email</FormLabel>
        <Box>
          <Input
            type="email"
            name="email"
            value={userData.email || ""}
            onChange={handleChange}
            bg={inputBgColor}
          />
        </Box>
      </FormControl>

      <FormControl isRequired>
        <FormLabel color={labelColor}>
          Password {userData.id ? "(Leave blank to keep current)" : "(min. 8 characters)"}
        </FormLabel>
        <Box>
          <Input
            type="password"
            name="password"
            value={userData.password || ""}
            onChange={handleChange}
            bg={inputBgColor}
            placeholder={userData.id ? "********" : ""}
          />
        </Box>
      </FormControl>

      <FormControl isRequired>
        <FormLabel color={labelColor}>Department (Course)</FormLabel>
        <Box>
          <Select
            name="department"
            value={userData.department || ""}
            onChange={handleChange}
            bg={inputBgColor}
          >
            <option value="">Select Department</option>
            {getCourse().map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </Select>
        </Box>
      </FormControl>

      <FormControl isRequired>
        <FormLabel color={labelColor}>Branch Code</FormLabel>
        <Box>
          <Select
            name="branchCode"
            value={userData.branchCode || ""}
            onChange={handleChange}
            bg={inputBgColor}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {validationMessage}
        </Alert>
      </Snackbar>
    </VStack>
  );
};

export default CreateUserForm;
