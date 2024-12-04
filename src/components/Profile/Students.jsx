import React, { useEffect, useState } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { FaEllipsisV, FaTrash, FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getStudents,
  updateStudent,
  deleteStudent,
} from "../../redux/apiSlice";
import { getBranch } from "../data/branch";
import { getCourse } from "../data/course";
import { showToast } from "../../utils/toastUtils";

const Students = ({ branchCode }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { students } = useSelector((store) => store.data);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const hoverColor = useColorModeValue("red.100", "teal.600");
  const tableBgColor = useColorModeValue("white", "gray.700");
  const tableColorScheme = useColorModeValue("red", "teal");
  const alternateRowBg = useColorModeValue(
    "rgba(255, 0, 0, 0.05)",
    "rgba(20, 20, 20, 0.5)"
  );

  useEffect(() => {
    dispatch(getStudents());
  }, [dispatch]);

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
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleUpdateStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (id) => {
    try {
      await dispatch(deleteStudent(id)).unwrap();
      showToast(toast, "Student deleted successfully.", "success");
      dispatch(getStudents());
    } catch (error) {
      showToast(toast, "Error deleting student.", "error");
    }
  };

  const handleSave = async () => {
    if (!selectedStudent) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        updateStudent({ id: selectedStudent.id, studentData: selectedStudent })
      ).unwrap();
      showToast(toast, "Student updated successfully.", "success");
      setIsModalOpen(false);
      dispatch(getStudents());
    } catch (error) {
      showToast(toast, "Error updating student.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
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
          {getCourse().map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
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
            {getBranch().map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </Select>
        )}
      </Flex>

      <TableContainer>
        <Table variant="striped" colorScheme={tableColorScheme}>
          <Thead>
            <Tr>
              <Th onClick={toggleSortOrder} cursor="pointer">
                Name {sortOrder === "asc" ? "↑" : "↓"}
              </Th>
              <Th>Email</Th>
              <Th>Course</Th>
              <Th>Branch Code</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredStudents.map((student, index) => (
              <Tr
                key={student.id}
                _hover={{ bg: hoverColor }}
                bg={index % 2 === 1 ? alternateRowBg : "transparent"}
              >
                <Td>{student.name}</Td>
                <Td>{student.email}</Td>
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
                      <MenuItem onClick={() => handleUpdateStudent(student)}>
                        <FaEdit style={{ marginRight: "8px" }} /> Update
                      </MenuItem>
                      <MenuItem onClick={() => handleDeleteStudent(student.id)}>
                        <FaTrash style={{ marginRight: "8px" }} /> Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Student</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={selectedStudent?.name || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl mt={4} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  value={selectedStudent?.email || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl mt={4} isRequired>
                <FormLabel>Course</FormLabel>
                <Select
                  value={selectedStudent?.course || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      course: e.target.value,
                    }))
                  }
                >
                  {getCourse().map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mt={4} isRequired>
                <FormLabel>Branch Code</FormLabel>
                <Select
                  value={selectedStudent?.branchCode || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      branchCode: e.target.value,
                    }))
                  }
                >
                  {getBranch().map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                onClick={handleSave}
                isLoading={isSubmitting}
              >
                Save
              </Button>
              <Button variant="ghost" onClick={handleModalClose} ml={3}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default React.memo(Students);
