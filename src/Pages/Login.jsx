import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/apiSlice";

const Login = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const toast = useToast();
  const { isLogin, loginError } = useSelector((store) => store.data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error if the user starts typing after an error
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const validationErrors = {};
    let isValid = true;

    // Email validation
    if (!formData.email) {
      validationErrors.email = "Email is required";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      validationErrors.password = "Password is required";
      isValid = false;
    }

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    console.log("islogin before", isLogin);
    await dispatch(login(formData));
    console.log("islogin after", isLogin);
  };

  useEffect(() => {
    if (isLogin) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${formData.email.split("@")[0]}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Clear form fields after successful login
      setFormData({
        email: "",
        password: "",
      });

      // Close the modal
      onClose();
    } else if (loginError) {
      toast({
        title: "Login failed",
        description: "Please check your email and password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isLogin, loginError, toast, formData.email, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent borderRadius="xl">
        <ModalHeader textAlign="center">Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl mb={4} isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl mb={4} isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="blue" w="100%">
              Login
            </Button>
          </form>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Login;
