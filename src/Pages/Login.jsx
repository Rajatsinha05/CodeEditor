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
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/apiSlice";
import { useNavigate } from "react-router-dom";

const Login = ({ isOpen, onClosed }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { onOpen, onClose } = useDisclosure();
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

    await dispatch(login(formData));
  };
  let navigate = useNavigate();
  useEffect(() => {
    if (isLogin) {
      if (!toast.isActive("login-success")) {
      }

      // Clear form fields after successful login
      setFormData({
        email: "",
        password: "",
      });
      onClose();
      navigate("/");
    } else if (loginError) {
      if (!toast.isActive("login-error")) {
        toast({
          id: "login-error",
          title: "Login failed",
          description: "Please check your email and password",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
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
