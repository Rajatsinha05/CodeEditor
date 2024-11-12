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

const CreateUserModal = ({ isOpen, onClose, refreshUsers, userData, mode }) => {
  console.log(
    "isOpen, onClose, refreshUsers, userData, mode: ",
    isOpen,
    onClose,
    refreshUsers,
    userData,
    mode
  );
  const [formData, setFormData] = useState(userData || {});
  const dispatch = useDispatch();
  const toast = useToast();
  const modalBgColor = useColorModeValue("white", "gray.800");
  const headerColor = useColorModeValue("red.600", "red.400");

  useEffect(() => {
    setFormData(userData || {});
  }, [userData]);

  const handleSave = async () => {
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
        await dispatch(updateUser(formData)).unwrap();
        toast({
          title: "User updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
      onClose();
      refreshUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
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
          <CreateUserForm userData={formData} setUserData={setFormData} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={handleSave}>
            {mode === "Create" ? "Create" : "Save Changes"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateUserModal;
