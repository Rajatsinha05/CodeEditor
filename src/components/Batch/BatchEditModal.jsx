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
  useToast,
} from "@chakra-ui/react";
import CreateBatchForm from "../../Pages/CreateBatch";

const BatchEditModal = ({ isOpen, onClose, batch = {} }) => {
  const toast = useToast();

  const handleCancel = () => {
    toast({
      title: "Edit Cancelled",
      description: "Batch editing has been cancelled.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} aria-label="Edit Batch Modal">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Batch</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateBatchForm batch={batch} onClose={onClose} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={handleCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BatchEditModal;
