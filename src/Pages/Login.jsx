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
  });

  const toast = useToast();
  const { isLogin, loginError } = useSelector((store) => store.data);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    let isValid = true;

    if (!formData.email) {
      validationErrors.email = "Email is required";
      isValid = false;
    }
    if (!formData.password) {
      validationErrors.password = "Password is required";
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
      // onClose();
      navigate("/");
    } catch (error) {
      console.log("error: ", error);
      showToast(
        toast,
        error ? error : "An error occurred during login",
        "error"
      );
    }
  };

  useEffect(() => {
    if (isLogin) {
      setFormData({
        email: "",
        password: "",
      });
      // onClose();
      navigate("/");
    }
  }, [isLogin, navigate, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
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