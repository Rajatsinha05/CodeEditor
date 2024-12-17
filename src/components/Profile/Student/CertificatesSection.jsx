import React, { useState } from "react";
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  Button,
  IconButton,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  useToast,
} from "@chakra-ui/react";
import {
  FaPlus,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaUniversity,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaCertificate,
} from "react-icons/fa";
import CertificatesModal from "./CertificatesModal"; // Modal Component
import { deleteCertificate } from "../../../redux/Student/certificateApi"; // API Calls
import { useDispatch } from "react-redux";

const CertificatesSection = ({ student, onSave }) => {
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBgColor = useColorModeValue("red.50", "gray.800");
  const hoverBgColor = useColorModeValue("red.100", "teal.800");
  const textColor = useColorModeValue("gray.800", "white");
  const headingColor = useColorModeValue("red.600", "teal.300");
  const buttonBg = useColorModeValue("red.100", "teal.600");
  const buttonText = useColorModeValue("red.900", "white");
  const iconColor = useColorModeValue("red.500", "teal.300");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleEdit = (certificate) => {
    setCurrentCertificate(certificate);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentCertificate(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCertificate(id));
      toast({
        title: "Certificate Deleted",
        description: "The certificate was successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSave(); // Update the parent component's state
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the certificate.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    onSave();
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      mb={6}
      w="100%"
      maxW="1200px"
      mx="auto"
    >
      <Flex align="center" justify="space-between" mb={6}>
        <Flex align="center">
          <Icon as={FaCertificate} color={headingColor} mr={2} />
          <Heading size="lg" color={headingColor}>
            Certificates
          </Heading>
        </Flex>
        <Button
          size="md"
          bg={buttonBg}
          color={buttonText}
          onClick={handleAdd}
          leftIcon={<FaPlus />}
          _hover={{ bg: useColorModeValue("red.200", "teal.500") }}
        >
          Add Certificate
        </Button>
      </Flex>
      {student?.certificates?.length > 0 ? (
        <List spacing={6}>
          {student.certificates.map((certificate) => (
            <ListItem
              key={certificate.id}
              bg={cardBgColor}
              p={5}
              borderRadius="lg"
              boxShadow="sm"
              _hover={{ bg: hoverBgColor, boxShadow: "md" }}
              transition="background-color 0.3s, box-shadow 0.3s"
            >
              <Flex align="center" justify="space-between">
                <VStack align="start" spacing={2}>
                  <HStack>
                    <FaUniversity color={iconColor} />
                    <Text fontWeight="bold" fontSize="lg" color={textColor}>
                      {certificate.title}
                    </Text>
                  </HStack>
                  <HStack>
                    <FaCalendarAlt color={iconColor} />
                    <Text fontSize="sm" color={textColor}>
                      Issued on: {certificate.dateIssued || "N/A"}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color={textColor}>
                    <strong>Issued by:</strong>{" "}
                    {certificate.institution || "N/A"}
                  </Text>
                  {certificate.link && (
                    <HStack>
                      <FaExternalLinkAlt color={iconColor} />
                      <Link
                        href={certificate.link}
                        color={iconColor}
                        isExternal
                      >
                        View Certificate
                      </Link>
                    </HStack>
                  )}
                </VStack>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FaEllipsisV />}
                    size="sm"
                    aria-label="Options"
                    variant="ghost"
                    color={iconColor}
                  />
                  <MenuList>
                    <MenuItem
                      icon={<FaEdit />}
                      onClick={() => handleEdit(certificate)}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<FaTrash />}
                      onClick={() => handleDelete(certificate.id)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </ListItem>
          ))}
        </List>
      ) : (
        <Text color={textColor} textAlign="center" mt={6} fontSize="lg">
          No certificates added yet.
        </Text>
      )}
      <CertificatesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        certificate={currentCertificate}
        studentId={student?.id}
        onSave={handleSave}
      />
    </Box>
  );
};

export default React.memo(CertificatesSection);
