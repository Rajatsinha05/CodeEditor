import React, { useEffect, useState } from "react";
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
  MenuItem,
  MenuList,
  useBreakpointValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import {
  FaSortAlphaDown,
  FaSortAlphaUpAlt,
  FaEllipsisV,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCourse } from "../data/course";
import { getBranch } from "../data/branch";
import { deleteUser, fetchUsers, createUser } from "../../redux/User/userApi";

const Users = ({ branchCode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, user } = useSelector((store) => store.user); // Assuming `user` is the logged-in user
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [sortOrder, setSortOrder] = useState({ key: "", order: "" });

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const hoverColor = useColorModeValue("red.100", "teal.600");
  const tableBgColor = useColorModeValue("white", "gray.700");
  const tableColorScheme = useColorModeValue("red", "teal");
  const alternateRowBg = useColorModeValue(
    "rgba(255, 0, 0, 0.05)",
    "rgba(20, 20, 20, 0.5)"
  );

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const refreshUsers = () => {
    dispatch(fetchUsers());
  };

  const filteredUsers = (users || [])
    .filter(
      (userItem) =>
        branchCode === "SUPERADMIN" || userItem.branchCode === branchCode
    )
    .filter(
      (userItem) =>
        userItem?.name?.toLowerCase().includes(search.toLowerCase()) ||
        userItem?.email?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((userItem) =>
      departmentFilter ? userItem.department === departmentFilter : true
    )
    .filter((userItem) =>
      branchCode === "SUPERADMIN" && branchFilter
        ? userItem.branchCode === branchFilter
        : true
    )
    .sort((a, b) => {
      if (!sortOrder.key) return 0;
      return sortOrder.order === "asc"
        ? a[sortOrder.key] > b[sortOrder.key]
          ? 1
          : -1
        : a[sortOrder.key] < b[sortOrder.key]
        ? 1
        : -1;
    });

  const handleSort = (key) => {
    setSortOrder((prev) => ({
      key,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteUser(selectedUserId)).then(() => {
      refreshUsers();
      onClose();
    });
  };

  const handleDelete = (id) => {
    setSelectedUserId(id);
    onOpen();
  };

  const handleUserClick = (id) => {
    navigate(`/user/${id}`);
  };

  return (
    <Box
      p={5}
      maxWidth="100%"
      borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
      color={textColor}
      boxShadow="lg"
      overflowX="auto"
    >
      <Flex
        mb={4}
        gap={4}
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "stretch" : "center"}
      >
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width={isMobile ? "100%" : "30%"}
          bg={tableBgColor}
          borderRadius="md"
          boxShadow="sm"
        />
        <Select
          placeholder="Filter by department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          width={isMobile ? "100%" : "20%"}
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
            width={isMobile ? "100%" : "20%"}
            bg={tableBgColor}
            borderRadius="md"
            boxShadow="sm"
          >
            {getBranch().map((branch) => (
              <option key={branch} value={branch}>
                {`Branch ${branch.toUpperCase()}`}
              </option>
            ))}
          </Select>
        )}
      </Flex>

      <TableContainer>
        <Table variant="striped" colorScheme={tableColorScheme}>
          <Thead>
            <Tr>
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
                  colorScheme={tableColorScheme}
                  _hover={{ bg: hoverColor }}
                />
              </Th>
              <Th>Email</Th>
              <Th>Department</Th>
              <Th>Branch Code</Th>
              <Th>Role</Th>
              {user.role === "SUPERADMIN" && <Th>Actions</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.map((userItem, index) => (
              <Tr
                key={userItem.id}
                _hover={{ bg: hoverColor }}
                bg={index % 2 === 1 ? alternateRowBg : "transparent"}
              >
                <Td
                  onClick={() => handleUserClick(userItem.id)}
                  _hover={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  {userItem.name}
                </Td>
                <Td>{userItem.email}</Td>
                <Td>{userItem.department}</Td>
                <Td>{userItem.branchCode}</Td>
                <Td>{userItem.role}</Td>
                {user.role === "SUPERADMIN" && (
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FaEllipsisV />}
                        variant="outline"
                        aria-label="Options"
                        _hover={{ bg: hoverColor }}
                      />
                      <MenuList>
                        <MenuItem
                          icon={<FaEdit />}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Update
                        </MenuItem>
                        <MenuItem
                          icon={<FaTrash />}
                          color="red.500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(userItem.id);
                          }}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Custom Confirm Delete Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>Are you sure you want to delete this user?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteConfirm}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Users;
