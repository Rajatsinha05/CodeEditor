import React from "react";
import { Box, VStack, HStack, Avatar, Text, Tag, Icon, Tooltip } from "@chakra-ui/react";
import { MdAdminPanelSettings } from "react-icons/md";

const EnrolledStudents = ({ contest, colorMode }) => (
  <Box my={6}>
    <Text fontSize="lg" fontWeight="semibold" mb={4} color={colorMode === "light" ? "teal.600" : "teal.300"}>
      Enrolled Students
    </Text>
    <VStack spacing={4} align="stretch">
      {contest?.enrolledStudents
?.map((student) => (
        <HStack
          key={student.id}
          p={4}
          bg={colorMode === "light" ? "white" : "gray.700"}
          borderRadius="md"
          shadow="sm"
          _hover={{ bg: colorMode === "light" ? "gray.100" : "gray.600" }}
          justifyContent="space-between"
        >
          <HStack spacing={3}>
            <Avatar name={student.name} size="sm" />
            <Text fontSize="md" color={colorMode === "light" ? "gray.700" : "gray.300"} fontWeight="medium">
              {student.name}
            </Text>
            <Tag size="sm" colorScheme="blue">
              {student.email}
            </Tag>
          </HStack>
          <Tooltip label="Admin Access" aria-label="Admin Access">
            <Icon as={MdAdminPanelSettings} color="teal.500" />
          </Tooltip>
        </HStack>
      ))}
    </VStack>
  </Box>
);

export default EnrolledStudents;
