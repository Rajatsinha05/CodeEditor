import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import {
  deleteUser,
  fetchUsers,
  fetchUsersByBranchCode,
} from "../../redux/User/userApi";
import CreateUserModal from "./CreateUserModal";
import Ability from "../../Permissions/Ability";

const Users = React.memo(({ branchCode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, user } = useSelector((store) => store.user);

  // Modal Controls
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateModalClose,
  } = useDisclosure();

  // States for Filters, Sorting, and Modal Data
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [sortOrder, setSortOrder] = useState({ key: "", order: "" });

  // Theme and Styling
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

  // Fetch Users on Mount
  useEffect(() => {
    refreshUsers();
  }, [dispatch]);

  const refreshUsers = useCallback(() => {
    if (user?.role === "ADMIN") {
      dispatch(fetchUsersByBranchCode(user?.branchCode));
    } else {
      dispatch(fetchUsers());
    }
  }, [dispatch, user?.role, user?.branchCode]);

  // Filter and Sort Users Dynamically
  const filteredUsers = useMemo(() => {
    return (users || [])
      .filter(
        (userItem) =>
          userItem?.name?.toLowerCase().includes(search.toLowerCase()) ||
          userItem?.email?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((userItem) =>
        departmentFilter ? userItem.department === departmentFilter : true
      )
      .filter((userItem) =>
        user?.role === "SUPERADMIN" && branchFilter
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
  }, [users, search, departmentFilter, branchFilter, sortOrder]);

  const handleSort = useCallback((key) => {
    setSortOrder((prev) => ({
      key,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Modal and CRUD Handlers
  const handleDeleteConfirm = useCallback(() => {
    dispatch(deleteUser(selectedUserId)).then(() => {
      refreshUsers();
      onDeleteModalClose();
    });
  }, [dispatch, selectedUserId, refreshUsers, onDeleteModalClose]);

  const handleDelete = useCallback(
    (id) => {
      setSelectedUserId(id);
      onDeleteModalOpen();
    },
    [onDeleteModalOpen]
  );

  const handleUpdate = useCallback(
    (userItem) => {
      setSelectedUser(userItem);
      onUpdateModalOpen();
    },
    [onUpdateModalOpen]
  );

  const handleUserClick = useCallback(
    (id) => {
      navigate(`/user/${id}`);
    },
    [navigate]
  );

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
      {/* Filters and Search */}
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
        {user?.role === "SUPERADMIN" && (
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

      {/* Users Table */}
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
              <Ability roles={["SUPERADMIN"]}>
                <Th>Actions</Th>
              </Ability>
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
                <Ability roles={["SUPERADMIN"]}>
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
                            handleUpdate(userItem);
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
                </Ability>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Confirm Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>Are you sure you want to delete this user?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteConfirm}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onDeleteModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update User Modal */}
      {isUpdateModalOpen && (
        <CreateUserModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            onUpdateModalClose();
            setSelectedUser(null);
          }}
          refreshUsers={refreshUsers}
          userData={selectedUser}
          mode="Update"
        />
      )}
    </Box>
  );
});

export default React.memo(Users);
