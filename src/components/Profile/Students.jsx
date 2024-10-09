import React, { useEffect, useState } from "react";
import { getStudents } from "../../redux/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Flex,
  Text,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { FaSortAlphaDown, FaSortAlphaUpAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Students = ({ branchCode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students } = useSelector((store) => store.data);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [sortOrder, setSortOrder] = useState({ key: "", order: "" });

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const hoverColor = useColorModeValue("teal.100", "teal.700");
  const tableBgColor = useColorModeValue("white", "gray.700");

  useEffect(() => {
    dispatch(getStudents());
  }, [dispatch]);

  // Filter and sort students
  const filteredStudents = students
    .filter((student) => {
      // If branchCode is "SUPERADMIN", allow filtering by branch code
      if (branchCode === "SUPERADMIN") {
        return branchFilter ? student.branchCode === branchFilter : true;
      }
      // For admins, filter by their specific branch code
      return student.branchCode === branchCode;
    })
    .filter(
      (student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((student) =>
      courseFilter ? student.course === courseFilter : true
    )
    .sort((a, b) => {
      if (!sortOrder.key) return 0;
      if (sortOrder.order === "asc") {
        return a[sortOrder.key] > b[sortOrder.key] ? 1 : -1;
      } else {
        return a[sortOrder.key] < b[sortOrder.key] ? 1 : -1;
      }
    });

  // Handle sorting
  const handleSort = (key) => {
    setSortOrder((prev) => ({
      key,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  };

  // Handle navigation to student details
  const handleRowClick = (id) => {
    navigate(`/student/${id}`);
  };

  return (
    <Box
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
      color={textColor}
      boxShadow="lg"
    >
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Students Management
      </Text>

      {/* Search and Filter Section */}
      <Flex mb={4} gap={4} alignItems="center">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="30%"
          bg={tableBgColor}
          borderRadius="md"
          boxShadow="sm"
        />
        <Select
          placeholder="Filter by course"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          width="20%"
          bg={tableBgColor}
          borderRadius="md"
          boxShadow="sm"
        >
          <option value="android Developer">Android Developer</option>
          <option value="C++">C++</option>
          <option value="backend Developer">Backend Developer</option>
          <option value="full stack Developer">Full Stack Developer</option>
          <option value="frontend Developer">Frontend Developer</option>
          <option value="C">C</option>
        </Select>

        {/* Branch filter visible only to SUPERADMIN */}
        {branchCode === "SUPERADMIN" && (
          <Select
            placeholder="Filter by branch"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            width="20%"
            bg={tableBgColor}
            borderRadius="md"
            boxShadow="sm"
          >
            <option value="rw1">Branch RW1</option>
            <option value="rw2">Branch RW2</option>
            <option value="rw3">Branch RW3</option>
            <option value="rw4">Branch RW4</option>
            <option value="rw5">Branch RW5</option>
            <option value="rw6">Branch RW6</option>
            <option value="rw7">Branch RW7</option>
            <option value="rw8">Branch RW8</option>
          </Select>
        )}
      </Flex>

      {/* Students Table */}
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>
                ID
                <IconButton
                  size="xs"
                  ml={2}
                  onClick={() => handleSort("id")}
                  icon={
                    sortOrder.key === "id" && sortOrder.order === "asc" ? (
                      <ArrowUpIcon />
                    ) : (
                      <ArrowDownIcon />
                    )
                  }
                  variant="ghost"
                  colorScheme="teal"
                  _hover={{ bg: hoverColor }}
                />
              </Th>
              <Th>
                Name
                <IconButton
                  size="xs"
                  ml={2}
                  onClick={() => handleSort("name")}
                  icon={
                    sortOrder.key === "name" && sortOrder.order === "asc" ? (
                      <FaSortAlphaUpAlt />
                    ) : (
                      <FaSortAlphaDown />
                    )
                  }
                  variant="ghost"
                  colorScheme="teal"
                  _hover={{ bg: hoverColor }}
                />
              </Th>
              <Th>Email</Th>
              <Th>Grid</Th>
              <Th>
                Course
                <IconButton
                  size="xs"
                  ml={2}
                  onClick={() => handleSort("course")}
                  icon={
                    sortOrder.key === "course" && sortOrder.order === "asc" ? (
                      <ArrowUpIcon />
                    ) : (
                      <ArrowDownIcon />
                    )
                  }
                  variant="ghost"
                  colorScheme="teal"
                  _hover={{ bg: hoverColor }}
                />
              </Th>
              <Th>Branch Code</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredStudents.map((student) => (
              <Tr
                key={student.id}
                _hover={{ bg: hoverColor, cursor: "pointer" }}
                onClick={() => handleRowClick(student.id)}
              >
                <Td>{student.id}</Td>
                <Td>{student.name}</Td>
                <Td>{student.email}</Td>
                <Td>{student.grid}</Td>
                <Td>{student.course}</Td>
                <Td>{student.branchCode}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Students;
