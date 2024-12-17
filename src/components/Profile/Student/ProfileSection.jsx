import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Flex,
  Icon,
  Link,
  HStack,
} from "@chakra-ui/react";
import {
  FaPhone,
  FaGithub,
  FaLinkedin,
  FaFileAlt,
  FaEnvelope,
  FaEdit,
  FaUser,
} from "react-icons/fa";
import UpdateProfileModal from "./UpdateProfileModal";

const ProfileSection = ({ student, onRefresh }) => {
  // Theme colors
  const bgColor = useColorModeValue("red.50", "gray.900"); // Soft red in light mode
  const cardBgColor = useColorModeValue("red.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const headingColor = useColorModeValue("red.600", "teal.300");
  const buttonBg = useColorModeValue("red.100", "teal.600");
  const buttonText = useColorModeValue("red.900", "white");
  const linkColor = useColorModeValue("red.300", "teal.500");
  const iconColor = useColorModeValue("red.500", "teal.300");
  const buttonHoverBg = useColorModeValue("red.200", "teal.500");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    onRefresh();
    setIsModalOpen(false);
  };

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="lg" mb={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <HStack>
          <Icon as={FaUser} color={iconColor} />
          <Heading size="lg" color={headingColor}>
            Profile
          </Heading>
        </HStack>
        <Button
          size="md"
          bg={buttonBg}
          color={buttonText}
          leftIcon={<FaEdit />}
          onClick={() => setIsModalOpen(true)}
          _hover={{ bg: buttonHoverBg }}
        >
          Edit Profile
        </Button>
      </Flex>
      <Flex direction="column" gap={3}>
        <Flex align="center" color={textColor}>
          <Icon as={FaFileAlt} mr={2} />
          <Text>
            <strong>Name:</strong> {student?.name || "Add your name"}
          </Text>
        </Flex>
        <Flex align="center" color={textColor}>
          <Icon as={FaEnvelope} mr={2} />
          <Text>
            <strong>Email:</strong> {student?.email || "Add your email"}
          </Text>
        </Flex>
        <Flex align="center" color={textColor}>
          <Icon as={FaPhone} mr={2} />
          <Text>
            <strong>Phone:</strong> {student?.phoneNumber || "Add your phone"}
          </Text>
        </Flex>
        <Flex align="center" color={textColor}>
          <Icon as={FaGithub} mr={2} />
          <Text>
            <strong>GitHub:</strong>{" "}
            {student?.githubURL ? (
              <Link href={student.githubURL} isExternal color={linkColor}>
                {student.githubURL}
              </Link>
            ) : (
              "Add your GitHub profile"
            )}
          </Text>
        </Flex>
        <Flex align="center" color={textColor}>
          <Icon as={FaLinkedin} mr={2} />
          <Text>
            <strong>LinkedIn:</strong>{" "}
            {student?.linkedInURL ? (
              <Link href={student.linkedInURL} isExternal color={linkColor}>
                {student.linkedInURL}
              </Link>
            ) : (
              "Add your LinkedIn profile"
            )}
          </Text>
        </Flex>
        <Flex align="center" color={textColor}>
          <Icon as={FaFileAlt} mr={2} />
          <Text>
            <strong>Summary:</strong> {student?.summary || "Add your summary"}
          </Text>
        </Flex>
      </Flex>
      <UpdateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={student}
        onSave={handleSave}
      />
    </Box>
  );
};

export default React.memo(ProfileSection);
