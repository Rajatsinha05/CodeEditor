import React from "react";
import {
  Box,
  Text,
  Grid,
  Avatar,
  useColorModeValue,
  Icon,
  Tooltip,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import { MdGrade, MdCheckCircle, MdPending } from "react-icons/md";
import dayjs from "dayjs";

const ContestAttemptingDetails = ({ contestAttempts }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const borderColor = useColorModeValue("teal.300", "teal.600");

  if (!contestAttempts || contestAttempts.length === 0) {
    return (
      <Text color="gray.500" fontSize="lg" textAlign="center" mt={6}>
        No ongoing contest attempts.
      </Text>
    );
  }

  return (
    <Box my={8} px={[4, 6]} maxWidth="1000px" mx="auto">
      <Text
        fontSize={["lg", "xl", "2xl"]}
        fontWeight="bold"
        mb={6}
        textAlign="center"
        color={headingColor}
        borderBottom={`2px solid ${headingColor}`}
        display="inline-block"
        pb={1}
      >
        Ongoing Contest Attempts
      </Text>

      <VStack spacing={5} align="stretch">
        {contestAttempts.map((attempt) => (
          <Box
            key={attempt.id}
            p={5}
            bg={cardBg}
            borderRadius="lg"
            shadow="lg"
            _hover={{
              bg: cardHoverBg,
              transform: "scale(1.03)",
              boxShadow: "xl",
            }}
            transition="all 0.3s ease-in-out"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Grid
              templateColumns={{
                base: "1fr",
                md: "150px 200px 200px 100px 80px",
              }}
              gap={4}
              alignItems="center"
            >
              {/* User Info */}
              <Flex align="center" gap={3} overflow="hidden">
                <Avatar name={attempt.username} size="md" />
                <Box>
                  <Text
                    fontWeight="bold"
                    color={textColor}
                    fontSize="sm"
                    textTransform="capitalize"
                    isTruncated
                  >
                    {attempt.username}
                  </Text>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    noOfLines={1}
                    wordBreak="break-all"
                  >
                    {attempt.email}
                  </Text>
                </Box>
              </Flex>

              {/* Start and End Time */}
              <Flex direction="column" gap={2} overflow="hidden">
                <Flex align="center" gap={2}>
                  <Tooltip label="Start Time" aria-label="Start Time Tooltip">
                    <Icon as={CalendarIcon} color="teal.500" boxSize={4} />
                  </Tooltip>
                  <Text fontSize="xs" color={textColor} isTruncated>
                    {dayjs(attempt.startTime).format("MMM D, YYYY - hh:mm A")}
                  </Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <Tooltip label="End Time" aria-label="End Time Tooltip">
                    <Icon as={TimeIcon} color="red.500" boxSize={4} />
                  </Tooltip>
                  <Text fontSize="xs" color={textColor} isTruncated>
                    {attempt?.endTime
                      ? dayjs(attempt.endTime).format("MMM D, YYYY - hh:mm A")
                      : "Ongoing"}
                  </Text>
                </Flex>
              </Flex>

              {/* Marks */}
              <Flex align="center" justify="center" gap={2}>
                <Tooltip label="Marks Obtained" aria-label="Marks Tooltip">
                  <Icon as={MdGrade} color="yellow.500" boxSize={5} />
                </Tooltip>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={attempt.obtainMarks !== null ? "teal.600" : "red.500"}
                >
                  {attempt.obtainMarks !== null
                    ? `${attempt.obtainMarks} / ${attempt.totalMarks}`
                    : `0 / ${attempt.totalMarks}`}
                </Text>
              </Flex>

              {/* Status */}
              <Flex justify="center" align="center">
                {attempt.endTime ? (
                  <Tooltip label="Completed" aria-label="Completed Tooltip">
                    <Icon as={MdCheckCircle} color="green.500" boxSize={5} />
                  </Tooltip>
                ) : (
                  <Tooltip label="In Progress" aria-label="In Progress Tooltip">
                    <Icon as={MdPending} color="orange.400" boxSize={5} />
                  </Tooltip>
                )}
              </Flex>
            </Grid>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ContestAttemptingDetails;
