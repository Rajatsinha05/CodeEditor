import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
// import { createStudent } from "../redux/actions/studentActions";

const ProfileForm = ({ isAdmin }) => {
  let createStudent = "";
  const toast = useToast();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    studentName: "",
    studentEmail: "",
    grid: "",
    branchCode: "",
    studentPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation for student creation
    if (
      isAdmin &&
      (formData.studentName === "" ||
        formData.studentEmail === "" ||
        formData.grid === "" ||
        formData.branchCode === "" ||
        formData.studentPassword === "")
    ) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Dispatch action to create user or student
      if (isAdmin) {
        dispatch(createStudent(formData));
      } else {
        // Dispatch action to create user
        // Example: dispatch(createUser(formData));
      }
      // Reset form data
      setFormData({
        username: "",
        email: "",
        password: "",
        studentName: "",
        studentEmail: "",
        grid: "",
        branchCode: "",
        studentPassword: "",
      });
      toast({
        title: isAdmin ? "Student created" : "User created",
        description: isAdmin
          ? "A new student has been created successfully."
          : "A new user has been created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack as="form" spacing={4} onSubmit={handleSubmit}>
      {isAdmin && (
        <>
          <FormControl id="studentName" isRequired>
            <FormLabel>Student Name</FormLabel>
            <Input
              type="text"
              id="studentName"
              value={formData.studentName}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="studentEmail" isRequired>
            <FormLabel>Student Email</FormLabel>
            <Input
              type="email"
              id="studentEmail"
              value={formData.studentEmail}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="grid" isRequired>
            <FormLabel>Grid</FormLabel>
            <Input
              type="text"
              id="grid"
              value={formData.grid}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="branchCode" isRequired>
            <FormLabel>Branch Code</FormLabel>
            <Input
              type="text"
              id="branchCode"
              value={formData.branchCode}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="studentPassword" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              id="studentPassword"
              value={formData.studentPassword}
              onChange={handleChange}
            />
          </FormControl>
        </>
      )}
      {!isAdmin && (
        <>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormControl>
        </>
      )}
      <Button type="submit" colorScheme="blue" w="full">
        {isAdmin ? "Create Student" : "Create User"}
      </Button>
    </VStack>
  );
};

export default ProfileForm;
