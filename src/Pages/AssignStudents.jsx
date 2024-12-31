import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Input,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Select,
  Checkbox,
  Badge,
  useColorModeValue,
  useToast,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
  Icon,
} from "@chakra-ui/react";
import {
  FiFilter,
  FiMail,
  FiUser,
  FiBook,
  FiUsers,
  FiHash,
  FiSearch,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import {
  fetchStudents,
  fetchStudentsByBranchCode,
} from "../redux/Student/studentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateBatch } from "../redux/Batch/batchSlice";

const AssignStudents = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { students } = useSelector((store) => store.student);
  const { user } = useSelector((store) => store.user);
  const { batchId } = useParams();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filters, setFilters] = useState([{ field: "name", value: "" }]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("red.200", "teal.200");
  const hoverBorderColor = useColorModeValue("teal.300", "red.300");
  const buttonBgColor = useColorModeValue("teal.400", "teal.600");
  const buttonHoverColor = useColorModeValue("teal.500", "teal.400");
  const badgeBgColor = useColorModeValue("red.100", "red.500");
  const badgeTextColor = useColorModeValue("red.700", "whiteAlpha.900");

  useEffect(() => {
    if (user?.role === "ADMIN") {
      dispatch(fetchStudentsByBranchCode(user?.branchCode));
    } else {
      dispatch(fetchStudents());
    }
  }, [dispatch, user?.role, user?.branchCode]);

  useEffect(() => {
    const filtered = students.filter((student) =>
      filters.every((filter) =>
        student[filter.field]
          ?.toLowerCase()
          ?.includes(filter.value.toLowerCase())
      )
    );
    setFilteredStudents(filtered);
  }, [students, filters]);

  const handleFilterChange = (index, field, value) => {
    const updatedFilters = [...filters];
    updatedFilters[index] = { ...updatedFilters[index], [field]: value };
    setFilters(updatedFilters);
  };

  const addFilter = () => {
    setFilters([...filters, { field: "name", value: "" }]);
  };

  const removeFilter = (index) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
  };

  const toggleStudentSelection = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id)
        ? prev.filter((studentId) => studentId !== id)
        : [...prev, id]
    );
  };

  const handleAssignStudents = async () => {
    const payload = {
      id: batchId,
      studentIds: selectedStudentIds,
    };

    try {
      await dispatch(updateBatch(payload)).unwrap();
      toast({
        title: "Success",
        description: "Batch updated successfully!",
        status: "success",
      });
      setSelectedStudentIds([]);
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to update batch.",
        status: "error",
      });
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }} bg={bgColor}>
      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={6}>
        <Flex align="center" gap={2}>
          <Icon as={FiFilter} color={buttonBgColor} />
          <Text
            fontSize={{ base: "lg", md: "2xl" }}
            fontWeight="bold"
            color={textColor}
          >
            Assign Students
          </Text>
        </Flex>
        <Button
          onClick={onOpen}
          bg={buttonBgColor}
          color="white"
          leftIcon={<FiFilter />}
          _hover={{ bg: buttonHoverColor }}
        ></Button>
      </Flex>

      {/* Drawer for Filters */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex align="center">
              <Icon as={FiSearch} mr={2} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {filters.map((filter, index) => (
                <Box
                  key={index}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  bg={cardBgColor}
                  shadow="sm"
                  _hover={{
                    shadow: "md",
                    transform: "scale(1.02)",
                    transition: "0.2s",
                  }}
                >
                  <Flex align="center" justify="space-between" mb={3}>
                    <Text fontWeight="bold" fontSize="md" color={textColor}>
                      Filter {index + 1}
                    </Text>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => removeFilter(index)}
                      leftIcon={<FiTrash2 />}
                      variant="outline"
                      _hover={{ bg: badgeBgColor, color: badgeTextColor }}
                    ></Button>
                  </Flex>
                  <Flex direction={{ base: "column", md: "row" }} gap={3}>
                    <Select
                      value={filter.field}
                      onChange={(e) =>
                        handleFilterChange(index, "field", e.target.value)
                      }
                      placeholder="Filter by"
                      bg={cardBgColor}
                      color={textColor}
                      borderColor={hoverBorderColor}
                      flex="1"
                      size="sm"
                    >
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="grid">Grid</option>
                      <option value="course">Course</option>
                      <option value="branchCode">Branch Code</option>
                    </Select>
                    <Input
                      placeholder="Enter value"
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, "value", e.target.value)
                      }
                      bg={cardBgColor}
                      color={textColor}
                      borderColor={hoverBorderColor}
                      flex="2"
                      size="sm"
                    />
                  </Flex>
                </Box>
              ))}
              <Button
                onClick={addFilter}
                colorScheme="teal"
                leftIcon={<FiPlus />}
                size="lg"
                mt={4}
                alignSelf="center"
                _hover={{ bg: buttonHoverColor }}
              >
                Add Filter
              </Button>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Student List */}
      <Wrap spacing={4}>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <WrapItem key={student.id} w="100%">
              <Flex
                p={4}
                rounded="lg"
                shadow="lg"
                bg={cardBgColor}
                border="1px solid"
                borderColor={borderColor}
                _hover={{
                  borderColor: hoverBorderColor,
                  transform: "scale(1.02)",
                }}
                align="center"
                justify="space-between"
                w="100%"
              >
                <Flex align="center" gap={4} wrap="wrap">
                  <Checkbox
                    isChecked={selectedStudentIds.includes(student.id)}
                    onChange={() => toggleStudentSelection(student.id)}
                    colorScheme="teal"
                  />
                  <FiUser size="20px" />
                  <Text fontSize="sm" fontWeight="bold" color={textColor}>
                    {student.name}
                  </Text>
                  <FiMail size="20px" />
                  <Text fontSize="sm" color={textColor}>
                    {student.email}
                  </Text>
                  <FiBook size="20px" />
                  <Text fontSize="sm" color={textColor}>
                    {student.course}
                  </Text>
                  <FiHash size="20px" />
                  <Text fontSize="sm" color={textColor}>
                    {student.grid}
                  </Text>
                </Flex>
                <Badge
                  px={3}
                  py={1}
                  fontSize="xs"
                  rounded="full"
                  bg={badgeBgColor}
                  color={badgeTextColor}
                  display="flex"
                  alignItems="center"
                >
                  <FiUsers size="14px" />
                  {student.branchCode}
                </Badge>
              </Flex>
            </WrapItem>
          ))
        ) : (
          <Text fontSize="lg" color={textColor}>
            No students found.
          </Text>
        )}
      </Wrap>

      {/* Assign Students Button */}
      {selectedStudentIds.length > 0 && (
        <Button
          mt={6}
          colorScheme="teal"
          onClick={handleAssignStudents}
          isFullWidth
          size="lg"
        >
          Assign Students
        </Button>
      )}
    </Box>
  );
};

export default AssignStudents;
