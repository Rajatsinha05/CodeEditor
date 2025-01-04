import React from "react";
import {
  Box,
  VStack,
  Flex,
  Text,
  Icon,
  Badge,
  Divider,
  useColorModeValue,
  Heading,
  Skeleton,
} from "@chakra-ui/react";
import { FiFileText, FiCode, FiShield, FiAward, FiClock } from "react-icons/fi";
import dayjs from "dayjs";
import ModifyAndDownloadZip from "./ModifyAndDownloadZip";

const ProjectInformation = ({ testDetail, isLoading }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.300");

  if (isLoading) {
    return (
      <Box p={6} bg={bgColor} rounded="lg" shadow="lg">
        <Skeleton height="24px" mb={4} />
        <Skeleton height="16px" mb={2} />
        <Skeleton height="16px" mb={2} />
        <Skeleton height="16px" mb={2} />
      </Box>
    );
  }

  if (!testDetail) {
    return (
      <Box p={6} bg={bgColor} rounded="lg" shadow="lg" textAlign="center">
        <Text fontSize="lg" color={subTextColor}>
          No project information available.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={6} bg={bgColor} rounded="lg" shadow="lg">
      <Heading size="md" mb={4} color={textColor}>
        Project Information
      </Heading>
      <Divider mb={4} />
      <VStack align="start" spacing={4}>
        {[
          {
            label: "Title",
            value: testDetail.title || "N/A",
            icon: FiFileText,
          },
          { label: "Module", value: testDetail.module || "N/A", icon: FiCode },

          { label: "Marks", value: testDetail.marks || "N/A", icon: FiAward },
          {
            label: "Start Time",
            value: testDetail.startTime
              ? dayjs(testDetail.startTime).format("MMMM D, YYYY h:mm A")
              : "N/A",
            icon: FiClock,
          },
          {
            label: "End Time",
            value: testDetail.endTime
              ? dayjs(testDetail.endTime).format("MMMM D, YYYY h:mm A")
              : "N/A",
            icon: FiClock,
          },
        ].map((detail, index) => (
          <Flex key={index} align="center" gap={2}>
            <Icon as={detail.icon} color="teal.500" />
            <Text fontWeight="bold" color={textColor}>
              {detail.label}:
            </Text>
            <Text color={subTextColor}>{detail.value}</Text>
          </Flex>
        ))}
      </VStack>

      <ModifyAndDownloadZip fileName={testDetail.fileName} testDetail={testDetail}/>
      {testDetail.description && (
        <>
          <Divider my={4} />
          <Box
            dangerouslySetInnerHTML={{ __html: testDetail.description }}
            fontSize="sm"
            color={subTextColor}
          />
        </>
      )}
    </Box>
  );
};

export default ProjectInformation;
