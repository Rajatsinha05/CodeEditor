import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  Flex,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import {
  createCertificate,
  updateCertificate,
} from "../../../redux/Student/CertificateApi";
import { showToast } from "../../../utils/toastUtils";

const CertificatesModal = ({
  isOpen,
  onClose,
  certificate,
  onSave,
  studentId,
}) => {
  const [formData, setFormData] = useState({
    id: certificate?.id || null,
    title: "",
    institution: "",
    dateIssued: "",
    link: "",
  });

  const inputBgColor = useColorModeValue("white", "gray.800");
  const inputTextColor = useColorModeValue("gray.800", "white");
  const modalBgColor = useColorModeValue("gray.50", "gray.900");
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    if (certificate) {
      setFormData(certificate);
    } else {
      setFormData({
        id: null,
        title: "",
        institution: "",
        dateIssued: "",
        link: "",
      });
    }
  }, [certificate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await dispatch(
          updateCertificate({
            id: formData.id,
            updates: { ...formData, studentId },
          })
        );
        showToast(toast, "Certificate Updated", "success");
      } else {
        await dispatch(
          createCertificate({
            ...formData,
            studentId,
          })
        );
        showToast(toast, "Certificate Added", "success");
      }
      onSave(); // Notify the parent to update the UI
      onClose(); // Close the modal
    } catch (error) {
      showToast(toast, error, "error");
    }
  };

  const isSaveDisabled = !formData.title.trim() || !formData.institution.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={modalBgColor}>
        <ModalHeader>
          {formData.id ? "Edit Certificate" : "Add Certificate"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={3}>
            <Input
              placeholder="Certificate Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              bg={inputBgColor}
              color={inputTextColor}
            />
            <Input
              placeholder="Institution"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              bg={inputBgColor}
              color={inputTextColor}
            />
            <Input
              placeholder="Date Issued"
              type="date"
              name="dateIssued"
              value={formData.dateIssued}
              onChange={handleInputChange}
              bg={inputBgColor}
              color={inputTextColor}
            />
            <Input
              placeholder="Certificate Link"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              bg={inputBgColor}
              color={inputTextColor}
            />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            colorScheme="teal"
            mr={3}
            onClick={handleSave}
            isDisabled={isSaveDisabled}
          >
            {formData.id ? "Update Certificate" : "Add Certificate"}
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(CertificatesModal);
