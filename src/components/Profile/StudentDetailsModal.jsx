import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Avatar,
  Box,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import {
  FaEnvelope,
  FaIdBadge,
  FaGraduationCap,
  FaUniversity,
} from "react-icons/fa";

const StudentDetailsModal = ({ isOpen, onClose, student }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headerColor = useColorModeValue("teal.500", "teal.300");
  const cardBgColor = useColorModeValue("gray.100", "gray.800");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "lg" }}>
      <ModalOverlay />
      <ModalContent bg={bgColor} borderRadius="lg" boxShadow="2xl">
        {/* Header Section */}
        <ModalHeader
          textAlign="center"
          color={headerColor}
          fontSize={{ base: "lg", md: "2xl" }}
        >
          Student Details
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack spacing={{ base: 4, md: 6 }}>
            {/* Avatar Section */}
            <Avatar
              size={{ base: "xl", md: "2xl" }}
              name={student.name}
              boxShadow="lg"
            />

            {/* Details Section */}
            <Box
              w="100%"
              bg={cardBgColor}
              p={{ base: 4, md: 6 }}
              borderRadius="lg"
              boxShadow="md"
            >
              <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                <HStack spacing={3}>
                  <Icon
                    as={FaIdBadge}
                    boxSize={{ base: 4, md: 5 }}
                    color={headerColor}
                  />
                  <Text
                    fontWeight="bold"
                    color={textColor}
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    {student.name}
                  </Text>
                </HStack>
                <HStack spacing={3}>
                  <Icon
                    as={FaEnvelope}
                    boxSize={{ base: 4, md: 5 }}
                    color={headerColor}
                  />
                  <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>
                    {student.email}
                  </Text>
                </HStack>
                <HStack spacing={3}>
                  <Icon
                    as={FaGraduationCap}
                    boxSize={{ base: 4, md: 5 }}
                    color={headerColor}
                  />
                  <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>
                    Grid: {student.grid}
                  </Text>
                </HStack>
                <HStack spacing={3}>
                  <Icon
                    as={FaUniversity}
                    boxSize={{ base: 4, md: 5 }}
                    color={headerColor}
                  />
                  <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>
                    Course: {student.course}
                  </Text>
                </HStack>
                <HStack spacing={3}>
                  <Icon
                    as={FaUniversity}
                    boxSize={{ base: 4, md: 5 }}
                    color={headerColor}
                  />
                  <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>
                    Branch Code: {student.branchCode}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(StudentDetailsModal);
