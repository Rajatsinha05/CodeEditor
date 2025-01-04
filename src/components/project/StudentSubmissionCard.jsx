import React from "react";
import {
  Box,
  Badge,
  Text,
  Link,
  useColorModeValue,
  Flex,
  Icon,
  Button,
} from "@chakra-ui/react";
import { FiGithub, FiCheckCircle, FiXCircle, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const StudentSubmissionCard = ({ result, index }) => {
  const navigate = useNavigate();
  const statusColor = result.status === "PASSED" ? "teal" : "red";
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const bgGradient = useColorModeValue(
    "linear(to-r, white, gray.100)",
    "linear(to-r, gray.700, gray.900)"
  );

  const handleViewDetails = () => navigate(`/submissions/${result.id}`);

  return (
    <Box
      p={8}
      bgGradient={bgGradient}
      rounded="lg"
      shadow="2xl"
      mb={6}
      border="1px solid"
      borderColor={borderColor}
      maxWidth="700px"
      mx="auto"
      transition="all 0.3s ease"
      _hover={{ transform: "scale(1.05)", shadow: "2xl" }}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontWeight="bold" fontSize="2xl" color={useColorModeValue("gray.800", "white")}> 
          Submission #{index + 1}
        </Text>
        <Badge
          colorScheme={statusColor}
          px={3}
          py={1}
          fontSize="md"
          borderRadius="full"
        >
          <Flex align="center" gap={2}>
            <Icon as={result.status === "PASSED" ? FiCheckCircle : FiXCircle} w={6} h={6} />
            {result.status}
          </Flex>
        </Badge>
      </Flex>

      <Text fontSize="lg" mb={3} color={useColorModeValue("gray.700", "gray.300")}> 
        <strong>Marks:</strong> {result.marks}
      </Text>

      <Flex justify="space-between" align="center" mt={4}>
        {result.githubLink ? (
          <Link
            href={result.githubLink}
            isExternal
            display="flex"
            alignItems="center"
            fontSize="md"
            color="teal.500"
            fontWeight="bold"
            _hover={{ textDecoration: "underline" }}
          >
            <Icon as={FiGithub} mr={2} /> GitHub Submission
          </Link>
        ) : (
          <Text fontSize="md" color="red.400">
            No GitHub Link Provided
          </Text>
        )}

        <Button
          leftIcon={<FiEye />}
          colorScheme="teal"
          size="md"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </Flex>
    </Box>
  );
};

export default StudentSubmissionCard;
