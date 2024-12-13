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

const BatchEditModal = ({ isOpen, onClose, batch }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Batch</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateBatchForm batch={batch} onClose={onClose} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BatchEditModal;
