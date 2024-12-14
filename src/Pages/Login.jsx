import React, { useState, useEffect } from "react";
import {
  Box,
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
  useColorModeValue,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/apiSlice";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toastUtils";

const Login = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    server: "",
  });

  const toast = useToast();
  const { isLogin } = useSelector((store) => store.data);
  const navigate = useNavigate();

  // Theme colors
  const modalBg = useColorModeValue("white", "gray.800");
  const modalHeaderColor = useColorModeValue("teal.600", "teal.300");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const inputFocusBorderColor = useColorModeValue("teal.500", "teal.300");
  const buttonBg = useColorModeValue("red.400", "teal.400");
  const buttonHoverBg = useColorModeValue("red.500", "teal.500");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
      server: "", // Reset server error when user interacts
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    let isValid = true;

    if (!formData.email) {
      validationErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password) {
      validationErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 7) {
      validationErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await dispatch(login(formData)).unwrap(); // Unwraps the Redux promise
      showToast(toast, "Login successful", "success");
      setFormData({ email: "", password: "" });
      navigate("/");
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        server: error || "An error occurred during login",
      }));
      showToast(toast, error || "An error occurred during login", "error");
    }
  };

  useEffect(() => {
    if (isLogin) {
      setFormData({
        email: "",
        password: "",
      });
      navigate("/");
    }
  }, [isLogin, navigate]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent bg={modalBg} borderRadius="lg" boxShadow="lg">
        <ModalHeader
          textAlign="center"
          fontSize="2xl"
          fontWeight="bold"
          color={modalHeaderColor}
        >
          Welcome Back
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={5}>
            {errors.server && (
              <Text color="red.500" fontSize="sm" textAlign="center">
                {errors.server}
              </Text>
            )}
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <FormControl mb={4} isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  bg={inputBg}
                  focusBorderColor={inputFocusBorderColor}
                  borderRadius="md"
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
                  bg={inputBg}
                  focusBorderColor={inputFocusBorderColor}
                  borderRadius="md"
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              <Button
                type="submit"
                w="100%"
                bg={buttonBg}
                _hover={{ bg: buttonHoverBg }}
                color="white"
                borderRadius="md"
                size="lg"
              >
                Login
              </Button>
            </form>
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            variant="ghost"
            onClick={onClose}
            fontSize="sm"
            colorScheme="gray"
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(Login);
