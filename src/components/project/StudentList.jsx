import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiArrowDown, FiUser, FiCheckCircle, FiXCircle } from "react-icons/fi";

const StudentList = ({
  sortedResults,
  groupedResults,
  selectedStudentId,
  setSelectedStudentId,
  setSortKey,
}) => {
  const tableRowHover = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "teal.200");

  return (
    <Table variant="striped" size="sm">
      <Thead>
        <Tr>
          <Th
            onClick={() => setSortKey("name")}
            cursor="pointer"
            color={textColor}
          >
            Name <Icon as={FiArrowDown} />
          </Th>
          <Th
            onClick={() => setSortKey("marks")}
            cursor="pointer"
            color={textColor}
          >
            Marks <Icon as={FiArrowDown} />
          </Th>
          <Th
            onClick={() => setSortKey("status")}
            cursor="pointer"
            color={textColor}
          >
            Status <Icon as={FiArrowDown} />
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {sortedResults.map((studentId) => {
          const bestResult = groupedResults[studentId][0];
          return (
            <Tr
              key={studentId}
              onClick={() => setSelectedStudentId(studentId)}
              cursor="pointer"
              _hover={{ bg: tableRowHover }}
              bg={
                selectedStudentId === studentId
                  ? useColorModeValue("teal.50", "teal.900")
                  : "transparent"
              }
            >
              <Td>
                <Flex align="center">
                  <Icon as={FiUser} mr={2} />
                  {bestResult.name}
                </Flex>
              </Td>
              <Td>{bestResult.marks}</Td>
              <Td>
                <Badge
                  colorScheme={bestResult.status === "PASSED" ? "teal" : "red"}
                >
                  <Flex align="center">
                    <Icon
                      as={
                        bestResult.status === "PASSED"
                          ? FiCheckCircle
                          : FiXCircle
                      }
                      mr={1}
                    />
                    {bestResult.status}
                  </Flex>
                </Badge>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default StudentList;
