import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Center,
} from "@chakra-ui/react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleSubmit = (e) => {
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

    // Perform login logic (e.g., send data to backend)
    console.log("Login successful:", formData);

    // Show success toast
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
  };

  useEffect(()=>{
    onOpen()
  },[])
  return (
    <>
     {!isOpen ? <Button onClick={onOpen} >Login</Button> :null}
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
    </>
  );
};

export default Login;
