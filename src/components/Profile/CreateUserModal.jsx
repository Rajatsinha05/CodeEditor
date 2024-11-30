import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import CreateUserForm from "./CreateUserForm";
import { createUser, updateUser } from "../../redux/User/userApi";

const CreateUserModal = ({
  isOpen,
  onClose,
  refreshUsers,
  userData,
  mode = "Create",
}) => {
  const [formData, setFormData] = useState(userData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null); // Track API errors
  const dispatch = useDispatch();
  const toast = useToast();
  const modalBgColor = useColorModeValue("white", "gray.800");
  const headerColor = useColorModeValue("teal.600", "teal.400");

  useEffect(() => {
    setFormData(userData || {});
    setApiError(null); // Reset error on open
  }, [userData]);

  const handleSave = async () => {
    setIsSubmitting(true);
    setApiError(null); // Clear previous errors
    try {
      if (mode === "Create") {
        await dispatch(createUser(formData)).unwrap();
        toast({
          title: "User created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        await dispatch(
          updateUser({ id: formData.id, userData: formData })
        ).unwrap();
        toast({
          title: "User updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
      onClose();
      if (refreshUsers) refreshUsers();
    } catch (error) {
      

      setApiError(error || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg={modalBgColor}>
        <ModalHeader color={headerColor}>
          {mode === "Create" ? "Create User" : "Update User"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateUserForm
            userData={formData}
            setUserData={setFormData}
            isSubmitting={isSubmitting}
            apiError={apiError} // Pass API error to the form
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            onClick={handleSave}
            isLoading={isSubmitting}
            loadingText={mode === "Create" ? "Creating" : "Saving"}
          >
            {mode === "Create" ? "Create" : "Save Changes"}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            ml={3}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateUserModal;
