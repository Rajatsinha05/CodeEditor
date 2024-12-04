import React from "react";
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Icon,
  Tooltip,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { MdAdminPanelSettings } from "react-icons/md";
import { FiMail } from "react-icons/fi";

const EnrolledStudents = ({ contest }) => {
  // Define colors using the theme's color palette
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const emailColor = useColorModeValue("blue.600", "blue.300");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const borderColor = useColorModeValue("teal.400", "red.400");
  const cardStyles = {
    padding: "4",
    borderRadius: "md",
    border: "2px solid teal",
  };
  return (
    <Box
      my={6}
      px={[4, 6]}
      py={6}
      // {...cardStyles}
      border={`2px solid ${borderColor}`}
      borderRadius="lg"
      shadow="md"
      // bg={useColorModeValue("gray.50", "gray.900")}
      transition="all 0.3s ease"
      _hover={{ shadow: "lg" }}
    >
      <Text
        fontSize={["lg", "xl"]}
        fontWeight="semibold"
        mb={6}
        color={headingColor}
        textAlign="center"
        borderBottom={`2px solid ${headingColor}`}
        display="inline-block"
        pb={1}
      >
        Enrolled Students
      </Text>
      <VStack spacing={4} align="stretch">
        {contest?.enrolledStudents?.map((student) => (
          <HStack
            key={student.id}
            p={4}
            bg={cardBg}
            borderRadius="md"
            shadow="sm"
            _hover={{
              bg: cardHoverBg,
              transform: "scale(1.02)",
              boxShadow: "lg",
            }}
            transition="all 0.2s ease-in-out"
            justifyContent="space-between"
            // border={`1px solid ${borderColor}`}
            {...cardStyles}
          >
            <Flex align="center" gap={3} wrap="wrap">
              <Avatar name={student.name} size="sm" />
              <Box>
                <Text
                  fontSize="md"
                  color={textColor}
                  fontWeight="medium"
                  textTransform="capitalize"
                >
                  {student.name}
                </Text>
                <HStack spacing={2}>
                  <Icon as={FiMail} color={emailColor} />
                  <Text fontSize="sm" color={emailColor}>
                    {student.email}
                  </Text>
                </HStack>
              </Box>
            </Flex>
            {student.role === "ADMIN" && (
              <Tooltip label="Admin Access" aria-label="Admin Access">
                <Icon
                  as={MdAdminPanelSettings}
                  color={headingColor}
                  boxSize={5}
                />
              </Tooltip>
            )}
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default React.memo(EnrolledStudents);
