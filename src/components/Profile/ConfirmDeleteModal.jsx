import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

const ConfirmDeleteModal = ({ isOpen, onClose, confirmAction }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Confirm Delete</ModalHeader>
      <ModalBody>
        <Text>Are you sure you want to delete this user?</Text>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="red" onClick={confirmAction}>
          Delete
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default React.memo(ConfirmDeleteModal);
