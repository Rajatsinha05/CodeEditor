import React from "react";
import {
  Box,
  Text,
  Badge,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaEllipsisV, FaEye, FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Ability from "../../Permissions/Ability";
import { GetRoles } from "../../Permissions/Roles";

const QuestionList = ({ questions, onView, onUpdate, onDelete, onAdd }) => {
  const textColor = useColorModeValue("gray.800", "gray.200");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const badgeColors = {
    Easy: useColorModeValue("green.100", "green.700"),
    Medium: useColorModeValue("yellow.100", "yellow.700"),
    Hard: useColorModeValue("red.100", "red.700"),
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      rounded="lg"
      shadow="md"
      minH="100vh"
      color={textColor}
    >
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <Flex
            key={index}
            align="center"
            p={4}
            bg={useColorModeValue("gray.100", "gray.800")}
            rounded="md"
            shadow="sm"
            mb={4}
            _hover={{
              bg: useColorModeValue("gray.200", "gray.700"),
              transform: "scale(1.02)",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Text fontSize="md" fontWeight="medium" isTruncated flex="1">
              {index + 1}. {question.title}
            </Text>
            <Badge
              colorScheme={
                question.difficulty === "Easy"
                  ? "green"
                  : question.difficulty === "Medium"
                  ? "yellow"
                  : "red"
              }
            >
              {question.difficulty}
            </Badge>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaEllipsisV />}
                variant="ghost"
                aria-label="Options"
              />
              <MenuList>
                <MenuItem icon={<FaEye />} onClick={() => onView(question)}>
                  View
                </MenuItem>
                <Ability roles={GetRoles()}>
                  <MenuItem
                    icon={<FaEdit />}
                    onClick={() => onUpdate(question)}
                  >
                    Update
                  </MenuItem>
                  <MenuItem
                    icon={<FaTrashAlt />}
                    onClick={() => onDelete(question)}
                  >
                    Delete
                  </MenuItem>
                </Ability>
              </MenuList>
            </Menu>
          </Flex>
        ))
      ) : (
        <Box textAlign="center" mt={6}>
          <Text fontSize="lg" fontWeight="bold">
            No Questions Available
          </Text>
          <Text fontSize="sm" color="gray.500">
            Please try again later or adjust your filters.
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default QuestionList;
