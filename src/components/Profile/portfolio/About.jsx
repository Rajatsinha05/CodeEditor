import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

const About = ({ student }) => {
  // Dynamic colors based on theme
  const cardBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.300");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const linkColor = useColorModeValue("blue.500", "blue.300");

  return (
    <Box
      maxW="800px"
      mx="auto"
      mt={8}
      p={6}
      bg={cardBg}
      boxShadow="lg"
      borderRadius="md"
    >
      {/* Title */}
      <Heading mb={4} size="lg" textAlign="center" color={headingColor}>
        About {student.name}
      </Heading>
      <Divider mb={6} />

      {/* Personal Details */}
      <VStack spacing={4} align="stretch">
        <Text fontSize="md" color={textColor}>
          <strong>Email:</strong> {student.email}
        </Text>
        <Text fontSize="md" color={textColor}>
          <strong>Phone:</strong> {student.phoneNumber}
        </Text>
        <Text fontSize="md" color={textColor}>
          <strong>Course:</strong> {student.course}
        </Text>
        <Text fontSize="md" color={textColor}>
          <strong>Branch Code:</strong> {student.branchCode}
        </Text>
        <Text fontSize="md" color={textColor}>
          <strong>Grid ID:</strong> {student.grid}
        </Text>
      </VStack>

      {/* Summary */}
      <Box mt={6}>
        <Heading size="md" mb={2} color={headingColor}>
          Summary
        </Heading>
        <Text fontSize="md" color={textColor}>
          {student.summary || "No summary provided."}
        </Text>
      </Box>

      {/* Links */}
      <Box mt={6}>
        <Heading size="md" mb={2} color={headingColor}>
          Links
        </Heading>
        <HStack spacing={4}>
          {student.githubURL && (
            <Link href={student.githubURL} color={linkColor} isExternal>
              GitHub Profile
            </Link>
          )}
          {student.linkedInURL && (
            <Link href={student.linkedInURL} color={linkColor} isExternal>
              LinkedIn Profile
            </Link>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default About;
