import React, { useEffect, useState } from "react";
import { getStudents } from "../../redux/apiSlice"; // Import deleteStudent
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast, // Toast for notifications
} from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { FaSortAlphaDown, FaSortAlphaUpAlt, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { deleteStudent } from "../../redux/Student/studentsSlice";
import { showToast } from "../../utils/toastUtils";

const Students = ({ branchCode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast(); // Toast for feedback
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
      if (branchCode === "SUPERADMIN") {
        return branchFilter ? student.branchCode === branchFilter : true;
      }
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

  const handleSort = (key) => {
    setSortOrder((prev) => ({
      key,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleRowClick = (id) => {
    navigate(`/student/${id}`);
  };

  const handleRemoveStudent = (id) => {
    dispatch(deleteStudent(id))
      .unwrap() // Ensures proper handling of async actions
      .then(() => {
        showToast(toast, "Student Removed", "success");
      })
      .catch((error) => {
        toast({
          title: "Error Removing Student",
          description: error || "Failed to remove student.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleUpdateStudent = (id) => {
    navigate(`/update-student/${id}`);
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
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Grid</Th>
              <Th>Course</Th>
              <Th>Branch Code</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredStudents.map((student) => (
              <Tr key={student.id}>
                <Td>{student.id}</Td>
                <Td>{student.name}</Td>
                <Td>{student.email}</Td>
                <Td>{student.grid}</Td>
                <Td>{student.course}</Td>
                <Td>{student.branchCode}</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<FaEllipsisV />}
                      variant="ghost"
                    />
                    <MenuList>
                      <MenuItem onClick={() => handleUpdateStudent(student.id)}>
                        Update
                      </MenuItem>
                      <MenuItem onClick={() => handleRemoveStudent(student.id)}>
                        Remove
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Students;
