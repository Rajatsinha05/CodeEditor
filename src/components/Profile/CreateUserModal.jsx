import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useColorModeValue,
  useToast,
  Grid,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { createUser } from "../../redux/apiSlice";
import CreateUserForm from "./CreateUserForm";

const CreateUserModal = ({ isOpen, onClose }) => {
  const [userData, setUserData] = React.useState({
    name: "",
    email: "",
    password: "",
    department: "",
    branchCode: "",
    role: "", // New field for role
  });
  const [loading, setLoading] = React.useState(false); // Loading state
  const dispatch = useDispatch();
  const toast = useToast();

  const modalBgColor = useColorModeValue("white", "gray.800");
  const headerTextColor = useColorModeValue("blue.600", "blue.300");
  const footerBgColor = useColorModeValue("gray.100", "gray.700");

  // Helper function to validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleCreate = async () => {
    // Validation logic
    if (
      !userData.name ||
      !userData.email ||
      !validateEmail(userData.email) ||
      userData.password.length < 8 ||
      !userData.department ||
      !userData.branchCode ||
      !userData.role
    ) {
      toast({
        title: "Validation Error",
        description: "Please correct the highlighted fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true); // Set loading to true when starting to create a user

    try {
      await dispatch(createUser(userData)).unwrap();
      toast({
        title: "User created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose(); // Close the modal after successful creation
    } catch (error) {
      if (error.response && error.response.data.message.includes("email already exists")) {
        toast({
          title: "Duplicate Entry",
          description: "A user with the same email already exists. Please use a different email.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred while creating the user. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      console.error("Error creating user:", error);
    } finally {
      setLoading(false); // Reset loading to false once operation completes
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent bg={modalBgColor}>
        <ModalHeader color={headerTextColor} textAlign="center">
          Create User
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateUserForm userData={userData} setUserData={setUserData} />
        </ModalBody>
        <ModalFooter bg={footerBgColor}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4} width="full">
            <Tooltip label="Create User" aria-label="Create User Tooltip">
              <Button
                colorScheme="blue"
                leftIcon={<FaPlusCircle />}
                onClick={handleCreate}
                isDisabled={loading} // Disable button while loading
              >
                {loading ? <Spinner size="sm" /> : "Create User"}
              </Button>
            </Tooltip>
            <Button variant="ghost" onClick={onClose} isDisabled={loading}>
              Cancel
            </Button>
          </Grid>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateUserModal;
