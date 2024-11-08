import React, { useEffect, useState } from "react";
import { getUsers, assignPermission, revokePermission } from "../../redux/apiSlice";
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
  Button,
  CheckboxGroup,
  Checkbox,
  Stack,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { FaSortAlphaDown, FaSortAlphaUpAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Users = ({ branchCode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((store) => store.data);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [sortOrder, setSortOrder] = useState({ key: "", order: "" });
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [action, setAction] = useState("assign");

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const hoverColor = useColorModeValue("teal.100", "teal.700");
  const tableBgColor = useColorModeValue("white", "gray.700");

  // Breakpoints for responsiveness
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Handle permission changes for each user
  const handlePermissionChange = (userId, permissions) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [userId]: permissions,
    }));
  };

  // Handle permission action (assign/revoke)
  const handlePermissionAction = (userId) => {
    const permissions = selectedPermissions[userId];
    if (!permissions || permissions.length === 0) return;

    if (action === "assign") {
      permissions.forEach((permission) => {
        dispatch(assignPermission({ userId, permission }));
      });
    } else {
      permissions.forEach((permission) => {
        dispatch(revokePermission({ userId, permission }));
      });
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      if (branchCode === "SUPERADMIN") {
        return true; // Show all users for SUPERADMIN
      }
      return user.branchCode === branchCode; // Only show users with the same branch code
    })
    .filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((user) =>
      departmentFilter ? user.department === departmentFilter : true
    )
    .filter((user) =>
      branchCode === "SUPERADMIN" && branchFilter
        ? user.branchCode === branchFilter
        : true
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

  // Handle navigation to user details
  const handleRowClick = (id) => {
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
      <Text fontSize="2xl" mb={4} fontWeight="bold" textAlign="center">
        Users Management
      </Text>

      {/* Search and Filter Section */}
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
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Android Developer">Android Developer</option>
          <option value="C Programming">C Programming</option>
          <option value="C++ Programming">C++ Programming</option>
          <option value="Data Science">Data Science</option>
          <option value="DevOps">DevOps</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Project Management">Project Management</option>
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
        <Select
          placeholder="Action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          width={isMobile ? "100%" : "20%"}
          bg={tableBgColor}
          borderRadius="md"
          boxShadow="sm"
        >
          <option value="assign">Assign Permission</option>
          <option value="revoke">Revoke Permission</option>
        </Select>
      </Flex>

      {/* Users Table */}
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
              <Th>Department</Th>
              <Th>
                Branch Code
                <IconButton
                  size="xs"
                  ml={2}
                  onClick={() => handleSort("branchCode")}
                  icon={
                    sortOrder.key === "branchCode" &&
                    sortOrder.order === "asc" ? (
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
              <Th>Role</Th>
              <Th>Permissions</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.map((user) => (
              <Tr key={user.id} _hover={{ bg: hoverColor, cursor: "pointer" }}>
                <Td>{user.id}</Td>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.department}</Td>
                <Td>{user.branchCode}</Td>
                <Td>{user.role}</Td>
                <Td>
                  <CheckboxGroup
                    value={selectedPermissions[user.id] || []}
                    onChange={(permissions) =>
                      handlePermissionChange(user.id, permissions)
                    }
                  >
                    <Stack
                      direction={isMobile ? "column" : "row"}
                      wrap="wrap"
                      spacing={2}
                    >
                      <Checkbox value="CREATE_CONTEST">Create Contest</Checkbox>
                      <Checkbox value="VIEW_CONTEST">View Contest</Checkbox>
                      <Checkbox value="EDIT_CONTEST">Edit Contest</Checkbox>
                      <Checkbox value="DELETE_CONTEST">Delete Contest</Checkbox>
                      <Checkbox value="MANAGE_USERS">Manage Users</Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    onClick={() => handlePermissionAction(user.id)}
                  >
                    {action === "assign" ? "Assign" : "Revoke"}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;
